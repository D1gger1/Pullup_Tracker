const PullupSet = require("../models/PullupSet");
const Workout = require("../models/Workout");
const {
  getTrainingDays,
  calculateCurrentStreak,
  calculateLongestStreak,
} = require("../utils/streak");

async function addPullupSet(req, res) {
  try {
    const { reps } = req.body;
    const userId = req.user.userId;

    if (!Number.isInteger(reps) || reps < 1) {
      return res.status(400).json({
        message: "Количество повторений должно быть целым числом больше нуля.",
      });
    }

    let activeWorkout = await Workout.findOne({
      userId,
      status: "active",
    }).sort({ startedAt: -1 });

    if (!activeWorkout) {
      try {
        activeWorkout = await Workout.create({ userId });
      } catch (error) {
        if (error.code !== 11000) throw error;

        activeWorkout = await Workout.findOne({
          userId,
          status: "active",
        }).sort({ startedAt: -1 });
      }
    }

    const newPullupSet = await PullupSet.create({
      userId,
      workoutId: activeWorkout._id,
      reps,
    });

    return res.status(201).json(newPullupSet);
  } catch (error) {
    console.error("Ошибка создания подхода:", error);

    return res.status(500).json({
      message: "Не удалось сохранить подход.",
    });
  }
}

async function getCurrentStreak(req, res) {
  try {
    const userId = req.user.userId;

    const sets = await PullupSet.find({ userId }).select("performedAt").lean();

    const trainingDays = getTrainingDays(sets.map((set) => set.performedAt));
    const currentStreak = calculateCurrentStreak(trainingDays);

    res.status(200).json({ currentStreak });
  } catch (err) {
    res.status(500).json({ message: "Не удалось загрузить текущую серию." });
  }
}

async function getSummaryStats(req, res) {
  try {
    const userId = req.user.userId;
    const sets = await PullupSet.find({ userId }).select("reps performedAt");

    const bestSet = sets.reduce((maxReps, set) => {
      return Math.max(maxReps, set.reps);
    }, 0);

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const completedWorkouts = await Workout.countDocuments({
      userId,
      status: "completed",
    });

    const monthlyReps = sets
      .filter((set) => {
        const date = new Date(set.performedAt);
        return date >= startOfMonth && date < startOfNextMonth;
      })
      .reduce((sum, set) => sum + set.reps, 0);

    res.status(200).json({ monthlyReps, bestSet, completedWorkouts });
  } catch (error) {
    res.status(500).json({ message: "Не удалось загрузить общую статистику" });
  }
}
async function updatePullupSet(req, res) {
  try {
    const { id } = req.params;
    const { reps } = req.body;
    const userId = req.user.userId;

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return res.status(400).json({
        message: "Некорректный идентификатор подхода.",
      });
    }

    if (!Number.isInteger(reps) || reps < 1) {
      return res.status(400).json({
        message: "Количество повторений должно быть целым числом больше нуля.",
      });
    }

    const updatedSet = await PullupSet.findOneAndUpdate(
      { _id: id, userId },
      { $set: { reps } },
      { returnDocument: "after", runValidators: true },
    );

    if (!updatedSet) {
      return res.status(404).json({
        message: "Подход не найден.",
      });
    }

    return res.status(200).json(updatedSet);
  } catch (error) {
    res.status(500).json({ message: "Не удалось изменить подход." });
  }
}

async function deletePullupSet(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    if (!/^[a-fA-F0-9]{24}$/.test(id)) {
      return res.status(400).json({
        message: "Некорректный идентификатор подхода.",
      });
    }

    const deleteSet = await PullupSet.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deleteSet) {
      return res.status(404).json({ message: "Подход не найден" });
    }
    return res.status(200).json({ message: "Подход удалён." });
  } catch (error) {
    res.status(500).json({ message: "Не удалось удалить подход" });
  }
}

