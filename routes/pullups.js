const express = require("express");
const router = express.Router();
const {
  addPullupSet,
  getCurrentStreak,
  getSummaryStats,
  updatePullupSet,
  deletePullupSet,
  getProgressStats,
  getRecordStats,
} = require("../controllers/pullupController");
const authToken = require("../middleware/auth");

router.post("/", authToken, addPullupSet);
router.get("/stats/streak", authToken, getCurrentStreak);
router.get("/stats/summary", authToken, getSummaryStats);
router.get("/stats/progress", authToken, getProgressStats);
router.get("/stats/records", authToken, getRecordStats);
router.patch("/:id", authToken, updatePullupSet);
router.delete("/:id", authToken, deletePullupSet);

module.exports = router;
