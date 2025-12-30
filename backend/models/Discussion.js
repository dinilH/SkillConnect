// backend/models/Discussion.js
const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const discussionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["All", "Academics", "Coding", "Events", "General", "Career", "Mentorship"],
      default: "General",
    },
    tags: [{ type: String }],
    content: {
      type: String,
      required: true,
    },
    replies: [replySchema],
    views: {
      type: Number,
      default: 0,
    },
    viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likes: {
      type: Number,
      default: 0,
    },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    isPinned: {
      type: Boolean,
      default: false,
    },
    isLocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Update views count when a user views a discussion
discussionSchema.methods.incrementView = function (userId) {
  if (!this.viewedBy.includes(userId)) {
    this.viewedBy.push(userId);
    this.views += 1;
  }
};

module.exports = mongoose.model("Discussion", discussionSchema);
