// backend/routes/discussionRoutes.js
const express = require("express");
const router = express.Router();
const {
  getDiscussions,
  getDiscussionById,
  createDiscussion,
  updateDiscussion,
  deleteDiscussion,
  addReply,
  toggleLike,
  getPopularTags,
} = require("../controllers/discussionController");

router.get("/discussions", getDiscussions);
router.get("/discussions/tags", getPopularTags);
router.get("/discussions/:id", getDiscussionById);
router.post("/discussions", createDiscussion);
router.put("/discussions/:id", updateDiscussion);
router.delete("/discussions/:id", deleteDiscussion);
router.post("/discussions/:id/reply", addReply);
router.post("/discussions/:id/like", toggleLike);

module.exports = router;
