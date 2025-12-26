//This file defines the user-related routes for retrieving user information.

const express = require("express");
const router = express.Router();
const { getUsers, getUserById, searchUsers } = require("../controllers/userController");

router.get("/users/search", searchUsers);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);

module.exports = router;