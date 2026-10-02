const express = require("express");

const router = express.Router();

const {
  getCurrentWorkout,
  finishWorkout,
} = require("../controllers/workoutController");

const authToken = require("../middleware/auth");

router.get("/current", authToken, getCurrentWorkout);
router.patch("/:id/finish", authToken, finishWorkout);

module.exports = router;
