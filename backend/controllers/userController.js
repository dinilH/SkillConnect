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
    const { gpa, modules } = req.body;

    if (gpa === undefined || gpa === null) {
      return res.json({ success: false, message: "GPA is required" });
    }

    const updateData = { gpa: parseFloat(gpa) };

    // If modules are provided, append them to moduleHistory
    if (modules && Array.isArray(modules) && modules.length > 0) {
      const user = await User.findById(userId);
      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }

      // Add new modules to history
      user.moduleHistory.push(...modules);
      user.gpa = parseFloat(gpa);
      await user.save();

      return res.json({ 
        success: true, 
        message: "GPA and modules updated successfully", 
        gpa: user.gpa,
        moduleHistory: user.moduleHistory
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
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

// Get user's module history
exports.getModuleHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("moduleHistory gpa");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ 
      success: true, 
      moduleHistory: user.moduleHistory || [],
      gpa: user.gpa
    });
  } catch (error) {
    console.error("Get Module History Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Delete a specific module from history
exports.deleteModule = async (req, res) => {
  try {
    const { userId, moduleId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    user.moduleHistory = user.moduleHistory.filter(
      module => module._id.toString() !== moduleId
    );

    await user.save();

    res.json({ 
      success: true, 
      message: "Module deleted successfully",
      moduleHistory: user.moduleHistory
    });
  } catch (error) {
    console.error("Delete Module Error:", error);
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

// Get active members based on recent activity
exports.getActiveMembers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const timeThreshold = req.query.minutes || 30; // Default: active in last 30 minutes

    const thresholdDate = new Date(Date.now() - timeThreshold * 60 * 1000);

    const users = await User.find({
      lastActive: { $gte: thresholdDate }
    })
      .select("firstName lastName username profileImage lastActive isOnline")
      .sort({ lastActive: -1 })
      .limit(limit);

    res.json({ success: true, users });
  } catch (error) {
    console.error("Get Active Members Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

// Update user's last active time
exports.updateActivity = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isOnline } = req.body;

    const updateData = {
      lastActive: Date.now(),
    };

    if (isOnline !== undefined) {
      updateData.isOnline = isOnline;
    }

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("firstName lastName lastActive isOnline");

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Update Activity Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};
