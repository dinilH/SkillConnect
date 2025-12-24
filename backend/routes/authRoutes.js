//This file defines the authentication routes for creating an account and logging in.

const express = require("express");
const router = express.Router();
const { createAccount, login } = require("../controllers/authController");

router.post("/create-account", createAccount);
router.post("/login", login);

module.exports = router;