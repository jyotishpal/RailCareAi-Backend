const Complaint = require("../models/Complaint");
const generateComplaintId = require("../utils/generateComplaintId");
const { exec } = require("child_process");
const { validatePNR } = require("../services/pnrValidator");
const { validateTrain } = require("../services/trainValidator");

const {
  detectEmergencyKeywords,
  detectDepartment,
  detectPriority,
  detectRegion,
} = require("../services/aiEngine");

/* ---------------- TEXT ML Prediction ---------------- */

const getPrediction = (description) => {
  return new Promise((resolve) => {

    exec(`python3 ml/predict.py "${description}"`, (error, stdout) => {

      if (error) {
        console.log("ML error:", error.message);
        return resolve(null);
      }

      const output = stdout.trim();

      if (!output) return resolve(null);

      const [department, priority, confidence] = output.split(",");

      resolve({
        department,
        priority,
        confidence,
      });

    });

  });
};


/* ---------------- AUDIO → TEXT ---------------- */

const getAudioText = (audioPath) => {
  return new Promise((resolve) => {

    exec(`python3 ml/audio_to_text.py "${audioPath}"`, (error, stdout) => {

      if (error) {
        console.log("Audio AI error:", error.message);
        return resolve(null);
      }

      const text = stdout.trim();

      resolve(text);

    });

  });
};


/* ---------------- IMAGE → LABEL TEXT ---------------- */

const getImageLabel = (imagePath) => {
  return new Promise((resolve) => {

    exec(`python3 ml/image_predict.py "${imagePath}"`, (error, stdout) => {

      if (error) {
        console.log("Image AI error:", error.message);
        return resolve(null);
      }

      const output = stdout.trim();

      if (!output) return resolve(null);

      const [label] = output.split("|");

      resolve(label);

    });

  });
};


/* ---------------- CREATE COMPLAINT ---------------- */

exports.createComplaint = async (req, res) => {

  try {

    const {
      pnr,
      trainNo,
      coach,
      seatNo,
    } = req.body;
    /* -------- VALIDATE PNR -------- */

if (!validatePNR(pnr)) {
  return res.status(400).json({
    message: "Invalid PNR number"
  });
}

/* -------- VALIDATE TRAIN -------- */

if (!validateTrain(trainNo)) {
  return res.status(400).json({
    message: "Invalid Train Number"
  });
}
    let description = req.body.description || "";

    const mediaFiles = req.files ? req.files.map(file => file.path) : [];

    /* -------- VALIDATE INPUT -------- */

    if (!description && (!req.files || req.files.length === 0)) {
      return res.status(400).json({
        message: "Please provide description, image, or audio",
      });
    }

    const region = detectRegion(pnr);

    let finalDescription = description;

    /* -------- IMAGE DETECTION -------- */

    if (req.files && req.files.length > 0) {

      const imageFile = req.files.find(file =>
        file.mimetype.startsWith("image")
      );

      if (imageFile) {
            //sfsdafsf
            console.log("IMAGE FILE:", imageFile.path);
  console.log("Running Image AI...");
        const imageLabel = await getImageLabel(imageFile.path);
         //xftfyu
         console.log("IMAGE FILE:", imageFile.path);
  console.log("Running Image AI...");
        if (imageLabel) {
          finalDescription = imageLabel;
        }

      }

    }

    /* -------- AUDIO DETECTION -------- */

    if (req.files && req.files.length > 0) {

      const audioFile = req.files.find(file =>
        file.mimetype.startsWith("audio") ||
        file.mimetype.startsWith("video")
      );

      if (audioFile) {

        const audioText = await getAudioText(audioFile.path);

        if (audioText) {
          finalDescription = audioText;
        }

      }

    }

    /* -------- TEXT ML CLASSIFICATION -------- */

    const prediction = await getPrediction(finalDescription);
    //ftyufv
    console.log("FINAL DESCRIPTION:", finalDescription);
console.log("Running Text ML...");
    let department;
    let priority;
    let confidence = null;

    if (prediction) {

      department = prediction.department;
      priority = prediction.priority;
      confidence = prediction.confidence;

    } else {

      department = detectDepartment(finalDescription);
      priority = detectPriority(finalDescription);

    }
    /* -------- EMERGENCY KEYWORD OVERRIDE -------- */

if (detectEmergencyKeywords(finalDescription)) {
  priority = "emergency";
}

    /* -------- CREATE COMPLAINT -------- */

    const complaint = await Complaint.create({

      complaintId: generateComplaintId(),

      userId: req.user.id,

      region,
      department,
      priority,
      confidence,

      pnr,
      trainNo,
      coach,
      seatNo,

      description: finalDescription,

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
      confidence,

    });

  } catch (error) {

    res.status(500).json({ error: error.message });

  }

};


/* ---------------- USER COMPLAINTS ---------------- */

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


/* ---------------- ESCALATE COMPLAINT ---------------- */

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
