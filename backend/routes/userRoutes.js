//This file defines the user-related routes for retrieving user information.

const express = require("express");
const router = express.Router();
const { 
  getUsers, 
  getUserById, 
  searchUsers, 
  updateGPA, 
  toggleEndorsement, 
  getPopularMembers 
} = require("../controllers/userController");

router.get("/users/search", searchUsers);
router.get("/users/popular", getPopularMembers);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.put("/users/:userId/gpa", updateGPA);
router.post("/users/:userId/endorse", toggleEndorsement);

module.exports = router;