const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload");
const authMiddleware = require("../middlewares/authMiddleware");
const {
    createPost,
    getUserPosts,
    toggleLike,
    addComment,
} = require("../controllers/postController");

router.post("/", authMiddleware, upload.single("image"), createPost);
router.get("/user/:userId", authMiddleware, getUserPosts);
router.post("/like", authMiddleware, toggleLike);
router.post("/comment", authMiddleware, addComment);

module.exports = router;
