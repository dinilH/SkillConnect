// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
require("dotenv").config();

// Routers
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const conversationRoutes = require("./routes/conversationRoutes");
const messageRoutes = require("./routes/messageRoutes");
const profileRoutes = require("./routes/profileRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();
const server = http.createServer(app);

// Allowed client origins
const CLIENT_URLS = [
    "http://localhost:5173",
    "http://localhost:5176",
];

// Socket.IO
const io = new Server(server, {
    cors: {
        origin: CLIENT_URLS,
        methods: ["GET", "POST"],
        credentials: true,
    },
});

app.set("io", io);

// Middleware
app.use(express.json());
app.use(
    cors({
        origin: CLIENT_URLS,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

// Static uploads (profile image, cover image, post images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", conversationRoutes);
app.use("/api", messageRoutes);
app.use("/api", requestRoutes);
app.use("/api", applyToHelproutes);


// Env
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;

if (!MONGO_URL) {
    console.error("Error: MONGO_URL is not defined in .env");
    process.exit(1);
}
if (!JWT_SECRET) {
    console.error("Error: JWT_SECRET is not defined in .env");
    process.exit(1);
}

// MongoDB
mongoose
    .connect(MONGO_URL, { serverSelectionTimeoutMS: 10000, socketTimeoutMS: 45000, maxPoolSize: 10 })
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => {
        console.error("MongoDB Error:", err);
        console.error(
            "If using mongodb+srv, ensure SRV DNS resolves and your IP is allowlisted in Atlas Network Access."
        );
    });

// Socket handlers
const onlineUsers = new Map();

io.on("connection", (socket) => {
    socket.on("user_online", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("join_conversation", (conversationId) => {
        socket.join(conversationId);
    });

    socket.on("join_conversation", (id) => socket.join(id));
    socket.on("leave_conversation", (id) => socket.leave(id));

    socket.on("disconnect", () => {
        for (const [u, s] of onlineUsers.entries()) {
            if (s === socket.id) {
                onlineUsers.delete(u);
                break;
            }
        }
    });
});

// Start
server.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
);
