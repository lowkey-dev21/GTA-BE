import express from "express";
const router = express.Router();


// Post imports
import {
  createPost,
  getAllPosts,
  getPersonalPost,
  likePost,
  commentPost,
  deletePost,
} from "../controllers/socials/post.controller.js";

// Follow imports
import { follow, getFollowers, getFollowing, getFollowingStatus, getFollowSuggestion, unfollow } from "../controllers/socials/follow.controller.js";



// Posting
router.post("/post/create-post",  createPost);
router.get("/post/get-posts",  getAllPosts);
router.get("/post/get-personal-posts",  getPersonalPost);
router.post("/post/like-post",  likePost);
router.post("/post/comment-post",  commentPost);
router.delete("/post/delete-post",  deletePost);

// Following
router.post("/follow/follow-user", follow)
router.post("/follow/unfollow-user", unfollow)
router.post("/follow/get-following", getFollowers)
router.post("/follow/get-following", getFollowing)
router.post("/follow/get-following-status", getFollowingStatus)
router.post("/follow/get-follow-suggestion", getFollowSuggestion)
export default router;
