const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");
const Conversation = require("./models/Conversation");
const Message = require("./models/Message");

const MONGO_URL = process.env.MONGO_URL;

const demoConversations = [
    {
        participants: ["john@demo.com", "jane@demo.com"],
        messages: [
            { sender: "john@demo.com", text: "Hey Jane! How's the new design coming along?" },
            { sender: "jane@demo.com", text: "Hi John! It's going great. Almost done with the mockups." },
            { sender: "john@demo.com", text: "Awesome! Can't wait to see them. Let me know when you're ready for review." },
            { sender: "jane@demo.com", text: "Will do! Should be ready by tomorrow." },
            { sender: "john@demo.com", text: "Perfect! Looking forward to it 👍" },
        ],
    },
    {
        participants: ["john@demo.com", "alex@demo.com"],
        messages: [
            { sender: "alex@demo.com", text: "John, can we discuss the sprint planning?" },
            { sender: "john@demo.com", text: "Sure Alex! What time works for you?" },
            { sender: "alex@demo.com", text: "How about 3 PM today?" },
            { sender: "john@demo.com", text: "Works for me. I'll send a calendar invite." },
            { sender: "alex@demo.com", text: "Great, thanks!" },
        ],
    },
    {
        participants: ["jane@demo.com", "alex@demo.com"],
        messages: [
            { sender: "alex@demo.com", text: "Jane, the client loved your designs!" },
            { sender: "jane@demo.com", text: "That's wonderful news! 🎉" },
            { sender: "alex@demo.com", text: "They want to schedule a call to discuss next steps." },
            { sender: "jane@demo.com", text: "Perfect, I'm available tomorrow afternoon." },
            { sender: "alex@demo.com", text: "I'll set it up. Great work!" },
        ],
    },
];

async function seedChats() {
    try {
        await mongoose.connect(MONGO_URL);
        console.log("Connected to MongoDB");

        // Get all demo users
        const users = await User.find({ email: { $in: ["john@demo.com", "jane@demo.com", "alex@demo.com"] } });
        const userMap = {};
        users.forEach((user) => {
            userMap[user.email] = user._id;
        });

        if (Object.keys(userMap).length < 3) {
            console.error("Demo users not found. Please run seedUsers.js first.");
            process.exit(1);
        }

        console.log("Found demo users:", Object.keys(userMap).join(", "));

        for (const convData of demoConversations) {
            const participant1 = userMap[convData.participants[0]];
            const participant2 = userMap[convData.participants[1]];

            // Check if conversation already exists
            let conversation = await Conversation.findOne({
                participants: { $all: [participant1, participant2] },
            });

            if (conversation) {
                console.log(`Conversation between ${convData.participants[0]} and ${convData.participants[1]} already exists, skipping...`);
                continue;
            }

            // Create conversation
            conversation = new Conversation({
                participants: [participant1, participant2],
                lastMessage: convData.messages[convData.messages.length - 1].text,
                lastMessageTime: new Date(),
            });
            await conversation.save();
            console.log(`Created conversation between ${convData.participants[0]} and ${convData.participants[1]}`);

            // Create messages with timestamps spaced apart
            const baseTime = Date.now() - convData.messages.length * 60000; // Start from X minutes ago
            for (let i = 0; i < convData.messages.length; i++) {
                const msgData = convData.messages[i];
                const message = new Message({
                    conversationId: conversation._id,
                    senderId: userMap[msgData.sender],
                    text: msgData.text,
                    createdAt: new Date(baseTime + i * 60000), // Each message 1 minute apart
                });
                await message.save();
            }
            console.log(`  Added ${convData.messages.length} messages`);
        }

        console.log("\n--- Demo Chats Created ---");
        console.log("Conversations seeded between:");
        console.log("  • John ↔ Jane (5 messages)");
        console.log("  • John ↔ Alex (5 messages)");
        console.log("  • Jane ↔ Alex (5 messages)");

        await mongoose.disconnect();
        console.log("\nDisconnected from MongoDB");
    } catch (error) {
        console.error("Error seeding chats:", error);
        process.exit(1);
    }
}

seedChats();
