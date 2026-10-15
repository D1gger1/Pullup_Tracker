const mongoose = require("mongoose");
const { Schema } = mongoose;

const pullupSetSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  workoutId: {
    type: Schema.Types.ObjectId,
    ref: "Workout",
    required: true,
  },
  reps: {
    type: Number,
    required: true,
    min: 1,
  },
  performedAt: {
    type: Date,
    default: Date.now,
  },
});

pullupSetSchema.index({ userId: 1, performedAt: -1 });

pullupSetSchema.index({ userId: 1, workoutId: 1, performedAt: 1 });

const PullupSet = mongoose.model("PullupSet", pullupSetSchema);

module.exports = PullupSet;
