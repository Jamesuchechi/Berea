import { supabase } from '../lib/supabase';
import { getUserLocalDate, getUserTimezone, getLocalDayDifference } from './timezoneService';

/**
 * Service for managing user settings and reading streaks with Supabase persistence
 * and local fallback.
 */

const DEFAULT_SETTINGS = {
  tradition: 'protestant',
  theme: 'light',
  fontSize: 'medium',
  fontFamily: 'Inter',
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
      ttsRate: data.tts_rate || DEFAULT_SETTINGS.ttsRate,
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
    if (!session?.user) return null;

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
      return newStreak;
    }

    if (existing.last_active_date === todayStr) {
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
    return updatePayload;
  } catch (err) {
    console.warn('[userSettingsService] Error recording reading activity:', err);
    return null;
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getLocalSettings() {
  return {
    tradition: localStorage.getItem('berea_tradition') || DEFAULT_SETTINGS.tradition,
    theme: localStorage.getItem('berea_theme') || DEFAULT_SETTINGS.theme,
    fontSize: localStorage.getItem('berea_font_size') || DEFAULT_SETTINGS.fontSize,
    fontFamily: localStorage.getItem('berea_font_family') || DEFAULT_SETTINGS.fontFamily,
    ttsRate: parseFloat(localStorage.getItem('berea_tts_rate') || DEFAULT_SETTINGS.ttsRate),
    notificationPrefs: DEFAULT_SETTINGS.notificationPrefs,
  };
}

function saveLocalSettings(settings) {
  if (settings.tradition) localStorage.setItem('berea_tradition', settings.tradition);
  if (settings.theme) localStorage.setItem('berea_theme', settings.theme);
  if (settings.fontSize) localStorage.setItem('berea_font_size', settings.fontSize);
  if (settings.fontFamily) localStorage.setItem('berea_font_family', settings.fontFamily);
  if (settings.ttsRate) localStorage.setItem('berea_tts_rate', settings.ttsRate.toString());
}
