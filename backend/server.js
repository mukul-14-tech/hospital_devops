const express = require("express");
const cors = require("cors");
require("dotenv").config();


const app = express();

const connectDB = require("./config/db");

connectDB(); // ADD THIS

const authRoutes = require("./routes/authRoutes");

const appointmentRoutes = require("./routes/appointmentRoutes");



// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/appointments", appointmentRoutes);
app.use("/api/auth", authRoutes);




// Test Route
app.get("/", (req, res) => {
  res.send("Hospital Backend API Running 🚀");
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});