const express = require("express");
const router = express.Router();
const {
  addPullupSet,
  getPullupSet,
  getDailyStats,
  getWeeklyStats,
  getCurrentStreak,
} = require("../controllers/pullupController");
const authToken = require("../middleware/auth");

router.post("/", authToken, addPullupSet);
router.get("/", authToken, getPullupSet);
router.get("/stats/daily", authToken, getDailyStats);
router.get("/stats/weekly", authToken, getWeeklyStats);
router.get("/stats/streak", authToken, getCurrentStreak);

module.exports = router;
