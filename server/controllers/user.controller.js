import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import User from "../model/user.js";

export const updateUser = async (req, res, next) => {
  // console.log(req.userInfo);
  if (req.userInfo.userID !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(
        errorHandler(400, "Password must be at least 6 characters long")
      );
    }
    req.body.password = await bcryptjs.hash(req.body.password, 10);
  }

  if (req.body.firstname) {
    if (req.body.firstname.length < 2 || req.body.firstname.length > 14) {
      return next(
        errorHandler(
          400,
          "First Name should not be below 2 or more than 14 characters"
        )
      );
    }
    if (req.body.firstname.includes(" ")) {
      return next(errorHandler(400, "First Name cannot contain Spaces"));
    }
    if (!req.body.firstname.match(/^[a-zA-Z]+$/)) {
      return next(errorHandler(400, "First Name can only contain letters"));
    }
  }
  if (req.body.lastname) {
    if (req.body.lastname.length < 2 || req.body.lastname.length > 14) {
      return next(
        errorHandler(
          400,
          "First Name should not be below 2 or more than 14 characters"
        )
      );
    }
    if (req.body.lastname.includes(" ")) {
      return next(errorHandler(400, "First Name cannot contain Spaces"));
    }
    if (!req.body.lastname.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "First Name can only contain letters and numbers")
      );
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          email: req.body.email,
          photoUrl: req.body.googlePhotoUrl,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password: pass, ...rest } = updatedUser._doc;
    res.status(201).json(rest);
  } catch (error) {
    next(error);
  }
};
