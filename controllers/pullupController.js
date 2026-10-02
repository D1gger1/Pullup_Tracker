const PullupSet = require("../models/PullupSet");
const Workout = require("../models/Workout");

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
      activeWorkout = await Workout.create({
        userId,
      });
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

async function getPullupSet(req, res) {
  try {
    const userId = req.user.userId;
    const pullupSets = await PullupSet.find({ userId });
    res.status(200).json(pullupSets);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function getDailyStats(req, res) {
  try {
    const userId = req.user.userId;

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const sets = await PullupSet.find({
      userId,
      performedAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const totalReps = sets.reduce((sum, set) => sum + set.reps, 0);

    res.status(200).json({ totalReps, sets });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function getWeeklyStats(req, res) {
  try {
    const userId = req.user.userId;

    const startOfWeek = new Date();
    const dayOfWeek = startOfWeek.getDay();
    const diff = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    startOfWeek.setDate(startOfWeek.getDate() - diff);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const sets = await PullupSet.find({
      userId,
      performedAt: { $gte: startOfWeek, $lte: endOfWeek },
    });

    const totalReps = sets.reduce((sum, set) => sum + set.reps, 0);

    res.status(200).json({ totalReps, sets });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function getCurrentStreak(req, res) {
  try {
    const userId = req.user.userId;

    const sets = await PullupSet.find({ userId })
      .select("performedAt")
      .sort({ performedAt: -1 });

    const trainingDays = new Set(
      sets.map((set) => {
        const date = new Date(set.performedAt);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      }),
    );

    const currentDay = new Date();
    currentDay.setHours(0, 0, 0, 0);

    let currentStreak = 0;

    if (!trainingDays.has(currentDay.getTime())) {
      currentDay.setDate(currentDay.getDate() - 1);
    }

    while (trainingDays.has(currentDay.getTime())) {
      currentStreak += 1;
      currentDay.setDate(currentDay.getDate() - 1);
    }
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

    const monthlyReps = sets
      .filter((set) => {
        const date = new Date(set.performedAt);
        return date >= startOfMonth && date < startOfNextMonth;
      })
      .reduce((sum, set) => sum + set.reps, 0);

    res.status(200).json({ monthlyReps, bestSet });
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
      { new: true, runValidators: true },
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

module.exports = {
  addPullupSet,
  getPullupSet,
  getDailyStats,
  getWeeklyStats,
  getCurrentStreak,
  getSummaryStats,
  updatePullupSet,
  deletePullupSet,
};
