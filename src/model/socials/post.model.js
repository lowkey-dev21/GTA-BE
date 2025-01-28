import mongoose from "mongoose";

const Schema = mongoose.Schema;

const postSchema = new Schema({
  tag: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
  images: {
    type: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  visibility: {
    type: String,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment", // Referencing Comment model
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Virtual field to calculate likes count
postSchema.virtual("likesCount").get(function () {
  return this.likes.length;
});

// Virtual field to calculate comments count
postSchema.virtual("commentsCount").get(function () {
  return this.comments.length;
});

postSchema.set("toJSON", { virtuals: true });

const commentSchema = new Schema({
  commenterId: {
    type: Schema.Types.ObjectId,
    ref: "User", // Reference to the User who commented
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post", // Reference to the Post
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Comment = mongoose.model("Comment", commentSchema);
export const Post = mongoose.model("Post", postSchema);
