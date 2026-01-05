const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    // Try to get token from cookie first, then fall back to Authorization header
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id };
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
