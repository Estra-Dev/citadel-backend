import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;
  console.log(token);

  if (!token) {
    return next(errorHandler(401, "Unauthorise"));
  }

  jwt.verify(token, process.env.SECRETE, (err, userInfo) => {
    if (err) {
      return next(errorHandler(403, "forbidden"));
    }

    req.userInfo = userInfo;
    next();
  });
};
