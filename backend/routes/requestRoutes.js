const express = require("express");
const {
  createRequest,
  getAllRequests,
} = require("../controllers/request.controller");

const router = express.Router();

router.post("/request/create", createRequest);
router.get("/requests", getAllRequests);

module.exports = router;
