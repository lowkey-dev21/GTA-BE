import User from "../../model/user/user.model.js";
import bcrypt from "bcrypt";
import generator from "../../utils/generator.util.js";
import { emailVerificationTemplate } from "../../mailer/emailTemplate.mailer.js";

import { sendEmail } from "../../mailer/emial.config.js";
import { profileUpdatedTemplate } from "../../mailer/emailTemplate.mailer.js";

// change password
export const changePassword = async (req, res) => {
  const { currentPassword, password } = req.body; // Current and new password
  const userId = req.user._id; // User ID from token
  try {
    // Find the user by their ID
    const user = await User.findOne({ _id: userId });

    // Compare the entered current password with the hashed password in the database
    const correctCurrentPassword = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    // If the entered password is incorrect, send a 403 response
    if (!correctCurrentPassword) {
      return res.status(403).json({ message: "Incorrect password" });
    }

    if (currentPassword === password) {
      return res
        .status(400)
        .json({
          message: "New password must be different from current password",
        });
    }

    // Hash the new password and update it in the database
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword; // Set the new password
    await user.save(); // Save the user with the new password

    // Send a success message
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    // Handle any server errors
    res.status(500).json({ message: "Server Error" });
  }
};

// get verify Email Token
export const getVerifyEmailToken = async (req, res) => {
  const userId = req.user._id; // User ID from token
  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new verification token and expiration time
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = Date.now() + 10 * 60 * 1000; // 10 min expiration
    await user.save();

    const template = {
      subject: "Email Verification",
      text: "Please verify your email.",
      html: emailVerificationTemplate.html
        .replace("{verificationToken}", user.verificationToken)
        .replace("{username}", user.firstName),
    };

    // Send Verification Email
    await sendEmail(res, user.email, template); // Ensure this is awaited if it's

    res.status(200).json({
      success: "ok",
      message: "Check your email for the verification code",
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message }); // Respond with error message
  }
};

// change username
export const changeUsername = async (req, res) => {
  const { newUsername } = req.body; // New username
  const userId = req.user._id; // User ID from token
  try {
    // Find the user by their ID
    const user = await User.findOne({ _id: userId });

    // Check if the new username already exists
    const usernameExists = await User.findOne({ username: newUsername });

    if (usernameExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Update the username in the database
    user.username = newUsername;
    await user.save();

    const template = {
      subject: "Username Changed",
      text: "Username Changed",
      html: profileUpdatedTemplate.html.replace("{username}", newUsername),
    };

    await sendEmail(res, user.email, template);

    // Send a success message
    res.status(200).json({
      message: "Username changed successfully",
    });
  } catch (error) {
    // Handle any server errors
    res.status(500).json({ message: "Server Error" });
  }
};

// get verify change Email Token
export const getVerifyChangeEmailToken = async (req, res) => {
  const userId = req.user._id; // User ID from token
  try {
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new verification token and expiration time
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    user.verificationToken = verificationToken;
    user.verificationTokenExpiresAt = Date.now() + 10 * 60 * 1000; // 10 min expiration
    await user.save();

    const template = {
      subject: "Email Verification",
      text: "Please verify your email.",
      html: emailVerificationTemplate.html
        .replace("{verificationToken}", user.verificationToken)
        .replace("{username}", user.firstName),
    };

    // Send Verification Email
    await sendEmail(res, user.email, template);

    res.status(200).json({
      success: "ok",
      message: "otp sent to your email",
      code: verificationToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message }); // Respond with error message
  }
};

// verify changeEmail otp
export const verifychangeEmailOtp = async (req, res) => {
  const { otp } = req.body;
  try {
    const user = await User.findOne({
      verificationToken: otp,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid Verification Code" });
    }

    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    //generate token 
    const token = generator.generateEmailToken(res, user._id);
    await user.save();

    res.status(200).json({
      message: "Email verified",
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message }); // Return a response with error message
  }
};

// change email
export const changeEmail = async (req, res) => {
  const { newEmail } = req.body;

  // Check if userId is available in req.token
  const userId = req.user?._id; // Use optional chaining to avoid errors if token is missing

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User ID not found" });
  }

  try {
    // Use findByIdAndUpdate to directly update the email
    const user = await User.findByIdAndUpdate(
      userId,
      { email: newEmail },
      { new: true }, // return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      success: "ok",
      message: "Email changed successfully",
      email: user.email, // Correctly return the updated email
    });
  } catch (error) {
    console.error("Error changing email:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
