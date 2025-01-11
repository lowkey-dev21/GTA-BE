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

import { createSocialsUser } from "../controllers/socials/user.controller.js";

router.post("/user/create-user",createSocialsUser)


router.post("/blog/post", createPost);
router.get("/blog/posts", getAllPosts);
router.get("/blog/personalPost", getPersonalPost);
router.post("/blog/post/like", likePost);
router.post("/blog/post/comment", commentPost);
router.delete("/blog/post/delete", deletePost);

export default router;
