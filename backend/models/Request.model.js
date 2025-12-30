const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: ["Frontend", "Backend", "UI/UX", "Mobile Development", "DevOps", "Data Science", "Others"],
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    skills: {
      type: [String],
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      default: "Open",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
