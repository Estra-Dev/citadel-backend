import { errorHandler } from "../utils/error.js";
import Comment from "../model/comments.model.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;
    if (userId !== req.userInfo.userID) {
      return next(
        errorHandler(403, "You are not allowed to make this comment")
      );
    }

    const newComment = await Comment.create({
      content,
      postId,
      userId,
    });

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};
