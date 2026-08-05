import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getUserSettings, updateUserSettings } from '../userSettingsService';

// Mock Supabase client
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    },
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      upsert: vi.fn().mockResolvedValue({ error: null }),
    }),
  },
}));

describe('userSettingsService', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should return default settings when unauthenticated and localStorage is empty', async () => {
    const settings = await getUserSettings();
    expect(settings).toEqual({
      tradition: 'protestant',
      theme: 'light',
      fontSize: '18px',
      fontFamily: 'Inter',
      dyslexicFont: false,
      ttsRate: 1.0,
      notificationPrefs: { dailyReminder: true, reminderTime: '08:00' },
    });
  });

  it('should update local settings when unauthenticated', async () => {
    const updateResult = await updateUserSettings({ theme: 'dark', tradition: 'catholic' });
    expect(updateResult.success).toBe(true);

    const settings = await getUserSettings();
    expect(settings.theme).toBe('dark');
    expect(settings.tradition).toBe('catholic');
  });

  it('should persist theme change to localStorage', async () => {
    await updateUserSettings({ theme: 'dark' });
    expect(localStorage.getItem('berea_theme')).toBe('dark');
  });
});
