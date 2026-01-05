// backend/models/User.js
// User model for authentication + profile data

const mongoose = require("mongoose");

/* ---------- SUB SCHEMAS ---------- */
const skillSchema = new mongoose.Schema(
    {
        title: { type: String, default: "" },
        sub: { type: String, default: "" },
        rating: { type: Number, default: 0 },
    },
    { _id: false }
);

const portfolioSchema = new mongoose.Schema(
    {
        title: { type: String, default: "" },
        url: { type: String, default: "" },
    },
    { _id: false }
);

const moduleSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        credits: { type: Number, required: true },
        grade: { type: String, required: true },
        semester: { type: String, default: "" },
        year: { type: Number, default: null },
        completedAt: { type: Date, default: Date.now },
    },
    { _id: true }
);

/* ---------- MAIN USER SCHEMA ---------- */
const UserSchema = new mongoose.Schema(
    {
        /* ===== AUTH FIELDS ===== */
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },

        role: { type: String, default: "employee" },
        department: { type: String, default: "" },

        /* ===== PROFILE FIELDS ===== */
        profileImage: {
            type: String,
            default: "", // ← path like: uploads/xxxx.jpg
        },
        coverImage: {
            type: String,
            default: "",
        },

        headline: { type: String, default: "" },
        pronouns: { type: String, default: "" },
        university: { type: String, default: "" },
        course: { type: String, default: "" },
        specialization: { type: String, default: "" },
        about: { type: String, default: "" },

        skills: { type: [skillSchema], default: [] },
        portfolioLinks: { type: [portfolioSchema], default: [] },

        /* ===== GPA & ENDORSEMENTS ===== */
        gpa: { type: Number, default: null },
        moduleHistory: { type: [moduleSchema], default: [] },
        endorsements: { type: Number, default: 0 },
        endorsedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

        /* ===== ACTIVITY TRACKING ===== */
        lastActive: { type: Date, default: Date.now },
        isOnline: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
