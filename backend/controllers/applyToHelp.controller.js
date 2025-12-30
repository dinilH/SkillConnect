const Application = require("../models/ApplyToHelp");
const Request = require("../models/Request.model");

// Create a new application
exports.createApplication = async (req, res) => {
  try {
    const { requestId, name, email, skills, message } = req.body;

    // Optional: Check if request exists
    const requestExists = await Request.findById(requestId);
    if (!requestExists) {
      return res.status(404).json({ message: "Request not found" });
    }

    const application = await Application.create({
      request: requestId,
      name,
      email,
      skills,
      message,
    });

    res.status(201).json({ success: true, application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Get all applications for a request
exports.getApplicationsByRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const applications = await Application.find({ request: requestId });
    res.status(200).json({ success: true, applications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
