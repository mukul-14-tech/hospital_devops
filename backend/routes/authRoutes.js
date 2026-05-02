const express = require("express");
const router = express.Router();
const { register, login, getDoctors, getPatients } = require("../controllers/authController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/doctors", protect, getDoctors);
router.get("/patients", protect, restrictTo("doctor"), getPatients);

module.exports = router;