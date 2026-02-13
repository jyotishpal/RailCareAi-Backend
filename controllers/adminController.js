const Complaint = require("../models/Complaint");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");


// GET complaints for admin (region-based)
exports.getRegionComplaints = async (req, res) => {
  try {
    const region = req.user.region;

    const complaints = await Complaint.find({ region });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ACCEPT complaint
exports.acceptComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      complaintId: req.params.id,
    });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = "In Progress";

    complaint.timeline.push({
      status: "Accepted by Admin",
      updatedBy: "Admin",
    });

    await complaint.save();

    // 🔥 Send Email
    const user = await User.findById(complaint.userId);

    await sendEmail(
      user.email,
      "Complaint Accepted",
      `Your complaint ${complaint.complaintId} is now in progress.`
    );

    res.json({ message: "Complaint accepted and email sent" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// UPDATE complaint status
exports.updateComplaint = async (req, res) => {
  try {
    const { status, note } = req.body;

    const complaint = await Complaint.findOne({
      complaintId: req.params.id,
    });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = status;

    complaint.timeline.push({
      status: note || status,
      updatedBy: "Admin",
    });

    await complaint.save();

    // 🔥 Send Email
    const user = await User.findById(complaint.userId);

    await sendEmail(
      user.email,
      "Complaint Status Updated",
      `Your complaint ${complaint.complaintId} status updated to ${status}.`
    );

    res.json({ message: "Complaint updated and email sent" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// CLOSE complaint
exports.closeComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      complaintId: req.params.id,
    });

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = "Closed";
    complaint.resolvedAt = new Date();

    complaint.timeline.push({
      status: "Complaint Closed",
      updatedBy: "Admin",
    });

    await complaint.save();

    // 🔥 Send Email
    const user = await User.findById(complaint.userId);

    await sendEmail(
      user.email,
      "Complaint Resolved",
      `Your complaint ${complaint.complaintId} has been resolved successfully.`
    );

    res.json({ message: "Complaint closed and email sent" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
