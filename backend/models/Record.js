const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  reportUrl: {
    type: String, // for uploaded file URL (temporary)
  },
  prescription: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Record", recordSchema);