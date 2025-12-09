const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

const User = require("./models/User");

const app = express();
app.use(express.json());
app.use(cors());

// -------------------------------------
// ENVIRONMENT VARIABLES
// -------------------------------------
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
    console.error("❌ Error: MONGO_URL is not defined in .env");
    process.exit(1);
}

// -------------------------------------
// MongoDB CONNECTION
// -------------------------------------
mongoose
    .connect(MONGO_URL)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => console.error("❌ MongoDB Error:", err));

// -------------------------------------
// CREATE ACCOUNT ROUTE
// -------------------------------------
app.post("/api/create-account", async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            username,
            role,
            department,
            password,
        } = req.body;

        const existingEmail = await User.findOne({ email });
        if (existingEmail) return res.json({ success: false, message: "Email already exists" });

        const existingUsername = await User.findOne({ username });
        if (existingUsername) return res.json({ success: false, message: "Username already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            username,
            role,
            department,
            password: hashedPassword,
        });

        await newUser.save();

        res.json({ success: true, message: "Account created successfully" });

    } catch (error) {
        console.error("Create Account Error:", error);
        res.json({ success: false, message: "Server error" });
    }
});

// -------------------------------------
// LOGIN ROUTE
// -------------------------------------
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.json({ success: false, message: "Invalid email or password" });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) return res.json({ success: false, message: "Invalid email or password" });

        res.json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.firstName + " " + user.lastName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.json({ success: false, message: "Server error" });
    }
});

// -------------------------------------
// START SERVER
// -------------------------------------
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));