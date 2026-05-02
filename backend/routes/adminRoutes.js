const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  addDoctor,
  getStats
} = require("../controllers/adminController");

const { protect, restrictTo } = require("../middleware/authMiddleware");

// All admin routes should be restricted to admin
router.use(protect, restrictTo("admin"));

router.get("/users", getAllUsers);
router.post("/doctor", addDoctor);
router.get("/stats", getStats);

module.exports = router;