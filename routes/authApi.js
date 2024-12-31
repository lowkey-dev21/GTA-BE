import express from "express";
import {
  signUp,
  login,
  verifyEmail,
  logout,
  forgotPassword,
  resetPassword,
  checkAuth,
} from "../controllers/auth/auth.js";
import { verifyJWT } from "../middleware/verifyJWT.js";

const router = express.Router();

router.post("/sign-up", signUp);
router.post("/login", login);
router.post("/logout", logout);

router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);
router.get("/check-auth", verifyJWT, checkAuth);

export default router;
