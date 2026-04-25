const Record = require("../models/Record");

// Patient uploads report
exports.uploadReport = async (req, res) => {
  try {
    const { reportUrl } = req.body;

    const record = await Record.create({
      patient: req.user.id,
      reportUrl,
    });

    res.status(201).json({ message: "Report uploaded", record });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Doctor adds prescription
exports.addPrescription = async (req, res) => {
  try {
    const { recordId, prescription } = req.body;

    const record = await Record.findByIdAndUpdate(
      recordId,
      {
        prescription,
        doctor: req.user.id,
      },
      { new: true }
    );

    res.json({ message: "Prescription added", record });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get patient history
exports.getPatientRecords = async (req, res) => {
  try {
    const records = await Record.find({ patient: req.user.id })
      .populate("doctor", "name email");

    res.json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};