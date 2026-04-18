const express = require("express");
const router = express.Router();

const {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments
} = require("../controllers/appointmentController");

const protect = require("../middleware/authMiddleware");

// Patient
router.post("/book", protect, bookAppointment);
router.get("/patient", protect, getPatientAppointments);

// Doctor
router.get("/doctor", protect, getDoctorAppointments);

module.exports = router;