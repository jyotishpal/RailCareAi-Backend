const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resolvedAt: {
  type: Date,
},

    region: String,
    department: String,
    priority: String,
    confidence: {
  type: Number,
  default: 0
},
    pnr: String,
    trainNo: String,
    coach: String,
    seatNo: String,
    description: String,
    media: [String],
    status: {
      type: String,
      default: "Submitted",
    },
    escalatedToSuperAdmin: {
  type: Boolean,
  default: false,
},
superAdminStatus: {
  type: String,
  default: "Pending", // Pending | Received | Solved
},
    timeline: [
      {
        status: String,
        updatedBy: String,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Complaint", complaintSchema);
