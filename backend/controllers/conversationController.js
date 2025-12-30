const Conversation = require("../models/Conversation");
const mongoose = require("mongoose");

exports.createOrGetConversation = async (req, res) => {
  try {
    const { participant1, participant2 } = req.body;

    if (
      !participant1 ||
      !participant2 ||
      !mongoose.Types.ObjectId.isValid(participant1) ||
      !mongoose.Types.ObjectId.isValid(participant2)
    ) {
      return res.status(400).json({ success: false, message: "Invalid participant IDs" });
    }
    if (participant1 === participant2) {
      return res.status(400).json({ success: false, message: "Participants must be different" });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [participant1, participant2] },
    }).populate("participants", "firstName lastName email");

    if (!conversation) {
      conversation = new Conversation({ participants: [participant1, participant2] });
      await conversation.save();
      conversation = await Conversation.findById(conversation._id)
        .populate("participants", "firstName lastName email");
    }

    return res.json({ success: true, conversation });
  } catch (error) {
    console.error("Create Conversation Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getConversationsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: "Invalid userId" });
    }
    const conversations = await Conversation.find({ participants: userId })
      .populate("participants", "firstName lastName email")
      .sort({ lastMessageTime: -1 });

    return res.json({ success: true, conversations });
  } catch (error) {
    console.error("Get Conversations Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
