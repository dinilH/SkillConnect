//This file defines the authentication routes for creating an account and logging in.

const express = require("express");
const router = express.Router();
const { createAccount, login, logout } = require("../controllers/authController");

router.post("/create-account", createAccount);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;