import User from "../../model/auth/user.model.js";
import moment from "moment";
import multer from "multer";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import "dotenv/config";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.APP_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.APP_CLOUDINARY_API_KEY,
  api_secret: process.env.APP_CLOUDINARY_SECRET_KEY,
});

const uploadsDir = path.join("uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(
      Math.random() * 1e9,
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
      throw Error("File type is not supported");
      return;
    }
    cb(null, true);
  },
});

// get profile
export const profile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findOne({ _id: userId });
    const firstName = user.firstName;
    const lastName = user.lastName;
    const email = user.email;
    const username = user.username;
    const phone = user.phone;
    const country = user.country;
    const profilePicture = user.profilePicture;
    const isVerified = user.isVerified;
    const bio = user.bio;
    const beginner = user.beginner;
    const amateur = user.amateur;
    const expert = user.expert;



    // Format the createdAt field to "May 19, 2023"
    const formattedCreatedAt = moment(user.createdAt).format("MMMM D, YYYY");
    const createdAt = formattedCreatedAt;

    res.status(200).json({
      firstName,
      lastName,
      email,
      username,
      phone,
      country,
      createdAt,
      isVerified,
      profilePicture,
      bio,
      beginner,
      amateur,
      expert,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit profile
export const editProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { firstName, lastName, bio } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ message: "Fields are required" });
    }

    // Find and update the user
    const user = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, bio },
      { new: true },
    );

    res.status(200).json({
      message: "User updated successfully",
      user: {
        bio: user.bio,
        fullname: user.firstName + " " + user.lastName,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Handle single image upload and update profile picture
export const uploadProfilePicture = [
  upload.single("profilePicture"), // 'profilePicture' is the field name in the form
  async (req, res) => {
    try {
      const userId = req.user._id;
      const profilePicture = req.file;

      // Upload the file to Cloudinary
      const result = await cloudinary.uploader.upload(profilePicture.path, {
        resource_type: "image",
        transformation: [
          { quality: "auto", fetch_format: "auto" }, // Adjust quality and format
        ],
      });

      // Update user profile picture with Cloudinary URL
      const user = await User.findByIdAndUpdate(
        userId,
        { profilePicture: result.secure_url }, // Set the Cloudinary URL
        { new: true },
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "Profile picture updated",
        user: {
          fullname: user.firstName + " " + user.lastName,
          profilePicture: user.profilePicture, // Updated profile picture URL
        },
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
];

// Route for deleting profile picture
export const deleteProfilePicture = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePicture: null },
      { new: true },
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile picture deleted ",
      user: {
        username: user.username,
        fullname: `${user.firstName} ${user.lastName}`,
        profilePicture: user.profilePicture, // This will be null after deletion
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
