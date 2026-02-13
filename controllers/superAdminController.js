const Complaint = require("../models/Complaint");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");


// CREATE ADMIN
exports.createAdmin = async (req, res) => {
  try {
    const { name, email, phone, password, region } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Admin already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "admin",
      region,
    });

    res.status(201).json({
      message: "Admin created successfully",
      admin,
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET ALL COMPLAINTS
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find();
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.regionAnalytics = async (req, res) => {
  try {
    const { region } = req.query;

    let matchStage = {};

    if (region && region !== "All") {
      matchStage.region = region;
    }

    const data = await Complaint.aggregate([
      { $match: matchStage },
      { $group: { _id: "$region", count: { $sum: 1 } } },
    ]);

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DEPARTMENT-WISE COUNT
exports.departmentAnalytics = async (req, res) => {
  try {
    const data = await Complaint.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// PRIORITY ANALYTICS
exports.priorityAnalytics = async (req, res) => {
  try {
    const data = await Complaint.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.avgResolutionTime = async (req, res) => {
  try {

    const data = await Complaint.aggregate([
      {
        $match: {
          status: "Closed",
          resolvedAt: { $exists: true },
        },
      },
      {
        $project: {
          timeTaken: {
            $divide: [
              { $subtract: ["$resolvedAt", "$createdAt"] },
              1000 * 60 // convert to minutes
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          avgTime: { $avg: "$timeTaken" },
        },
      },
    ]);

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.adminPerformance = async (req, res) => {
  try {
    const data = await Complaint.aggregate([
      {
        $group: {
          _id: "$region",
          totalComplaints: { $sum: 1 },
          closedComplaints: {
            $sum: { $cond: [{ $eq: ["$status", "Closed"] }, 1, 0] }
          }
        }
      }
    ]);

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEscalatedComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({
      escalatedToSuperAdmin: true,
    });

    res.json(complaints);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.receiveEscalated = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      complaintId: req.params.id,
    });

    if (!complaint)
      return res.status(404).json({ message: "Not found" });

    complaint.superAdminStatus = "Received";

    complaint.timeline.push({
      status: "Received by Super Admin",
      updatedBy: "SuperAdmin",
    });

    await complaint.save();

    // 🔥 Get user email from User collection
    const user = await User.findById(complaint.userId);

    await sendEmail(
      user.email,
      "Complaint Received by Super Admin",
      `Your complaint ${complaint.complaintId} has been received by Super Admin.`
    );

    res.json({ message: "Complaint received and email sent" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.solveEscalated = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({
      complaintId: req.params.id,
    });

    if (!complaint)
      return res.status(404).json({ message: "Not found" });

    complaint.superAdminStatus = "Solved";
    complaint.status = "Closed";
    complaint.resolvedAt = new Date(); // 🔥 ADD THIS


    complaint.timeline.push({
      status: "Solved by Super Admin",
      updatedBy: "SuperAdmin",
    });

    await complaint.save();

    const user = await User.findById(complaint.userId);

    await sendEmail(
      user.email,
      "Complaint Resolved",
      `Your complaint ${complaint.complaintId} has been successfully resolved.`
    );

    res.json({ message: "Complaint solved and email sent" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
