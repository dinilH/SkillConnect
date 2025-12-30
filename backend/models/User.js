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
        about: { type: String, default: "" },

        skills: { type: [skillSchema], default: [] },
        portfolioLinks: { type: [portfolioSchema], default: [] },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
