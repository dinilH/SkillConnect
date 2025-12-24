//This file defines the User model schema for MongoDB using Mongoose.

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        role: { type: String, default: "employee" },
        department: { type: String, default: "" },
        password: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
