//This file is responsible for handling user authentication, including account creation and login functionalities.

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET;

exports.createAccount = async (req, res) => {
  try {
    const { firstName, lastName, email, username, role, department, password } = req.body;

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
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
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
};
