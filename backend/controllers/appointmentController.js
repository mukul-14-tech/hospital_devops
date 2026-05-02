const Appointment = require("../models/Appointment");

// BOOK APPOINTMENT (Patient)
exports.bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, date } = req.body;

    if (!doctorId || !date) {
      return res.status(400).json({ message: "Please provide doctorId and date." });
    }

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor: doctorId,
      date,
    });

    res.status(201).json({ message: "Appointment booked", appointment });
  } catch (error) {
    next(error);
  }
};

// GET PATIENT APPOINTMENTS
exports.getPatientAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patient: req.user.id })
      .populate("doctor", "name email");

    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

// GET DOCTOR APPOINTMENTS
exports.getDoctorAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ doctor: req.user.id })
      .populate("patient", "name email");

    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

// UPDATE APPOINTMENT STATUS (Doctor)
exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
      return res.status(400).json({ message: "Please provide a status." });
    }

    // Validate status
    if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, doctor: req.user.id },
      { status },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found or not authorized" });
    }

    res.json({ message: "Appointment status updated", appointment });
  } catch (error) {
    next(error);
  }
};