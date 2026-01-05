//This file is responsible for handling user authentication, including account creation and login functionalities.

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

exports.createAccount = async (req, res) => {
  try {
    const { firstName, lastName, email, username, role, department, university, course, specialization, password } = req.body;

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
      university: university || "",
      course: course || "",
      specialization: specialization || "",
      password: hashedPassword,
    });

    await newUser.save();

    res.json({ success: true, message: "Account created successfully" });
  } catch (error) {
    console.error("Create Account Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "Invalid email or password" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.json({ success: false, message: "Invalid email or password" });

    if (!JWT_SECRET) {
      return res.status(500).json({ success: false, message: "JWT secret not configured" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: "1d" } // Changed to 1 day
    );

    // Set cookie with 1 day expiration
    res.cookie("token", token, {
      httpOnly: true, // Prevents JavaScript access (XSS protection)
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "lax", // CSRF protection
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });

    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        userId: user._id,
        name: user.firstName + " " + user.lastName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role,
        department: user.department,
        university: user.university,
        course: user.course,
        specialization: user.specialization,
        skills: user.skills || [],
        profileImage: user.profileImage,
        about: user.about,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};
