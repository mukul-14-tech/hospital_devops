const Appointment = require("../models/Appointment");

// BOOK APPOINTMENT (Patient)
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date } = req.body;

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      date,
    });

    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET PATIENT APPOINTMENTS
exports.getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate("doctor", "name email");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET DOCTOR APPOINTMENTS
exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id })
      .populate("patient", "name email");

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};