const Message = require("../models/Message");
const Conversation = require("../models/Conversation");

exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversationId })
      .populate("senderId", "firstName lastName")
      .sort({ createdAt: 1 });

    res.json({ success: true, messages });
  } catch (error) {
    console.error("Get Messages Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, text } = req.body;

    const message = new Message({ conversationId, senderId, text });
    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate("senderId", "firstName lastName");

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: text,
      lastMessageTime: new Date(),
    });

    // Emit to Socket.IO room
    const io = req.app.get("io");
    if (io) {
      io.to(conversationId).emit("new_message", populatedMessage);
    }

    res.json({ success: true, message: populatedMessage });
  } catch (error) {
    console.error("Send Message Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};
