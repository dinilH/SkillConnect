const express = require("express");
const router = express.Router();
const { getMessages, sendMessage } = require("../controllers/messageController");

router.get("/messages/:conversationId", getMessages);
router.post("/messages", sendMessage);

module.exports = router;