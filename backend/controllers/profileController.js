// backend/controllers/profileController.js

const User = require("../models/User");

/**
 * GET USER PROFILE
 */
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/**
 * UPDATE USER PROFILE
 */
exports.updateProfile = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            {
                profileImage: req.body.profileImage,
                coverImage: req.body.coverImage,
                headline: req.body.headline,
                pronouns: req.body.pronouns,
                university: req.body.university,
                about: req.body.about,
                skills: req.body.skills,
                portfolioLinks: req.body.portfolioLinks,
            },
            { new: true }
        ).select("-password");

        res.json(updatedUser);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
