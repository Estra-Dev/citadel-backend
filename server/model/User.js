import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 50,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR__H-FaeADAspQbggprYkIa8oWFi2yQXs5zCjvV3ZGKA&s",
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);
export default User;
