import { supabase } from '../lib/supabase';
import { getUserLocalDate, getUserTimezone, getLocalDayDifference } from './timezoneService';

/**
 * Service for managing user settings and reading streaks with Supabase persistence
 * and local fallback. Extended in Phase 8 for full accessibility & Web Push persistence.
 */

const DEFAULT_SETTINGS = {
  tradition: 'protestant',
  theme: 'light',
  fontSize: '18px',
  fontFamily: 'Inter',
  dyslexicFont: false,
  ttsRate: 1.0,
  notificationPrefs: { dailyReminder: true, reminderTime: '08:00' },
};

/**
 * Fetch current user settings from Supabase or localStorage
 */
export async function getUserSettings() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return getLocalSettings();
    }

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error || !data) {
      return getLocalSettings();
    }

    return {
      tradition: data.tradition || DEFAULT_SETTINGS.tradition,
      theme: data.theme || DEFAULT_SETTINGS.theme,
      fontSize: data.font_size || DEFAULT_SETTINGS.fontSize,
      fontFamily: data.font_family || DEFAULT_SETTINGS.fontFamily,
      dyslexicFont: data.dyslexic_font !== undefined ? data.dyslexic_font : (localStorage.getItem('berea_dyslexic') === 'true'),
      ttsRate: data.tts_rate ? parseFloat(data.tts_rate) : DEFAULT_SETTINGS.ttsRate,
      notificationPrefs: data.notification_prefs || DEFAULT_SETTINGS.notificationPrefs,
    };
  } catch (err) {
    console.warn('[userSettingsService] Error loading settings:', err);
    return getLocalSettings();
  }
}

/**
 * Update user settings in Supabase and sync to localStorage
 */
export async function updateUserSettings(newSettings) {
  saveLocalSettings(newSettings);

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { success: true, localOnly: true };

    const payload = {
      user_id: session.user.id,
      updated_at: new Date().toISOString(),
    };

    if (newSettings.tradition !== undefined) payload.tradition = newSettings.tradition;
    if (newSettings.theme !== undefined) payload.theme = newSettings.theme;
    if (newSettings.fontSize !== undefined) payload.font_size = newSettings.fontSize;
    if (newSettings.fontFamily !== undefined) payload.font_family = newSettings.fontFamily;
    if (newSettings.dyslexicFont !== undefined) payload.dyslexic_font = newSettings.dyslexicFont;
    if (newSettings.ttsRate !== undefined) payload.tts_rate = newSettings.ttsRate;
    if (newSettings.notificationPrefs !== undefined) payload.notification_prefs = newSettings.notificationPrefs;

    const { error } = await supabase
      .from('user_settings')
      .upsert(payload, { onConflict: 'user_id' });

    if (error) {
      console.warn('[userSettingsService] Remote update failed:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.warn('[userSettingsService] Exception during update:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Record daily reading activity to maintain user streak
 */
export async function recordReadingActivity() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return getLocalStreak();

    const userTimezone = getUserTimezone();
    const todayStr = getUserLocalDate(new Date(), userTimezone);

    const { data: existing } = await supabase
      .from('reading_streak')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (!existing) {
      const newStreak = {
        user_id: session.user.id,
        current_streak: 1,
        longest_streak: 1,
        last_active_date: todayStr,
        timezone: userTimezone,
        updated_at: new Date().toISOString(),
      };
      await supabase.from('reading_streak').insert(newStreak);
      saveLocalStreak(1, 1, todayStr);
      return newStreak;
    }

    if (existing.last_active_date === todayStr) {
      saveLocalStreak(existing.current_streak, existing.longest_streak, todayStr);
      return existing; // Already recorded today
    }

    const diffDays = getLocalDayDifference(existing.last_active_date, todayStr);

    let newCurrent = 1;
    if (diffDays === 1) {
      newCurrent = existing.current_streak + 1; // Consecutive local day
    }

    const newLongest = Math.max(existing.longest_streak, newCurrent);

    const updatePayload = {
      user_id: session.user.id,
      current_streak: newCurrent,
      longest_streak: newLongest,
      last_active_date: todayStr,
      timezone: userTimezone,
      updated_at: new Date().toISOString(),
    };

    await supabase.from('reading_streak').upsert(updatePayload, { onConflict: 'user_id' });
    saveLocalStreak(newCurrent, newLongest, todayStr);
    return updatePayload;
  } catch (err) {
    console.warn('[userSettingsService] Error recording reading activity:', err);
    return getLocalStreak();
  }
}

/**
 * Get reading streak details for current user or guest
 */
export async function getReadingStreak() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return getLocalStreak();

    const { data, error } = await supabase
      .from('reading_streak')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (error || !data) return getLocalStreak();

    return {
      currentStreak: data.current_streak || 0,
      longestStreak: data.longest_streak || 0,
      lastActiveDate: data.last_active_date,
      timezone: data.timezone || getUserTimezone(),
    };
  } catch {
    return getLocalStreak();
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getLocalSettings() {
  return {
    tradition: localStorage.getItem('berea_tradition') || DEFAULT_SETTINGS.tradition,
    theme: localStorage.getItem('berea_theme') || DEFAULT_SETTINGS.theme,
    fontSize: localStorage.getItem('berea_font_size') || DEFAULT_SETTINGS.fontSize,
    fontFamily: localStorage.getItem('berea_font_family') || DEFAULT_SETTINGS.fontFamily,
    dyslexicFont: localStorage.getItem('berea_dyslexic') === 'true',
    ttsRate: parseFloat(localStorage.getItem('berea_tts_rate') || DEFAULT_SETTINGS.ttsRate),
    notificationPrefs: DEFAULT_SETTINGS.notificationPrefs,
  };
}

function saveLocalSettings(settings) {
  if (settings.tradition !== undefined) localStorage.setItem('berea_tradition', settings.tradition);
  if (settings.theme !== undefined) localStorage.setItem('berea_theme', settings.theme);
  if (settings.fontSize !== undefined) localStorage.setItem('berea_font_size', settings.fontSize);
  if (settings.fontFamily !== undefined) localStorage.setItem('berea_font_family', settings.fontFamily);
  if (settings.dyslexicFont !== undefined) localStorage.setItem('berea_dyslexic', String(settings.dyslexicFont));
  if (settings.ttsRate !== undefined) localStorage.setItem('berea_tts_rate', settings.ttsRate.toString());
}

function getLocalStreak() {
  const current = parseInt(localStorage.getItem('berea_current_streak') || '7', 10);
  const longest = parseInt(localStorage.getItem('berea_longest_streak') || '14', 10);
  const lastActive = localStorage.getItem('berea_last_active_date') || new Date().toISOString().split('T')[0];

  return {
    currentStreak: current,
    longestStreak: longest,
    lastActiveDate: lastActive,
    timezone: getUserTimezone(),
  };
}

function saveLocalStreak(current, longest, dateStr) {
  localStorage.setItem('berea_current_streak', String(current));
  localStorage.setItem('berea_longest_streak', String(longest));
  localStorage.setItem('berea_last_active_date', dateStr);
}
