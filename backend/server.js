const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// Routers
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const server = http.createServer(app);

// Allowed client origin (for CORS and Socket.IO)
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Socket.IO setup
const io = new Server(server, {
    cors: { origin: CLIENT_URL, methods: ["GET", "POST"], credentials: true },
});
app.set("io", io);

app.use(express.json());
app.use(cors({ origin: CLIENT_URL, methods: ["GET", "POST"], credentials: true }));

// mount routes under /api
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", conversationRoutes);
app.use("/api", messageRoutes);

// ENVIRONMENT VARIABLES
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGO_URL) {
    console.error("❌ Error: MONGO_URL is not defined in .env");
    process.exit(1);
}
if (!JWT_SECRET) {
    console.error("❌ Error: JWT_SECRET is not defined in .env");
    process.exit(1);
}

// MongoDB CONNECTION
mongoose
    .connect(MONGO_URL, { serverSelectionTimeoutMS: 10000, socketTimeoutMS: 45000, maxPoolSize: 10 })
    .then(() => console.log("✅ MongoDB Connected"))
    .catch((err) => {
        console.error("❌ MongoDB Error:", err);
        console.error(
            "ℹ️ If using mongodb+srv, ensure SRV DNS resolves and your IP is allowlisted in Atlas Network Access."
        );
    });

// SOCKET.IO CONNECTION HANDLING
const onlineUsers = new Map();
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("user_online", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`User ${userId} is online`);
    });

    socket.on("join_conversation", (conversationId) => {
        socket.join(conversationId);
        console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    });

    socket.on("leave_conversation", (conversationId) => {
        socket.leave(conversationId);
    });

    socket.on("disconnect", () => {
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                break;
            }
        }
        console.log("User disconnected:", socket.id);
    });
});

// START SERVER
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
