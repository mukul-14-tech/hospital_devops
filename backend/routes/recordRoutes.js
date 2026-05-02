const express = require("express");
const router = express.Router();

const {
  uploadReport,
  addPrescription,
  getPatientRecords
} = require("../controllers/recordController");

const { protect, restrictTo } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Patient
router.post("/upload", protect, restrictTo("patient"), upload.single("file"), uploadReport);
router.get("/my", protect, restrictTo("patient", "doctor"), getPatientRecords);

// Doctor
router.post("/prescription", protect, restrictTo("doctor"), addPrescription);

module.exports = router;