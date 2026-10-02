const Workout = require("../models/Workout");
const PullupSet = require("../models/PullupSet");

async function getCurrentWorkout(req, res) {
  try {
    const userId = req.user.userId;

    const workout = await Workout.findOne({
      userId,
      status: "active",
    }).sort({ startedAt: -1 });

    if (!workout) {
      return res.status(200).json({
        workout: null,
        sets: [],
        totalReps: 0,
      });
    }

    const sets = await PullupSet.find({
      userId,
      workoutId: workout._id,
    }).sort({ performedAt: 1 });

    const totalReps = sets.reduce((sum, set) => sum + set.reps, 0);

    return res.status(200).json({
      workout,
      sets,
      totalReps,
    });
  } catch (error) {
    console.error("Ошибка загрузки текущей тренировки:", error);

    return res.status(500).json({
      message: "Не удалось загрузить текущую тренировку.",
    });
  }
}

async function finishWorkout(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return res.status(400).json({
        message: "Некорректный идентификатор тренировки.",
      });
    }

    const workout = await Workout.findOneAndUpdate(
      {
        _id: id,
        userId,
        status: "active",
      },
      {
        $set: {
          status: "completed",
          finishedAt: new Date(),
        },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!workout) {
      return res.status(404).json({
        message: "Активная тренировка не найдена.",
      });
    }

    return res.status(200).json({
      message: "Тренировка завершена.",
      workout,
    });
  } catch (error) {
    console.error("Ошибка завершения тренировки:", error);

    return res.status(500).json({
      message: "Не удалось завершить тренировку.",
    });
  }
}

module.exports = {
  getCurrentWorkout,
  finishWorkout,
};
