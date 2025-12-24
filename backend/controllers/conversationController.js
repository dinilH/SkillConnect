const Conversation = require("../models/Conversation");

exports.createOrGetConversation = async (req, res) => {
  try {
    const { participant1, participant2 } = req.body;

    let conversation = await Conversation.findOne({
      participants: { $all: [participant1, participant2] },
    }).populate("participants", "firstName lastName email");

    if (!conversation) {
      conversation = new Conversation({ participants: [participant1, participant2] });
      await conversation.save();
      conversation = await Conversation.findById(conversation._id)
        .populate("participants", "firstName lastName email");
    }

    res.json({ success: true, conversation });
  } catch (error) {
    console.error("Create Conversation Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

exports.getConversationsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = await Conversation.find({ participants: userId })
      .populate("participants", "firstName lastName email")
      .sort({ lastMessageTime: -1 });

    res.json({ success: true, conversations });
  } catch (error) {
    console.error("Get Conversations Error:", error);
    res.json({ success: false, message: "Server error" });
  }
};
