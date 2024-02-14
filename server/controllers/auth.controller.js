import User from "../model/user.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const saltRounds = 10;

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      res.json({ message: "This Email is already in use" });
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
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (!userExist) {
      res.json({ message: "This user Does not Exist" });
    } else {
      const passOk = await bcryptjs.compare(password, userExist.password);
      if (!passOk) {
        res.json({ message: "Wrong Credentials" });
      } else {
        const { password: pass, ...rest } = userExist._doc;
        const token = jwt.sign({ userID: userExist._id }, process.env.SECRETE);
        res.status(201).cookie("access_token", token).json({ token, rest });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
