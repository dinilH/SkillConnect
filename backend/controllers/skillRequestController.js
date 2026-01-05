// backend/controllers/skillRequestController.js
const SkillRequest = require("../models/SkillRequest");
const User = require("../models/User");

// Get featured skill requests for home page
exports.getFeaturedSkillRequests = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    // Get featured requests based on:
    // 1. High/Critical priority
    // 2. Open status
    // 3. Recent creation
    // 4. Has responses (shows popularity)
    const requests = await SkillRequest.find({
      status: { $in: ["open", "in-progress"] },
    })
      .populate("author", "firstName lastName username profileImage")
      .populate("assignedTo", "firstName lastName username")
      .sort({
        // Prioritize by priority level (Critical > High > Medium > Low)
        priority: -1,
        // Then by number of responses (popularity)
        // Then by recent creation
        createdAt: -1,
      })
      .limit(limit);

    // Sort manually by priority weight and response count
    const priorityWeight = {
      Critical: 4,
      High: 3,
      Medium: 2,
      Low: 1,
    };

    const sortedRequests = requests.sort((a, b) => {
      const priorityDiff =
        (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
      if (priorityDiff !== 0) return priorityDiff;

      const responseDiff = b.responses.length - a.responses.length;
      if (responseDiff !== 0) return responseDiff;

      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json({ success: true, requests: sortedRequests });
  } catch (error) {
    console.error("Get Featured Skill Requests Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Get all skill requests with filters
exports.getSkillRequests = async (req, res) => {
  try {
    const { category, priority, status, userId } = req.query;

    let query = {};

    // Filter by category
    if (category && category !== "All Categories") {
      query.category = category;
    }

    // Filter by priority
    if (priority && priority !== "All Urgencies") {
      query.priority = priority;
    }

    // Filter by status
    if (status) {
      query.status = status;
    } else {
      // By default, exclude completed and closed requests
      query.status = { $in: ["open", "in-progress"] };
    }

    // Exclude user's own requests if userId is provided
    if (userId) {
      query.author = { $ne: userId };
    }

    let requests = await SkillRequest.find(query)
      .populate("author", "firstName lastName username profileImage")
      .populate("assignedTo", "firstName lastName username")
      .sort({ createdAt: -1 });

    // Personalized ranking: if userId provided, rank by skill match
    if (userId) {
      try {
        const user = await User.findById(userId).select("skills");
        const userSkills = (user?.skills || []).map((s) => ({
          title: (s.title || "").toLowerCase(),
          sub: (s.sub || "").toLowerCase(),
        }));

        const titleTokens = (str) => (str || "")
          .toLowerCase()
          .split(/[^a-z0-9]+/)
          .filter(Boolean);

        requests = requests
          .map((req) => {
            const tags = (req.tags || []).map((t) => (t || "").toLowerCase());
            const cat = (req.category || "").toLowerCase();
            const titleWords = titleTokens(req.title);

            let matchScore = 0;
            for (const sk of userSkills) {
              const titleMatch = titleWords.includes(sk.title) || titleWords.includes(sk.sub);
              const tagMatch = tags.includes(sk.title) || tags.includes(sk.sub);
              const catMatch = cat && (cat.includes(sk.title) || cat.includes(sk.sub));
              matchScore += (titleMatch ? 2 : 0) + (tagMatch ? 2 : 0) + (catMatch ? 1 : 0);
            }

            // small boost for higher priority
            const priorityBoost = { Low: 0, Medium: 1, High: 2, Critical: 3 }[req.priority] || 0;

            return { ...req.toObject(), _matchScore: matchScore + priorityBoost };
          })
          .sort((a, b) => b._matchScore - a._matchScore);
      } catch (e) {
        // ignore personalization errors
      }
    }

    res.json({ success: true, requests });
  } catch (error) {
    console.error("Get Skill Requests Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Get user's own skill requests
exports.getMySkillRequests = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.query;

    let query = { author: userId };

    if (status) {
      query.status = status;
    }

    const requests = await SkillRequest.find(query)
      .populate("author", "firstName lastName username profileImage")
      .populate("assignedTo", "firstName lastName username")
      .populate("responses.user", "firstName lastName username profileImage")
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    console.error("Get My Skill Requests Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Get assigned skill requests (where user is the helper)
exports.getAssignedSkillRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    const requests = await SkillRequest.find({ assignedTo: userId })
      .populate("author", "firstName lastName username profileImage")
      .populate("assignedTo", "firstName lastName username")
      .populate("responses.user", "firstName lastName username profileImage")
      .sort({ createdAt: -1 });

    res.json({ success: true, requests });
  } catch (error) {
    console.error("Get Assigned Skill Requests Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Get single skill request by ID
exports.getSkillRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await SkillRequest.findById(id)
      .populate("author", "firstName lastName username profileImage")
      .populate("assignedTo", "firstName lastName username profileImage")
      .populate("responses.user", "firstName lastName username profileImage");

    if (!request) {
      return res.json({ success: false, message: "Skill request not found" });
    }

    res.json({ success: true, request });
  } catch (error) {
    console.error("Get Skill Request Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Create new skill request
exports.createSkillRequest = async (req, res) => {
  try {
    const {
      title,
      description,
      authorId,
      tags,
      category,
      priority,
      estimatedTime,
      deadline,
    } = req.body;

    if (!title || !description || !authorId) {
      return res.json({
        success: false,
        message: "Title, description, and author are required",
      });
    }

    const request = new SkillRequest({
      title,
      description,
      author: authorId,
      tags: tags || [],
      category: category || "General",
      priority: priority || "Medium",
      estimatedTime: estimatedTime || "",
      deadline: deadline || null,
    });

    await request.save();

    const populated = await SkillRequest.findById(request._id).populate(
      "author",
      "firstName lastName username profileImage"
    );

    res.json({ success: true, request: populated });
  } catch (error) {
    console.error("Create Skill Request Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Update skill request
exports.updateSkillRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, tags, category, priority, estimatedTime, status, userId } = req.body;

    const request = await SkillRequest.findById(id);

    if (!request) {
      return res.json({ success: false, message: "Skill request not found" });
    }

    // Check if user is the author
    if (request.author.toString() !== userId) {
      return res.json({
        success: false,
        message: "You can only edit your own requests",
      });
    }

    if (title) request.title = title;
    if (description) request.description = description;
    if (tags) request.tags = tags;
    if (category) request.category = category;
    if (priority) request.priority = priority;
    if (estimatedTime) request.estimatedTime = estimatedTime;
    if (status) request.status = status;

    await request.save();

    const populated = await SkillRequest.findById(request._id)
      .populate("author", "firstName lastName username profileImage")
      .populate("assignedTo", "firstName lastName username");

    res.json({ success: true, request: populated });
  } catch (error) {
    console.error("Update Skill Request Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Delete skill request
exports.deleteSkillRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const request = await SkillRequest.findById(id);

    if (!request) {
      return res.json({ success: false, message: "Skill request not found" });
    }

    // Check if user is the author
    if (request.author.toString() !== userId) {
      return res.json({
        success: false,
        message: "You can only delete your own requests",
      });
    }

    await SkillRequest.findByIdAndDelete(id);

    res.json({ success: true, message: "Skill request deleted successfully" });
  } catch (error) {
    console.error("Delete Skill Request Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Add response to skill request (apply to help)
exports.addResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, message } = req.body;

    if (!message || !userId) {
      return res.json({ success: false, message: "Message and user ID are required" });
    }

    const request = await SkillRequest.findById(id);

    if (!request) {
      return res.json({ success: false, message: "Skill request not found" });
    }

    if (request.status === "closed" || request.status === "completed") {
      return res.json({ success: false, message: "This request is closed" });
    }

    // Check if user already responded
    const alreadyResponded = request.responses.some(
      (r) => r.user.toString() === userId
    );

    if (alreadyResponded) {
      return res.json({ success: false, message: "You have already responded to this request" });
    }

    request.responses.push({
      user: userId,
      message,
      status: "pending",
    });

    await request.save();

    const populated = await SkillRequest.findById(request._id)
      .populate("author", "firstName lastName username profileImage")
      .populate("responses.user", "firstName lastName username profileImage");

    res.json({ success: true, request: populated });
  } catch (error) {
    console.error("Add Response Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Accept a response (assign helper)
exports.acceptResponse = async (req, res) => {
  try {
    const { id, responseId } = req.params;
    const { userId } = req.body;

    const request = await SkillRequest.findById(id);

    if (!request) {
      return res.json({ success: false, message: "Skill request not found" });
    }

    // Check if user is the author
    if (request.author.toString() !== userId) {
      return res.json({
        success: false,
        message: "Only the request author can accept responses",
      });
    }

    const response = request.responses.id(responseId);

    if (!response) {
      return res.json({ success: false, message: "Response not found" });
    }

    // Update response status
    response.status = "accepted";
    request.assignedTo = response.user;
    request.status = "in-progress";

    // Reject all other responses
    request.responses.forEach((r) => {
      if (r._id.toString() !== responseId) {
        r.status = "rejected";
      }
    });

    await request.save();

    const populated = await SkillRequest.findById(request._id)
      .populate("author", "firstName lastName username profileImage")
      .populate("assignedTo", "firstName lastName username profileImage")
      .populate("responses.user", "firstName lastName username profileImage");

    res.json({ success: true, request: populated });
  } catch (error) {
    console.error("Accept Response Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Decline a response
exports.declineResponse = async (req, res) => {
  try {
    const { id, responseId } = req.params;
    const { userId } = req.body;

    const request = await SkillRequest.findById(id);

    if (!request) {
      return res.json({ success: false, message: "Skill request not found" });
    }

    // Check if user is the author
    if (request.author.toString() !== userId) {
      return res.json({
        success: false,
        message: "Only the request author can decline responses",
      });
    }

    const response = request.responses.id(responseId);

    if (!response) {
      return res.json({ success: false, message: "Response not found" });
    }

    // Update response status
    response.status = "rejected";

    await request.save();

    const populated = await SkillRequest.findById(request._id)
      .populate("author", "firstName lastName username profileImage")
      .populate("assignedTo", "firstName lastName username profileImage")
      .populate("responses.user", "firstName lastName username profileImage");

    res.json({ success: true, request: populated });
  } catch (error) {
    console.error("Decline Response Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Get notifications for a user
exports.getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all skill requests where user is the author or has responded
    const myRequests = await SkillRequest.find({ author: userId })
      .populate("author", "firstName lastName username profileImage")
      .populate("responses.user", "firstName lastName username profileImage")
      .select("_id title responses");

    const requestsIRespondedTo = await SkillRequest.find({
      "responses.user": userId,
    })
      .populate("author", "firstName lastName username profileImage")
      .populate("responses.user", "firstName lastName username profileImage")
      .select("_id title author responses");

    const notifications = [];

    // Add pending responses to my requests
    myRequests.forEach((request) => {
      request.responses?.forEach((response) => {
        if (response.status === "pending") {
          notifications.push({
            type: "response_received",
            _id: response._id,
            requestId: request._id,
            requestTitle: request.title,
            fromUser: response.user,
            message: response.message,
            createdAt: response.createdAt,
            read: false,
          });
        }
      });
    });

    // Add accepted responses to requests I applied to
    requestsIRespondedTo.forEach((request) => {
      request.responses?.forEach((response) => {
        if (
          response.user._id.toString() === userId &&
          response.status === "accepted"
        ) {
          notifications.push({
            type: "response_accepted",
            _id: response._id,
            requestId: request._id,
            requestTitle: request.title,
            fromUser: request.author,
            message: `Your offer to help with "${request.title}" was accepted!`,
            createdAt: response.updatedAt || response.createdAt,
            read: false,
          });
        }
      });
    });

    // Sort by most recent
    notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json({ success: true, notifications });
  } catch (error) {
    console.error("Get User Notifications Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};
