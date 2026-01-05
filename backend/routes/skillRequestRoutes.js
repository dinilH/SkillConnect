// backend/routes/skillRequestRoutes.js
const express = require("express");
const router = express.Router();
const {
  getSkillRequests,
  getFeaturedSkillRequests,
  getMySkillRequests,
  getAssignedSkillRequests,
  getUserNotifications,
  getSkillRequestById,
  createSkillRequest,
  updateSkillRequest,
  deleteSkillRequest,
  addResponse,
  acceptResponse,
  declineResponse,
} = require("../controllers/skillRequestController");

router.get("/skill-requests/featured", getFeaturedSkillRequests);
router.get("/skill-requests", getSkillRequests);
router.get("/skill-requests/my/:userId", getMySkillRequests);
router.get("/skill-requests/assigned/:userId", getAssignedSkillRequests);
router.get("/skill-requests/notifications/:userId", getUserNotifications);
router.get("/skill-requests/:id", getSkillRequestById);
router.post("/skill-requests", createSkillRequest);
router.put("/skill-requests/:id", updateSkillRequest);
router.delete("/skill-requests/:id", deleteSkillRequest);
router.post("/skill-requests/:id/respond", addResponse);
router.post("/skill-requests/:id/accept/:responseId", acceptResponse);
router.post("/skill-requests/:id/decline/:responseId", declineResponse);

module.exports = router;
