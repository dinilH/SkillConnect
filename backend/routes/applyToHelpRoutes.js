const express = require("express");
const router = express.Router();
const {
  createApplication,
  getApplicationsByRequest,
} = require("../controllers/applyToHelp.controller");

// POST: Apply to help
router.post("/applyToHelp/create", createApplication);

// GET: Get all applications for a request
router.get("/applyToHelp/:requestId", getApplicationsByRequest);

module.exports = router;
