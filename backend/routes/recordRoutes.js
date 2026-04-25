const express = require("express");
const router = express.Router();

const {
  uploadReport,
  addPrescription,
  getPatientRecords
} = require("../controllers/recordController");

const protect = require("../middleware/authMiddleware");

// Patient
router.post("/upload", protect, uploadReport);
router.get("/my", protect, getPatientRecords);

// Doctor
router.post("/prescription", protect, addPrescription);

module.exports = router;