import express from "express";
const router = express.Router();
import {
  createPost,
  getAllPosts,
  getPersonalPost,
  likePost,
  commentPost,
  deletePost,
} from "../controllers/blog/blog.js";

router.post("/post", createPost);
router.get("/posts", getAllPosts);
router.get("/personalPost", getPersonalPost);
router.post("/post/like", likePost);
router.post("/post/comment", commentPost);
router.delete("/post/delete", deletePost);

export default router;
