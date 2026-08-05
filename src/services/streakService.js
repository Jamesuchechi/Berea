import { getReadingStreak, recordReadingActivity } from './userSettingsService';
import { getUserLocalDate, getUserTimezone, getLocalDayDifference } from './timezoneService';

/**
 * Timezone-Aware Streak & Activity Calculator
 */

export async function fetchUserStreakSummary() {
  const data = await getReadingStreak();
  const userTimezone = getUserTimezone();
  const todayStr = getUserLocalDate(new Date(), userTimezone);

  const isTodayActive = data.lastActiveDate === todayStr;
  const isStreakActive = data.lastActiveDate
    ? getLocalDayDifference(data.lastActiveDate, todayStr) <= 1
    : false;

  return {
    currentStreak: isStreakActive ? data.currentStreak : 0,
    longestStreak: data.longestStreak || 0,
    isTodayActive,
    userTimezone,
    lastActiveDate: data.lastActiveDate,
  };
}

export async function logDailyReadingSession() {
  return await recordReadingActivity();
}

/**
 * Generate recent 7-day activity indicators for streak dashboard
 */
export function getRecentActivityHeatmap(lastActiveDate, currentStreak) {
  const days = [];
  const today = new Date();
  const userTimezone = getUserTimezone();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = getUserLocalDate(d, userTimezone);
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

    const isCompleted = i < currentStreak;
    days.push({
      date: dateStr,
      label: dayLabel,
      isCompleted,
      isToday: i === 0,
    });
  }

  return days;
}
