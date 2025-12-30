// backend/controllers/discussionController.js
const Discussion = require("../models/Discussion");
const User = require("../models/User");

// Get all discussions with filters
exports.getDiscussions = async (req, res) => {
  try {
    const { category, tags, search, sortBy = "recent", limit = 50 } = req.query;

    let query = {};

    // Filter by category
    if (category && category !== "All") {
      query.category = category;
    }

    // Filter by tags
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : tags.split(",");
      query.tags = { $in: tagArray };
    }

    // Search in title, content
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    // Sorting
    let sort = {};
    switch (sortBy) {
      case "views":
        sort = { views: -1 };
        break;
      case "replies":
        sort = { replies: -1 };
        break;
      case "likes":
        sort = { likes: -1 };
        break;
      default:
        sort = { createdAt: -1 }; // recent
    }

    const discussions = await Discussion.find(query)
      .populate("author", "firstName lastName username profileImage")
      .sort(sort)
      .limit(parseInt(limit));

    res.json({ success: true, discussions });
  } catch (error) {
    console.error("Get Discussions Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Get single discussion by ID
exports.getDiscussionById = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;

    const discussion = await Discussion.findById(id)
      .populate("author", "firstName lastName username profileImage")
      .populate("replies.author", "firstName lastName username profileImage");

    if (!discussion) {
      return res.json({ success: false, message: "Discussion not found" });
    }

    // Increment view if userId provided
    if (userId && !discussion.viewedBy.includes(userId)) {
      discussion.incrementView(userId);
      await discussion.save();
    }

    res.json({ success: true, discussion });
  } catch (error) {
    console.error("Get Discussion Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Create new discussion
exports.createDiscussion = async (req, res) => {
  try {
    const { title, category, tags, content, authorId } = req.body;

    if (!title || !content || !authorId) {
      return res.json({
        success: false,
        message: "Title, content, and author are required",
      });
    }

    const discussion = new Discussion({
      title,
      author: authorId,
      category: category || "General",
      tags: tags || [],
      content,
    });

    await discussion.save();

    const populated = await Discussion.findById(discussion._id).populate(
      "author",
      "firstName lastName username profileImage"
    );

    res.json({ success: true, discussion: populated });
  } catch (error) {
    console.error("Create Discussion Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Update discussion
exports.updateDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, category, tags, content, userId } = req.body;

    const discussion = await Discussion.findById(id);

    if (!discussion) {
      return res.json({ success: false, message: "Discussion not found" });
    }

    // Check if user is the author
    if (discussion.author.toString() !== userId) {
      return res.json({
        success: false,
        message: "You can only edit your own discussions",
      });
    }

    if (title) discussion.title = title;
    if (category) discussion.category = category;
    if (tags) discussion.tags = tags;
    if (content) discussion.content = content;

    await discussion.save();

    const populated = await Discussion.findById(discussion._id).populate(
      "author",
      "firstName lastName username profileImage"
    );

    res.json({ success: true, discussion: populated });
  } catch (error) {
    console.error("Update Discussion Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Delete discussion
exports.deleteDiscussion = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const discussion = await Discussion.findById(id);

    if (!discussion) {
      return res.json({ success: false, message: "Discussion not found" });
    }

    // Check if user is the author
    if (discussion.author.toString() !== userId) {
      return res.json({
        success: false,
        message: "You can only delete your own discussions",
      });
    }

    await Discussion.findByIdAndDelete(id);

    res.json({ success: true, message: "Discussion deleted successfully" });
  } catch (error) {
    console.error("Delete Discussion Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Add reply to discussion
exports.addReply = async (req, res) => {
  try {
    const { id } = req.params;
    const { authorId, content } = req.body;

    if (!content || !authorId) {
      return res.json({ success: false, message: "Content and author are required" });
    }

    const discussion = await Discussion.findById(id);

    if (!discussion) {
      return res.json({ success: false, message: "Discussion not found" });
    }

    if (discussion.isLocked) {
      return res.json({ success: false, message: "This discussion is locked" });
    }

    discussion.replies.push({
      author: authorId,
      content,
    });

    await discussion.save();

    const populated = await Discussion.findById(discussion._id)
      .populate("author", "firstName lastName username profileImage")
      .populate("replies.author", "firstName lastName username profileImage");

    res.json({ success: true, discussion: populated });
  } catch (error) {
    console.error("Add Reply Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Toggle like on discussion
exports.toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User ID is required" });
    }

    const discussion = await Discussion.findById(id);

    if (!discussion) {
      return res.json({ success: false, message: "Discussion not found" });
    }

    const hasLiked = discussion.likedBy.includes(userId);

    if (hasLiked) {
      discussion.likedBy = discussion.likedBy.filter((id) => id.toString() !== userId);
      discussion.likes = Math.max(0, discussion.likes - 1);
    } else {
      discussion.likedBy.push(userId);
      discussion.likes += 1;
    }

    await discussion.save();

    res.json({ success: true, liked: !hasLiked, likes: discussion.likes });
  } catch (error) {
    console.error("Toggle Like Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Get popular tags
exports.getPopularTags = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const tags = await Discussion.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    res.json({ success: true, tags: tags.map((t) => ({ tag: t._id, count: t.count })) });
  } catch (error) {
    console.error("Get Popular Tags Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};
