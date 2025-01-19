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
import { verifySocialsUser } from "../middleware/socials.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

router.post("/user/create-user",verifyJWT,createSocialsUser)


router.post("/blog/post",verifyJWT, verifySocialsUser,  createPost);
router.get("/blog/posts",verifyJWT,  getAllPosts);
router.get("/blog/personalPost",verifyJWT, verifySocialsUser,  getPersonalPost);
router.post("/blog/post/like",verifyJWT, verifySocialsUser,  likePost);
router.post("/blog/post/comment",verifyJWT, verifySocialsUser,  commentPost);
router.delete("/blog/post/delete",verifyJWT, verifySocialsUser,  deletePost);

export default router;
