import express from "express";
const router = express.Router();

import {
  createPost,
  getAllPosts,
  getPersonalPost,
  likePost,
  commentPost,
  deletePost,
} from "../controllers/socials/blog.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";



router.post("/post/create-post",  createPost);
router.get("/post/get-posts",  getAllPosts);
router.get("/post/get-personal-posts",  getPersonalPost);
router.post("/post/like-post",  likePost);
router.post("/post/comment-post",  commentPost);
router.delete("/post/delete-post",  deletePost);

export default router;
