import { Post, Comment } from "../../model/socials/post.model.js";
import SocialsUser from "../../model/auth/user.model.js";
import { formatDistanceToNow } from "date-fns";
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

// Create a new post for the authenticated user, including the uploaded image.
export const createPost = async (req, res) => {
  upload.single("images")(req, res, async (err) => {
    if (err) {
      console.error("Multer Error:", err);
      return res.status(400).json({ message: err.message });
    }

    try {
      const userId = req.user._id;

      if (!userId) {
        return res.status(401).json({ message: "User not authorized" });
      }

      const { content, title } = req.body;

      if (!content || !title) {
        return res
          .status(400)
          .json({ message: "Title and content are required" });
      }

      let imageUrl = "";
      if (req.file) {
        try {
          const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: "posts",
          });
          imageUrl = uploadResult.secure_url;
        } catch (cloudinaryError) {
          console.error("Cloudinary Upload Error:", cloudinaryError);
          return res.status(500).json({ message: "Image upload failed" });
        }
      }

      const user = await SocialsUser.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const post = new Post({
        title,
        content,
        author: userId,
        images: imageUrl,
      });

      await post.save();

      res.status(201).json({
        fullName: `${user.firstName} ${user.lastName}`,
        post,
        message: "Posted successfully",
      });
    } catch (error) {
      console.error("Server Error:", error);
      res.status(500).json({ message: error.message });
    }
  });
};

// Get all posts sorted by createdAt in descending order, along with the author's firstName, lastName, comments, likes, and likes count.
export const getAllPosts = async (req, res) => {
  try {
    const userId = req.user._id;
    const posts = await Post.find()
      .sort({ createdAt: -1 }) // Sort posts by creation date in descending order
      .populate({
        path: "author",
        select: "username profilePicture firstName lastName",
      }) // Populate author's username
      .populate({
        path: "comments", // Populate comments
        populate: {
          path: "commenterId", // Populate the commenter inside each comment
          select: "username profilePicture firstName lastName", // Only return the username
        },
      })
      .populate({
        path: "likes",
        select: "firstName lastName username profilePicture ",
      });

    // Format the response to include the commenter's username directly
    const formattedPosts = posts.map((post) => ({
      _id: post._id,
      title: post.title,
      content: post.content,
      images: post.images,
      author: post.author?.username,
      profilePicture: post.author?.profilePicture,
      fullName: post.author?.firstName + " " + post.author?.lastName,
      createdAt: formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
      }), // e.g., "5 hours ago"
      likes: post.likes,
      likesCount: post.likes.length, // Include likes count
      liked: post.likes.some((like) => like.equals(userId)),
      comments: post.comments.map((comment) => ({
        _id: comment._id,
        text: comment.text,
        commenter: comment.commenterId?.username,
        profilePicture: comment.commenterId?.profilePicture,
        fullName:
          comment.commenterId?.firstName + " " + comment.commenterId?.lastName,
      })),
    }));

    res.status(200).json({ posts: formattedPosts });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};

// Get personal posts of a user based on their userId from the token in the request header.
export const getPersonalPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await SocialsUser.findById(userId); // Get userId from the token

    // Find all posts by the author (userId)
    const posts = await Post.find({ author: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "name username bio profilePicture",
      })
      .populate({
        path: "comments",
        populate: {
          path: "commenterId",
          select: "username profilePicture",
        },
      })
      .populate({
        path: "likes",
        select: "name lastName username profilePicture",
      });

    // If no posts found, return a 404 response
    if (!posts || posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    // Calculate the total number of likes for all posts
    const totalLikes = posts.reduce((acc, post) => acc + post.likes.length, 0);

    const blogProfile = {
      username: user.username,
      bio: user.bio,
      profilePicture: user.profilePicture,
      name: user.name,
      totalLikes,
    };

    // Format the posts to include commentCount and likesCount
    const formattedPosts = posts.map((post) => ({
      _id: post._id,
      title: post.title,
      content: post.content,
      author: post.name,
      username: post.author.username,
      profilePicture: post.author.profilePicture,
      createdAt: formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
      }),
      likesCount: post.likes.length, // Calculate likes count
      commentCount: post.comments.length, // Calculate comment count
      likes: post.likes, // Already populated likes
      comments: post.comments.map((comment) => ({
        _id: comment._id,
        text: comment.text,
        commenter: comment.commenterId?.username, // Return commenter's username
      })),
    }));

    // Send the response with the posts and post count
    res.status(200).json({
      posts: formattedPosts,
      blogProfile,
      postCount: posts.length,
    });
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: error.message });
  }
};

// likes
export const likePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { postId } = req.body;

    if (!postId) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const userAlreadyLiked = post.likes.includes(userId);

    if (userAlreadyLiked) {
      post.likes = post.likes.filter(
        (like) => like.toString() !== userId.toString(),
      );

      await post.save();

      return res.status(200).json({
        message: userAlreadyLiked
          ? "Post unliked successfully"
          : "Post liked successfully",
        likesCount: post.likes.length,
        // Include the updated liked status
      });
    }

    post.likes.push(userId);

    await post.save();

    res.status(200).json({
      message: "Post liked successfully",
      likesCount: post.likes.length,
      // Return the updated likes count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Comment on a post
export const commentPost = async (req, res) => {
  try {
    const userId = req.user._id; // Commenter ID
    const { postId, commentText } = req.body;

    if (!postId || !commentText) {
      return res
        .status(400)
        .json({ message: "Post ID and comment text are required" });
    }

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create a new comment
    const comment = new Comment({
      text: commentText,
      commenterId: userId, // Link the commenter
      postId, // Associate with the post
    });

    // Save the comment
    await comment.save();

    // Push the comment ID to the post's comments array
    post.comments.push(comment._id);
    await post.save();

    res.status(200).json({
      message: "Comment added successfully",
      comment,
      post,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete post
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.body;

    // Find the post first to ensure it exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    // Delete all comments associated with the post
    await Comment.deleteMany({ postId: postId });

    res.status(200).json({ message: "Post and associated comments deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
