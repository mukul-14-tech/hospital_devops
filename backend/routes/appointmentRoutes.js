const express = require("express");
const router = express.Router();

const {
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus
} = require("../controllers/appointmentController");

const { protect, restrictTo } = require("../middleware/authMiddleware");

// Patient
router.post("/book", protect, restrictTo("patient"), bookAppointment);
router.get("/patient", protect, restrictTo("patient"), getPatientAppointments);

// Doctor
router.get("/doctor", protect, restrictTo("doctor"), getDoctorAppointments);
router.put("/:id/status", protect, restrictTo("doctor"), updateAppointmentStatus);

module.exports = router;