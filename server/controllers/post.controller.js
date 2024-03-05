import Post from "../model/post.model.js";
import { errorHandler } from "../utils/error.js";

export const createPost = async (req, res, next) => {
  if (!req.userInfo.isAdmin) {
    return next(errorHandler(403, "You are not allowed to Post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please Provide all the required Field"));
  }

  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");

  try {
    const newPost = await Post.create({
      ...req.body,
      slug,
      userId: req.userInfo.userID,
    });

    res.status(201).json({ newPost, message: "Saved Post" });
  } catch (error) {
    next(error);
  }
};
