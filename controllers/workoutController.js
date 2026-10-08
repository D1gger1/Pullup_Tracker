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
        returnDocument: "after",
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

async function getCompletedWorkouts(req, res) {
  try {
    const userId = req.user.userId;

    const workouts = await Workout.find({
      userId,
      status: "completed",
      finishedAt: { $ne: null },
    })
      .sort({ finishedAt: -1 })
      .lean();

    if (workouts.length === 0) {
      return res.status(200).json([]);
    }

    const workoutIds = workouts.map((workout) => workout._id);

    const sets = await PullupSet.find({
      userId,
      workoutId: { $in: workoutIds },
    })
      .sort({ performedAt: 1 })
      .lean();

    const setsByWorkout = new Map();

    for (const set of sets) {
      const workoutId = String(set.workoutId);
      const workoutSets = setsByWorkout.get(workoutId) ?? [];

      workoutSets.push(set);
      setsByWorkout.set(workoutId, workoutSets);
    }

    const completedWorkouts = workouts.map((workout) => {
      const workoutSets = setsByWorkout.get(String(workout._id)) ?? [];

      const totalReps = workoutSets.reduce((sum, set) => sum + set.reps, 0);

      const durationMilliseconds =
        new Date(workout.finishedAt).getTime() -
        new Date(workout.startedAt).getTime();

      const durationMinutes = Math.max(
        1,
        Math.ceil(durationMilliseconds / 60000),
      );

      return {
        ...workout,
        sets: workoutSets,
        setsCount: workoutSets.length,
        totalReps,
        durationMinutes,
      };
    });

    return res.status(200).json(completedWorkouts);
  } catch (error) {
    console.error("Ошибка загрузки истории тренировок:", error);

    return res.status(500).json({
      message: "Не удалось загрузить историю тренировок.",
    });
  }
}

module.exports = {
  getCurrentWorkout,
  finishWorkout,
  getCompletedWorkouts,
};
