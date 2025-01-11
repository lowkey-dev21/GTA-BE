import User from "../../model/auth/user.model.js";
import validator from "validator";
import bcrypt from "bcrypt";
import "dotenv/config";
import crypto from "crypto";
import { generateTokenAndCookie } from "../../utils/generateToken.util.js";
import { sendEmail } from "../../mailer/emial.config.js";
import {
  emailVerificationTemplate,
  welcomeEmailTemplate,
  resetPasswordTemplate,
  passwordChangedTemplate,
} from "../../mailer/emailTemplate.mailer.js";

// sign up
export const signUp = async (req, res) => {
  const { firstName, lastName, email, password } =
    req.body;

  try {
    // Check required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password
    ) {
      return res.status(400).json({ message: "Fields are required" });
    }

    // Validate Email
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    // Validate Password
    if (!validator.isStrongPassword(password)) {
      return res.status(400).json({ message: "Password is not strong enough" });
    }

    // Check if email or username already exists
    const emailExists = await User.findOne({ email });


    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }



    // Hash Password
    const hash = await bcrypt.hash(password, 10);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // Create User
    const user = new User({
      firstName,
      lastName,
      email,
      password: hash,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, //24hours
      lastLogin: new Date(),
    });

    await user.save();

    // Create Token
    const token = await generateTokenAndCookie(res, user._id);

    res.status(201).json({
      message: "Signup successful",
      success: true,
      user: { ...user._doc, password: undefined, verificationToken: undefined },
    });

    const template = {
      subject: "Emial Verification",
      text: "Email Verification ",
      html: emailVerificationTemplate.html
        .replace("{verificationToken}", user.verificationToken)
        .replace("{username}", user.firstName),
    };

    // Send Verification Email
    sendEmail(res, user.email, template);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// verify Email Address
export const verifyEmail = async (req, res) => {
  const { code } = req.body;

  try {
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid Verification Code" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();

    const template = {
      subject: welcomeEmailTemplate.subject,
      text: welcomeEmailTemplate.text,
      html: welcomeEmailTemplate.html
        .replace("{username}", user.firstName)
        .replace("{clientURL}", process.env.CLIENT_URL),
    };

    sendEmail(res, user.email, template);

    // Create Token
    const token = await generateTokenAndCookie(res, user._id);

    res.status(200).json({
      message: "Email verified successfully",
      user: {
        verified: user.isVerified,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// login
export const login = async (req, res) => {
  const { emailOrUsername, password } = req.body;

  try {
    // Check required fields
    if (!emailOrUsername || !password) {
      return res.status(400).json({ message: "Fields are required" });
    }

    // Validate Email format if it's an email
    if (
      validator.isEmail(emailOrUsername) &&
      !validator.isEmail(emailOrUsername)
    ) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    // Find User by email or username
    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // Compare Password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Incorrect Password" });
    }

    // Create Token
    const token = await generateTokenAndCookie(res, user._id);

    res.status(200).json({
      success: true,
      message: "User Logged in successfully",
      user: user.lastLogin,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

//logout
export const logout = async (req, res) => {
  try {
    // Clear the token cookie with all possible options
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      domain: "localhost" // Add this for local testing
    });

    // Clear it again without domain for good measure
    res.clearCookie("token");

    // Send response
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      success: false,
      message: "Error during logout",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

// forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // generate Token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordTokenExpiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Update user document with resetToken and resetPasswordTokenExpiresAt
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpiresAt = resetPasswordTokenExpiresAt;
    await user.save();

    // Create Reset Password URL with token
    const CLIENT_URL = process.env.CLIENT_URL
    const resetLink = `${CLIENT_URL}/auth/reset-password/${resetToken}`;
    console.log(resetLink);

    // Send Reset Password Email
    const template = {
      subject: "Reset Password",
      text: "Reset Password ",
      html: resetPasswordTemplate.html
        .replace("{resetLink}", resetLink)
        .replace("{username}", user.firstName),
    };

    // Send Reset Password Email
    sendEmail(res, user.email, template);
    res.status(200).json({ message: "Reset Password Email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// reset password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: " Invalid or Link Expired, generate another link" });
    }

    // update password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiresAt = undefined;
    await user.save();

    // Send password changed notification
    const template = {
      subject: passwordChangedTemplate.subject || "Password Changed",
      text: passwordChangedTemplate.text,
      html: passwordChangedTemplate.html.replace("{username}", user.firstName),
    };

    // Send password changed notification email
    sendEmail(res, user.email, template);

    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) { }
};

//chechk auth
export const checkAuth = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) return;
    res.status(200).json({ user: { ...user._doc, password: undefined } });
  } catch (error) { }
};
