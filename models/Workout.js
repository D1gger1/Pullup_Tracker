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

workoutSchema.index(
  { userId: 1, status: 1 },
  { unique: true, partialFilterExpression: { status: "active" } },
);

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;
