const Complaint = require("../models/Complaint");
const generateComplaintId = require("../utils/generateComplaintId");
const {
  detectDepartment,
  detectPriority,
  detectRegion,
} = require("../services/aiEngine");

exports.createComplaint = async (req, res) => {
  try {
    const {
      pnr,
      trainNo,
      coach,
      seatNo,
      description,
    } = req.body;

    const mediaFiles = req.files ? req.files.map(file => file.path) : [];

    const department = detectDepartment(description);
    const priority = detectPriority(description);
    const region = detectRegion(pnr);

    const complaint = await Complaint.create({
      complaintId: generateComplaintId(),
      userId: req.user.id,
      region,
      department,
      priority,
      pnr,
      trainNo,
      coach,
      seatNo,
      description,
      media: mediaFiles,
      timeline: [
        {
          status: "Submitted",
          updatedBy: "User",
        },
      ],
    });

    res.status(201).json({
      message: "Complaint submitted successfully",
      complaintId: complaint.complaintId,
      department,
      priority,
      region,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.escalateComplaint = async (req, res) => {
  try {
    const { complaintId } = req.body;

    const complaint = await Complaint.findOne({ complaintId });

    if (!complaint)
      return res.status(404).json({ message: "Complaint not found" });

    complaint.escalatedToSuperAdmin = true;

    complaint.timeline.push({
      status: "Escalated to Super Admin",
      updatedBy: "User",
    });

    await complaint.save();

    res.json({ message: "Complaint escalated successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

