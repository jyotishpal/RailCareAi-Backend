const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  getRegionComplaints,
  acceptComplaint,
  updateComplaint,
  closeComplaint,
} = require("../controllers/adminController");


// Only admin can access
router.get(
  "/complaints",
  authMiddleware,
  roleMiddleware("admin"),
  getRegionComplaints
);

router.put(
  "/accept/:id",
  authMiddleware,
  roleMiddleware("admin"),
  acceptComplaint
);

router.put(
  "/update/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateComplaint
);

router.put(
  "/close/:id",
  authMiddleware,
  roleMiddleware("admin"),
  closeComplaint
);

module.exports = router;
