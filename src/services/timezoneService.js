/**
 * Timezone & Local Date Calculation Service
 *
 * Ensures streak boundaries reset/increment at midnight in the user's local timezone
 * rather than UTC to avoid resetting streaks for non-US users at midnight UTC.
 */

/**
 * Get system auto-detected timezone or fallback to UTC
 */
export function getUserTimezone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

/**
 * Format a Date object or ISO string into a local 'YYYY-MM-DD' date string
 * in the specified timezone.
 */
export function getUserLocalDate(dateInput = new Date(), timezone = getUserTimezone()) {
  try {
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(d);
  } catch (err) {
    console.warn('[timezoneService] Error formatting date in timezone, fallback to ISO date:', err);
    const d = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return d.toISOString().split('T')[0];
  }
}

/**
 * Calculate difference in local days between two date strings (YYYY-MM-DD)
 */
export function getLocalDayDifference(startDateStr, endDateStr) {
  const start = new Date(startDateStr);
  const end = new Date(endDateStr);
  const diffTime = end.getTime() - start.getTime();
  return Math.round(diffTime / (1000 * 3600 * 24));
}
