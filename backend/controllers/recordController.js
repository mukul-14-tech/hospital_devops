const Record = require("../models/Record");

// Patient uploads report
exports.uploadReport = async (req, res, next) => {
  try {
    let reportUrl = req.body.reportUrl;

    if (req.file) {
      reportUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    }

    if (!reportUrl) {
      return res.status(400).json({ message: "Please provide a reportUrl or upload a file." });
    }

    const record = await Record.create({
      patient: req.user.id,
      reportUrl,
    });

    res.status(201).json({ message: "Report uploaded", record });
  } catch (error) {
    next(error);
  }
};

// Doctor adds prescription
exports.addPrescription = async (req, res, next) => {
  try {
    const { recordId, patientId, prescription } = req.body;

    if (!prescription) {
      return res.status(400).json({ message: "Please provide a prescription." });
    }

    let record;
    if (recordId) {
      record = await Record.findByIdAndUpdate(
        recordId,
        {
          prescription,
          doctor: req.user.id,
        },
        { new: true }
      );
      if (!record) {
        return res.status(404).json({ message: "Record not found" });
      }
    } else if (patientId) {
      record = await Record.create({
        patient: patientId,
        doctor: req.user.id,
        prescription,
      });
    } else {
      return res.status(400).json({ message: "Must provide recordId or patientId" });
    }

    res.json({ message: "Prescription added", record });
  } catch (error) {
    next(error);
  }
};

// Get patient history
exports.getPatientRecords = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === "patient") {
      query.patient = req.user.id;
    } else if (req.user.role === "doctor") {
      // For now, let doctors see all records or just records assigned to them
      // Let's allow them to see records they created or just all records.
      // If we want doctors to see all records, we leave query empty.
      // Let's leave query empty so they can see all patient records.
    }

    const records = await Record.find(query)
      .populate("doctor", "name email")
      .populate("patient", "name email");

    res.json(records);
  } catch (error) {
    next(error);
  }
};