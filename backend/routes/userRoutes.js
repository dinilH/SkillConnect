//This file defines the user-related routes for retrieving user information.

const express = require("express");
const router = express.Router();
const { 
  getUsers, 
  getUserById, 
  searchUsers, 
  updateGPA, 
  toggleEndorsement, 
  getPopularMembers,
  getActiveMembers,
  updateActivity,
  getModuleHistory,
  deleteModule
} = require("../controllers/userController");

router.get("/users/search", searchUsers);
router.get("/users/popular", getPopularMembers);
router.get("/users/active", getActiveMembers);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.put("/users/:userId/gpa", updateGPA);
router.get("/users/:userId/modules", getModuleHistory);
router.delete("/users/:userId/modules/:moduleId", deleteModule);
router.post("/users/:userId/endorse", toggleEndorsement);
router.put("/users/:userId/activity", updateActivity);

module.exports = router;