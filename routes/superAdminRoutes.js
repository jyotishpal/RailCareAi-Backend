const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createAdmin,
  getAllComplaints,
  regionAnalytics,
  departmentAnalytics,
  priorityAnalytics,
  avgResolutionTime,
  adminPerformance,
  getEscalatedComplaints,
  receiveEscalated,
  solveEscalated,
} = require("../controllers/superAdminController");


router.post(
  "/create-admin",
  authMiddleware,
  roleMiddleware("superadmin"),
  createAdmin
);

router.get(
  "/complaints",
  authMiddleware,
  roleMiddleware("superadmin"),
  getAllComplaints
);

router.get(
  "/analytics/region",
  authMiddleware,
  roleMiddleware("superadmin"),
  regionAnalytics
);

router.get(
  "/analytics/department",
  authMiddleware,
  roleMiddleware("superadmin"),
  departmentAnalytics
);

router.get(
  "/analytics/priority",
  authMiddleware,
  roleMiddleware("superadmin"),
  priorityAnalytics
);

router.get(
  "/analytics/resolution-time",
  authMiddleware,
  roleMiddleware("superadmin"),
  avgResolutionTime
);

router.get(
  "/analytics/admin-performance",
  authMiddleware,
  roleMiddleware("superadmin"),
  adminPerformance
);

router.get(
  "/escalated",
  authMiddleware,
  roleMiddleware("superadmin"),
  getEscalatedComplaints
);

router.put(
  "/receive/:id",
  authMiddleware,
  roleMiddleware("superadmin"),
  receiveEscalated
);

router.put(
  "/solve/:id",
  authMiddleware,
  roleMiddleware("superadmin"),
  solveEscalated
);

module.exports = router;
