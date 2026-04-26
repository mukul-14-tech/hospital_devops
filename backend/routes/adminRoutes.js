const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  addDoctor,
  getStats
} = require("../controllers/adminController");

const protect = require("../middleware/authMiddleware");

router.get("/users", protect, getAllUsers);
router.post("/doctor", protect, addDoctor);
router.get("/stats", protect, getStats);

module.exports = router;