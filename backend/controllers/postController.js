const Post = require("../models/Post");

/**
 * =========================
 * CREATE POST
 * =========================
 */
exports.createPost = async (req, res) => {
    try {
        const content = req.body.content || "";

        let imagePath = "";
        if (req.file) {
            imagePath = req.file.path; // uploads/xxxx.jpg
        }

        const post = await Post.create({
            user: req.user.id, // ✅ from JWT
            content,
            image: imagePath,
        });

        const populatedPost = await post.populate(
            "user",
            "firstName lastName profileImage"
        );

        res.status(201).json({ success: true, post: populatedPost });
    } catch (err) {
        console.error("Create Post Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * =========================
 * GET POSTS BY USER
 * =========================
 */
exports.getUserPosts = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.params.userId })
            .populate("user", "firstName lastName profileImage")
            .sort({ createdAt: -1 });

        res.json({ success: true, posts });
    } catch (err) {
        console.error("Get User Posts Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * =========================
 * LIKE / UNLIKE POST
 * =========================
 */
exports.toggleLike = async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.user.id;

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        const alreadyLiked = post.likes.includes(userId);

        if (alreadyLiked) {
            post.likes.pull(userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();

        res.json({
            success: true,
            liked: !alreadyLiked,
            likesCount: post.likes.length,
        });
    } catch (err) {
        console.error("Toggle Like Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

/**
 * =========================
 * ADD COMMENT
 * =========================
 */
exports.addComment = async (req, res) => {
    try {
        const { postId, text } = req.body;
        const userId = req.user.id;

        if (!text || !text.trim()) {
            return res
                .status(400)
                .json({ success: false, message: "Comment text required" });
        }

        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: "Post not found" });
        }

        post.comments.push({
            user: userId,
            text,
        });

        await post.save();

        const populatedPost = await Post.findById(postId)
            .populate("comments.user", "firstName lastName profileImage");

        res.json({ success: true, post: populatedPost });
    } catch (err) {
        console.error("Add Comment Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
