import User from "../../model/auth/user.model.js"
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

const uploadsDir = path.join("src/uploads");
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

// create username in the onboarding
export const createUsername = async (req, res) => {
  const userId = req.user._id;
  const { username } = req.body;

  try {
    // First, check if username already exists
    const existingUsername = await User.findOne({
      username: username + ".gta",  // Check for the complete username with .gta
      _id: { $ne: userId }  // Exclude current user from the search
    });

    if (existingUsername) {
      return res.status(400).json({ message: "Username not available" });
    }

    // If username doesn't exist, update the user
    const user = await User.findByIdAndUpdate(
      userId,
      { username: username + ".gta", "starter.onboard1": true },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Username updated",
      username: user.username,
      onboard1: user.starter.onboard1
    });

  } catch (error) {
    console.error("Error creating username:", error);
    return res.status(500).json({
      message: "Error updating username",
      error: error.message
    });
  }
};

export const createPhoneNumber = async (req, res) => {
  const userId = req.user._id
  console.log(userId)
  const { phone } = req.body
  try {
    const user = await User.findByIdAndUpdate(userId, { phone, "starter.onboard2": true }, { new: true, runValidators: true })
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(201).json({ message: "Phone number updated", phone: user.phone, onboard2: user.starter.onboard2 })
  } catch (error) {
    res.status(401).json({ error: error.message, message: "failed to update country" })

  }
}

export const createCountry = async (req, res) => {
  const userId = req.user._id
  console.log(userId)
  const { country } = req.body
  try {
    const user = await User.findByIdAndUpdate(userId, { country, "starter.onboard3": true }, { new: true, runValidators: true })
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(201).json({ message: "Country Updated", country: user.country, onboard3: user.starter.onboard3 })
  } catch (error) {
    res.status(401).json({ error: error.message, message: "failed to update country" })

  }
}


// Handle single image upload and update profile picture
export const uploadProfilePicture = [
  upload.single("profilePicture"), // 'profilePicture' is the field name in the form
  async (req, res) => {
    try {
      const userId = req.user._id;
      const profilePicture = req.file || {};

      if (!profilePicture) return res.status(400).json({ message: " field is required" })

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
        { profilePicture: result.secure_url, "starter.completed": true }, // Set the Cloudinary URL
        { new: true, runValidators: true },
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        message: "Profile picture updated",
        user: {
          fullname: user.firstName + " " + user.lastName,
          profilePicture: user.profilePicture, // Updated profile picture URL
          complete: user.starter.completed
        },
      });
    } catch (error) {
      res.status(500).json({ error: error.message, message: "Failed to upload profile picture" });
    }
  },
];


//skips

export const skipOnboardOne = async (req, res) => {
  try {
    const userId = req.user._id
    console.log("UserId:", userId)
    const user = await User.findByIdAndUpdate(userId, { "starter.onboard1": true }, { new: true, runValidators: true })
    res.status(200).json({ message: "Skipped Username", onboard1: user.starter.onboard1 })

  } catch (error) {
    res.status(400).json({ error: error.message, message: "failed to skip" })
  }
}


export const skipOnboardTwo = async (req, res) => {
  try {
    const userId = req.user._id
    console.log("UserId:", userId)
    const user = await User.findByIdAndUpdate(userId, { "starter.onboard2": true }, { new: true, runValidators: true })
    res.status(200).json({ message: "Skipped Phone number ", onboard2: user.starter.onboard2 })

  } catch (error) {
    res.status(400).json({ error: error.message, message: "failed to skip" })
  }
}


export const skipOnboardThree = async (req, res) => {
  try {
    const userId = req.user._id
    console.log("UserId:", userId)
    const user = await User.findByIdAndUpdate(userId, { "starter.onboard3": true }, { new: true, runValidators: true })
    res.status(200).json({ message: "Skipped Country", onboard3: user.starter.onboard3 })

  } catch (error) {
    res.status(400).json({ error: error.message, message: "failed to skip" })
  }
}

export const skipAllOnboard = async (req, res) => {
  try {
    const userId = req.user._id
    console.log("UserId:", userId)
    const user = await User.findByIdAndUpdate(userId, { "starter.completed": true }, { new: true, runValidators: true })
    res.status(200).json({ message: "Skipped All", completed: user.starter.completed })

  } catch (error) {
    res.status(400).json({ error: error.message, message: "failed to skip" })
  }

}



