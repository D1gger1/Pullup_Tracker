const MILLISECONDS_IN_DAY = 24 * 60 * 60 * 1000;

function startOfDay(date) {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  return day.getTime();
}

function getTrainingDays(dates) {
  return Array.from(new Set(dates.map(startOfDay))).sort((a, b) => a - b);
}

function calculateCurrentStreak(days, today = new Date()) {
  const trainingDays = new Set(days);
  const cursor = new Date(startOfDay(today));

  if (!trainingDays.has(cursor.getTime())) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;

  while (trainingDays.has(cursor.getTime())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}

function calculateLongestStreak(days) {
  let longest = 0;
  let current = 0;
  let previousDay = null;

  for (const day of days) {
    const isNextDay =
      previousDay !== null &&
      Math.round((day - previousDay) / MILLISECONDS_IN_DAY) === 1;

    current = isNextDay ? current + 1 : 1;
    longest = Math.max(longest, current);
    previousDay = day;
  }

  return longest;
}

module.exports = {
  startOfDay,
  getTrainingDays,
  calculateCurrentStreak,
  calculateLongestStreak,
};
