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
