import User from "../model/user.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

const saltRounds = 10;

export const register = async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      next(errorHandler(400, "This Email is already in use"));
    } else {
      const hashedPassword = await bcryptjs.hash(password, saltRounds);
      const newUser = await User.create({
        firstname,
        lastname,
        email,
        password: hashedPassword,
      });

      res.status(201).json(newUser);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (!userExist) {
      next(errorHandler(404, "This user Does not Exist"));
    } else {
      const passOk = await bcryptjs.compare(password, userExist.password);
      if (!passOk) {
        next(errorHandler(400, "Wrong Credentials"));
      } else {
        const { password: pass, ...rest } = userExist._doc;
        const token = jwt.sign({ userID: userExist._id }, process.env.SECRETE);
        res.status(201).cookie("access_token", token).json({ token, rest });
      }
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { firstname, lastname, email, googlePhotoUrl } = req.body;

  try {
    const userExist = await User.findOne({ email });

    if (userExist) {
      const { password: pass, ...rest } = userExist._doc;
      const token = jwt.sign({ userID: userExist._id }, process.env.SECRETE);
      res.status(201).cookie("access_token", token).json({ token, rest });
    } else {
      // generate a paaword for the user
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = await bcryptjs.hash(generatedPassword, saltRounds);
      const newUser = await User.create({
        firstname,
        lastname: lastname.toLowerCase() + Math.random().toString(9).slice(-3),
        email,
        password: hashedPassword,
        photoUrl: googlePhotoUrl,
      });

      const token = jwt.sign({ userID: newUser._id }, process.env.SECRETE);
      const { password: pass, ...rest } = newUser._doc;
      res.status(201).cookie("access_token", token).json({ token, rest });

      console.log(newUser);
    }
  } catch (error) {
    next(error);
  }
};
