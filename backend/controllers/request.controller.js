const Request = require("../models/Request.model");

// CREATE REQUEST
const createRequest = async (req, res) => {
  try {
    const { title, category, priority, skills, description } = req.body;

    if (!title || !category || !skills || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRequest = await Request.create({
      title,
      category,
      priority,
      skills,
      description,
    });

    res.status(201).json({ message: "Request created", request: newRequest });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL REQUESTS
const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createRequest, getAllRequests };
