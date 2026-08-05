import { describe, it, expect, beforeEach, vi } from 'vitest';
import { audioEngine } from '../../features/audio/AudioEngine';
import { getUserSettings, updateUserSettings } from '../userSettingsService';
import { fetchUserStreakSummary, getRecentActivityHeatmap } from '../streakService';
import { getNotificationPermissionStatus, requestNotificationPermission } from '../pushNotificationService';

describe('Phase 8 Services Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('AudioEngine (Arbitrary TTS)', () => {
    it('should initialize with default rate 1.0 and subscribe to events', () => {
      let lastStatus = null;
      const unsubscribe = audioEngine.subscribe(status => {
        lastStatus = status;
      });

      audioEngine.setRate(1.25);
      expect(audioEngine.currentRate).toBe(1.25);
      expect(lastStatus.rate).toBe(1.25);
      unsubscribe();
    });

    it('should safely handle speakText calls when SpeechSynthesis is unavailable or mocked', () => {
      expect(() => audioEngine.speakText('Test scripture note text')).not.toThrow();
    });
  });

  describe('userSettingsService Accessibility Persistence', () => {
    it('should persist dyslexic font and font size to localStorage fallback', async () => {
      await updateUserSettings({ dyslexicFont: true, fontSize: '22px', ttsRate: 1.5 });
      const settings = await getUserSettings();

      expect(settings.dyslexicFont).toBe(true);
      expect(settings.fontSize).toBe('22px');
      expect(settings.ttsRate).toBe(1.5);
    });
  });

  describe('streakService & Timezone Activity', () => {
    it('should return user streak summary with timezone information', async () => {
      const summary = await fetchUserStreakSummary();
      expect(summary.currentStreak).toBeGreaterThanOrEqual(0);
      expect(summary.userTimezone).toBeDefined();
    });

    it('should generate 7-day activity heatmap items', () => {
      const heatmap = getRecentActivityHeatmap('2026-08-05', 3);
      expect(heatmap.length).toBe(7);
      expect(heatmap[6].isToday).toBe(true);
      expect(heatmap[0].date).toBeDefined();
    });
  });

  describe('pushNotificationService', () => {
    it('should return notification permission status without throwing', () => {
      const status = getNotificationPermissionStatus();
      expect(['granted', 'denied', 'default', 'unsupported']).toContain(status);
    });

    it('should handle notification permission request gracefully in test environment', async () => {
      const result = await requestNotificationPermission();
      expect(result).toBeDefined();
      expect(result.permission).toBeDefined();
    });
  });
});
