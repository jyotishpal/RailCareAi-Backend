const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { createComplaint,getMyComplaints,escalateComplaint} = require("../controllers/complaintController");

router.post(
  "/create",
  authMiddleware,
  upload.array("media", 5),
  createComplaint
);
router.get(
  "/my",
  authMiddleware,
  getMyComplaints
);

router.put(
  "/escalate",
  authMiddleware,
  escalateComplaint
);


module.exports = router;
