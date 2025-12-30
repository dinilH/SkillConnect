//This file is responsible for handling user-related operations, such as retrieving user information.

const User = require("../models/User");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "firstName lastName email _id role department");
    res.json({ success: true, users });
  } catch (error) {
    console.error("Get Users Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "firstName lastName email _id role department");
    if (!user) return res.json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (error) {
    console.error("Get User Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Search users by name or username
exports.searchUsers = async (req, res) => {
  try {
    const { query, excludeId } = req.query;
    
    if (!query || query.trim().length === 0) {
      return res.json({ success: true, users: [] });
    }

    const searchRegex = new RegExp(query.trim(), 'i');

    const searchQuery = {
      $or: [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { username: searchRegex }
      ]
    };

    if (excludeId) {
      searchQuery._id = { $ne: excludeId };
    }

    const users = await User.find(searchQuery, "firstName lastName email _id role department username")
      .limit(10);

    res.json({ success: true, users });
  } catch (error) {
    console.error("Search Users Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Update user GPA
exports.updateGPA = async (req, res) => {
  try {
    const { userId } = req.params;
    const { gpa } = req.body;

    if (gpa === undefined || gpa === null) {
      return res.json({ success: false, message: "GPA is required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { gpa: parseFloat(gpa) },
      { new: true }
    );

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "GPA updated successfully", gpa: user.gpa });
  } catch (error) {
    console.error("Update GPA Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Toggle endorsement for a user
exports.toggleEndorsement = async (req, res) => {
  try {
    const { userId } = req.params; // User being endorsed
    const { endorserId } = req.body; // User giving the endorsement

    if (!endorserId) {
      return res.json({ success: false, message: "Endorser ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const hasEndorsed = user.endorsedBy.includes(endorserId);

    if (hasEndorsed) {
      // Remove endorsement
      user.endorsedBy = user.endorsedBy.filter(id => id.toString() !== endorserId);
      user.endorsements = Math.max(0, user.endorsements - 1);
    } else {
      // Add endorsement
      user.endorsedBy.push(endorserId);
      user.endorsements += 1;
    }

    await user.save();

    res.json({ 
      success: true, 
      endorsed: !hasEndorsed,
      endorsements: user.endorsements 
    });
  } catch (error) {
    console.error("Toggle Endorsement Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Get popular members based on endorsements
exports.getPopularMembers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const users = await User.find({})
      .select("firstName lastName username profileImage skills endorsements gpa")
      .sort({ endorsements: -1 })
      .limit(limit);

    res.json({ success: true, users });
  } catch (error) {
    console.error("Get Popular Members Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};