async function getProgressStats(req, res) {
  try {
    const userId = req.user.userId;
    const period = req.query.period ?? "month";

    const periodDays = {
      week: 7,
      month: 30,
      threeMonths: 90,
    };

    const daysCount = periodDays[period];

    if (!daysCount) {
      return res.status(400).json({
        message: "Допустимые периоды: week, month или threeMonths.",
      });
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - (daysCount - 1));
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date();

    const sets = await PullupSet.find({
      userId,
      performedAt: {
        $gte: startDate,
        $lte: endDate,
      },
    })
      .select("reps performedAt")
      .sort({ performedAt: 1 })
      .lean();

    const totalsByDate = new Map();

    for (const set of sets) {
      const performedAt = new Date(set.performedAt);

      const year = performedAt.getFullYear();
      const month = String(performedAt.getMonth() + 1).padStart(2, "0");
      const day = String(performedAt.getDate()).padStart(2, "0");

      const date = `${year}-${month}-${day}`;
      const currentTotal = totalsByDate.get(date) ?? 0;

      totalsByDate.set(date, currentTotal + set.reps);
    }

    const points = Array.from(totalsByDate, ([date, totalReps]) => ({
      date,
      totalReps,
    }));

    const totalReps = sets.reduce((sum, set) => sum + set.reps, 0);

    return res.status(200).json({
      period,
      totalReps,
      points,
    });
  } catch (error) {
    console.error("Ошибка загрузки прогресса:", error);

    return res.status(500).json({
      message: "Не удалось загрузить прогресс.",
    });
  }
}

async function getRecordStats(req, res) {
  try {
    const userId = req.user.userId;

    const bestSet = await PullupSet.findOne({
      userId,
    })
      .sort({
        reps: -1,
        performedAt: 1,
      })
      .select("_id reps performedAt")
      .lean();

    const completedWorkouts = await Workout.find({
      userId,
      status: "completed",
    })
      .select("_id startedAt finishedAt")
      .sort({
        finishedAt: 1,
      })
      .lean();

    const workoutIds = completedWorkouts.map((workout) => workout._id);

    const workoutSets = await PullupSet.find({
      userId,
      workoutId: {
        $in: workoutIds,
      },
    })
      .select("workoutId reps")
      .lean();

    const statsByWorkoutId = new Map();

    for (const set of workoutSets) {
      const workoutId = String(set.workoutId);

      const currentStats = statsByWorkoutId.get(workoutId) ?? {
        totalReps: 0,
        setsCount: 0,
      };

      statsByWorkoutId.set(workoutId, {
        totalReps: currentStats.totalReps + set.reps,
        setsCount: currentStats.setsCount + 1,
      });
    }

    const workoutsWithStats = completedWorkouts.map((workout) => {
      const workoutStats = statsByWorkoutId.get(String(workout._id)) ?? {
        totalReps: 0,
        setsCount: 0,
      };

      return {
        ...workout,
        totalReps: workoutStats.totalReps,
        setsCount: workoutStats.setsCount,
      };
    });

    const bestWorkout = workoutsWithStats.reduce((currentBest, workout) => {
      if (workout.totalReps === 0) {
        return currentBest;
      }

      if (!currentBest || workout.totalReps > currentBest.totalReps) {
        return workout;
      }

      return currentBest;
    }, null);

    const mostSetsWorkout = workoutsWithStats.reduce(
      (bestWorkout, currentWorkout) => {
        if (currentWorkout.setsCount === 0) {
          return bestWorkout;
        }

        if (bestWorkout === null) {
          return currentWorkout;
        }

        if (currentWorkout.setsCount > bestWorkout.setsCount) {
          return currentWorkout;
        }

        return bestWorkout;
      },
      null,
    );

    const allSets = await PullupSet.find({ userId })
      .select("performedAt")
      .lean();
    const trainingDays = getTrainingDays(allSets.map((set) => set.performedAt));
    const longestStreak = calculateLongestStreak(trainingDays);

    return res.status(200).json({
      bestSet,
      bestWorkout,
      mostSetsWorkout,
      longestStreak,
    });
  } catch (error) {
    console.error("Ошибка загрузки рекордов:", error);

    return res.status(500).json({
      message: "Не удалось загрузить рекорды.",
    });
  }
}

module.exports = {
  addPullupSet,
  getCurrentStreak,
  getSummaryStats,
  updatePullupSet,
  deletePullupSet,
  getProgressStats,
  getRecordStats,
};
