import express from "express";
import { emailJWT } from "../middleware/email.middleware.js";
import {
  profile,
  editProfile,
  deleteProfilePicture,
  uploadProfilePicture,
} from "../controllers/home/profile.controller.js";

import {
  changePassword,
  getVerifyEmailToken,
  changeUsername,
  getVerifyChangeEmailToken,
  verifychangeEmailOtp,
  changeEmail,
} from "../controllers/home/accountSettings.controller.js";

const router = express.Router();

// profile restApi
router.get("/profile", profile);
router.post("/editProfile", editProfile);

router.delete("/deleteProfilePicture", deleteProfilePicture);
router.post("/user-profilePicture", uploadProfilePicture);

// account settings restAPI
router.post("/account/change-password", changePassword);
router.get("/account/verify-email-token", getVerifyEmailToken);
router.post("/account/change-username", changeUsername);
router.get("/account/verify-changeEmail-token", getVerifyChangeEmailToken);
router.post("/account/verify-changeEmail-otp", verifychangeEmailOtp);
router.patch("/account/change-email", emailJWT, changeEmail);

export default router;
