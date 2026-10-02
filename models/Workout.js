const mongoose = require("mongoose");
const { Schema } = mongoose;

const workoutSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  startedAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
  finishedAt: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    enum: ["active", "completed"],
    default: "active",
    required: true,
  },
});

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;
