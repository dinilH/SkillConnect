const express = require("express");
const router = express.Router();
const { createOrGetConversation, getConversationsForUser } = require("../controllers/conversationController");

router.post("/conversations", createOrGetConversation);
router.get("/conversations/:userId", getConversationsForUser);

module.exports = router;