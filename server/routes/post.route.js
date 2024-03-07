import express from "express";
import { createPost, getposts } from "../controllers/post.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

router.post("/create", verifyToken, createPost);
router.get("/getposts", getposts);

export default router;
