const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const mongoose = require("mongoose");

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ success: false, message: "Invalid conversationId" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    const messages = await Message.find({ conversationId })
      .populate("senderId", "firstName lastName")
      .sort({ createdAt: 1 });

    return res.json({ success: true, messages });
  } catch (error) {
    console.error("Get Messages Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, text } = req.body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ success: false, message: "Message text is required" });
    }
    if (!conversationId || !mongoose.Types.ObjectId.isValid(conversationId)) {
      return res.status(400).json({ success: false, message: "Invalid conversationId" });
    }
    if (!senderId || !mongoose.Types.ObjectId.isValid(senderId)) {
      return res.status(400).json({ success: false, message: "Invalid senderId" });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ success: false, message: "Conversation not found" });
    }

    // Ensure sender is a participant of the conversation
    const isParticipant = conversation.participants.some(
      (p) => p.toString() === senderId
    );
    if (!isParticipant) {
      return res.status(403).json({ success: false, message: "Sender not part of conversation" });
    }

    const message = new Message({ conversationId, senderId, text: text.trim() });
    await message.save();

    const populatedMessage = await Message.findById(message._id).populate(
      "senderId",
      "firstName lastName"
    );

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text.trim(),
      lastMessageTime: new Date(),
    });

    // Emit to Socket.IO room
    const io = req.app.get("io");
    if (io) {
      io.to(conversationId).emit("new_message", populatedMessage);
    }

    return res.json({ success: true, message: populatedMessage });
  } catch (error) {
    console.error("Send Message Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
