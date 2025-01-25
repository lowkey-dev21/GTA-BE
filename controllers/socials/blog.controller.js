import { Post, Comment } from "../../model/socials/post.model.js";
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
  try {
    const { title, content, images } = req.body;
    const user = req.userId; // Get from middleware

    const post = new Post({
      title,
      content,
      images,
      author: user._id
    });

    await post.save();
    console.log('Created post with author:', user._id);

    const savedPost = await Post.findById(post._id)
      .populate('author')
      .lean();

    res.status(201).json(savedPost);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get all posts sorted by createdAt in descending order, along with the author's firstName, lastName, comments, likes, and likes count.
export const getAllPosts = async (req, res) => {
  try {
    // Debug: Log the query
    console.log('Fetching posts...');

    const posts = await Post.find()
      .populate({
        path: 'author',
        model: 'SocialsUser',
        select: 'username name profilePicture userId'
      })
      .sort({ createdAt: -1 })
      .lean();

    // Debug: Log first post and its author
    // console.log('First post author:', posts[0]?.author);

    const formattedPosts = posts.map(post => {
      // Debug: Log each post's author data
      // console.log('Processing post:', post._id, 'Author:', post.author);

      return {
        _id: post._id,
        title: post.title,
        content: post.content,
        author: post.author?.username || 'Unknown',
        fullName: post.author?.name || 'Unknown',
        profilePicture: post.author?.profilePicture || null,
        createdAt: formatDistanceToNow(new Date(post.createdAt), {
          addSuffix: true,
        }),
        likes: post.likes || [],
        likesCount: post.likes?.length || 0,
        comments: post.comments || []
      };
    });

    // Debug: Log formatted posts
    // console.log('Formatted posts:', formattedPosts.length);

    res.status(200).json({ posts: formattedPosts });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ message: error.message });
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
    const userId = req.user._id; //liker ID
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
