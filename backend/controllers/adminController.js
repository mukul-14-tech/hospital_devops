const User = require("../models/User");
const Appointment = require("../models/Appointment");

// Get all users
exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// Add doctor
exports.addDoctor = async (req, res) => {
  const { name, email, password } = req.body;

  const doctor = await User.create({
    name,
    email,
    password, // (you can hash later, keep simple now)
    role: "doctor",
  });

  res.status(201).json(doctor);
};

// Dashboard stats
exports.getStats = async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalDoctors = await User.countDocuments({ role: "doctor" });
  const totalAppointments = await Appointment.countDocuments();

  res.json({
    totalUsers,
    totalDoctors,
    totalAppointments,
  });
};