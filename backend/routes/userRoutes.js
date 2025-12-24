//This file defines the user-related routes for retrieving user information.

const express = require("express");
const router = express.Router();
const { getUsers, getUserById } = require("../controllers/userController");

router.get("/users", getUsers);
router.get("/users/:id", getUserById);

module.exports = router;