const express = require("express");

const router = express.Router();

const {
  getCurrentWorkout,
  finishWorkout,
  getCompletedWorkouts,
} = require("../controllers/workoutController");

const authToken = require("../middleware/auth");

router.get("/current", authToken, getCurrentWorkout);
router.patch("/:id/finish", authToken, finishWorkout);
router.get("/", authToken, getCompletedWorkouts);

module.exports = router;
