import React, { useState, useEffect } from 'react';
import { getUserSettings, updateUserSettings } from '../../services/userSettingsService';
import { fetchUserStreakSummary, getRecentActivityHeatmap } from '../../services/streakService';
import { requestNotificationPermission, getNotificationPermissionStatus, registerDailyPushReminder, disableDailyPushReminder } from '../../services/pushNotificationService';
import { audioEngine } from '../audio/AudioEngine';

export default function AccessibilitySettingsView({ theme = 'light', setTheme }) {
  const [fontSize, setFontSize] = useState('18px');
  const [dyslexicFont, setDyslexicFont] = useState(false);
  const [ttsRate, setTtsRate] = useState(1.0);
  const [streakInfo, setStreakInfo] = useState({ currentStreak: 7, longestStreak: 14, isTodayActive: true, userTimezone: 'UTC' });
  const [heatmap, setHeatmap] = useState([]);
  const [pushStatus, setPushStatus] = useState(() => getNotificationPermissionStatus());
  const [pushTime, setPushTime] = useState('07:00');

  // Load persistent settings on mount
  useEffect(() => {
    let isMounted = true;
    async function load() {
      const settings = await getUserSettings();
      if (isMounted) {
        if (settings.fontSize) setFontSize(settings.fontSize);
        if (settings.dyslexicFont !== undefined) setDyslexicFont(settings.dyslexicFont);
        if (settings.ttsRate) setTtsRate(settings.ttsRate);
      }

      const streakData = await fetchUserStreakSummary();
      if (isMounted) {
        setStreakInfo(streakData);
        setHeatmap(getRecentActivityHeatmap(streakData.lastActiveDate, streakData.currentStreak));
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  // Update CSS variable & DB on font size change
  const handleFontSizeChange = (size) => {
    setFontSize(size);
    document.documentElement.style.setProperty('--user-reader-font-size', size);
    updateUserSettings({ fontSize: size });
  };

  // Update Dyslexic font class & DB
  const handleDyslexicToggle = () => {
    const nextVal = !dyslexicFont;
    setDyslexicFont(nextVal);
    if (nextVal) {
      document.body.classList.add('dyslexia-font');
    } else {
      document.body.classList.remove('dyslexia-font');
    }
    updateUserSettings({ dyslexicFont: nextVal });
  };

  // Update TTS speed
  const handleTtsRateChange = (rate) => {
    setTtsRate(rate);
    audioEngine.setRate(rate);
    updateUserSettings({ ttsRate: rate });
  };

  // Request & toggle Web Push Notifications
  const handleTogglePush = async () => {
    if (pushStatus === 'granted') {
      await disableDailyPushReminder();
      setPushStatus('disabled');
    } else {
      const res = await requestNotificationPermission();
      if (res.permission === 'granted') {
        setPushStatus('granted');
        await registerDailyPushReminder(pushTime);
      } else {
        setPushStatus(res.permission);
      }
    }
  };

  return (
    <main className="reader" style={{ background: 'var(--parchment)', color: 'var(--ink)' }}>
      <div className="reader-inner" style={{ maxWidth: '740px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div className="eyebrow" style={{ color: 'var(--gold)', marginBottom: '6px' }}>
            Phase 8 • Accessibility & Habit Persistence
          </div>
          <h2 style={{ fontSize: '28px', color: 'var(--ink)', fontWeight: 600 }}>
            Accessibility & Habit Settings
          </h2>
          <p style={{ fontSize: '14.5px', color: 'var(--ink-soft)', marginTop: '4px' }}>
            Customize font sizing, dyslexic typography, TTS speed, and daily scripture notifications.
          </p>
        </div>

        {/* 1. Theme & Appearance Control */}
        <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--line-strong)', borderRadius: '14px', padding: '22px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--ink)', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🎨 Appearance & Theme Mode
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ display: 'block', color: 'var(--ink)', fontSize: '15px' }}>App Theme Mode</strong>
              <span style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>Switch between Light Parchment and Dark Forest themes (WCAG AA Compliant).</span>
            </div>

            <button
              className={`theme-switch ${theme === 'dark' ? 'active' : ''}`}
              onClick={() => setTheme && setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle Theme"
            >
              <span className="theme-switch-track">
                <span className="theme-switch-icon sun"><i className="ti ti-sun"></i></span>
                <span className="theme-switch-icon moon"><i className="ti ti-moon"></i></span>
                <span className="theme-switch-thumb"></span>
              </span>
            </button>
          </div>
        </div>

        {/* 2. Reader Typography & Font Sizing */}
        <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--line-strong)', borderRadius: '14px', padding: '22px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--ink)', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📖 Reader Typography & Sizing
          </h3>

          <div style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '14px', color: 'var(--ink)' }}>
              <strong>Adjustable Scripture Font Size:</strong>
              <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{fontSize}</span>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              {['14px', '16px', '18px', '22px', '26px'].map(size => (
                <button
                  key={size}
                  onClick={() => handleFontSizeChange(size)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: '1px solid var(--line-strong)',
                    background: fontSize === size ? 'var(--moss)' : 'var(--parchment-deep)',
                    color: fontSize === size ? '#fff' : 'var(--ink)',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--line)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ display: 'block', color: 'var(--ink)', fontSize: '15px' }}>Dyslexia-Friendly Font</strong>
              <span style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>Applies OpenDyslexic specialized letter spacing and high legibility.</span>
            </div>

            <button
              onClick={handleDyslexicToggle}
              style={{
                padding: '8px 18px',
                borderRadius: '999px',
                border: 'none',
                background: dyslexicFont ? 'var(--moss)' : 'var(--line-strong)',
                color: dyslexicFont ? '#fff' : 'var(--ink)',
                fontWeight: 600,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {dyslexicFont ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>

        {/* 3. Text-to-Speech (TTS) Speed Controls */}
        <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--line-strong)', borderRadius: '14px', padding: '22px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--ink)', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔊 Universal Text-to-Speech (TTS)
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ display: 'block', color: 'var(--ink)', fontSize: '15px' }}>Default Narration Speed</strong>
              <span style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>Applies to verses, study notes, AI answers &amp; diagram details.</span>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              {[0.75, 1.0, 1.25, 1.5].map(rate => (
                <button
                  key={rate}
                  onClick={() => handleTtsRateChange(rate)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--line-strong)',
                    background: ttsRate === rate ? 'var(--moss)' : 'var(--parchment-deep)',
                    color: ttsRate === rate ? '#fff' : 'var(--ink)',
                    fontWeight: 600,
                    fontSize: '12.5px',
                    cursor: 'pointer'
                  }}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. Habit Tracking & Timezone-Aware Streaks */}
        <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--line-strong)', borderRadius: '14px', padding: '22px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--ink)', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔥 Timezone-Aware Habit Streaks
          </h3>

          <div style={{ background: 'var(--parchment-deep)', padding: '18px', borderRadius: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <strong style={{ fontSize: '22px', color: 'var(--gold)' }}>🔥 {streakInfo.currentStreak} Days Streak</strong>
                <span style={{ fontSize: '12.5px', color: 'var(--ink-soft)', display: 'block', marginTop: '2px' }}>
                  Longest record: <b>{streakInfo.longestStreak} days</b> · Timezone: <b>{streakInfo.userTimezone}</b>
                </span>
              </div>
              <span style={{ fontSize: '12px', background: streakInfo.isTodayActive ? 'var(--moss)' : 'rgba(239, 68, 68, 0.15)', color: streakInfo.isTodayActive ? '#fff' : '#ef4444', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>
                {streakInfo.isTodayActive ? '✓ Read Today' : '⏳ Pending Today'}
              </span>
            </div>

            {/* Weekly Activity Heatmap */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
              {heatmap.map((d, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center', padding: '8px 4px', background: d.isCompleted ? 'var(--moss)' : 'var(--bg-card)', borderRadius: '8px', border: d.isToday ? '2px solid var(--gold)' : '1px solid var(--line-strong)', color: d.isCompleted ? '#fff' : 'var(--ink)' }}>
                  <div style={{ fontSize: '11px', fontWeight: 700 }}>{d.label}</div>
                  <div style={{ fontSize: '14px', marginTop: '4px' }}>{d.isCompleted ? '🔥' : '⚪'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 5. Web Push Notification Delivery */}
        <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--line-strong)', borderRadius: '14px', padding: '22px' }}>
          <h3 style={{ fontSize: '18px', color: 'var(--ink)', fontWeight: 600, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔔 Daily Verse Push Notifications
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <strong style={{ display: 'block', color: 'var(--ink)', fontSize: '15px' }}>Daily Verse Reminder</strong>
              <span style={{ fontSize: '13px', color: 'var(--ink-soft)' }}>
                Receive a daily morning verse push notification on your device.
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="time"
                value={pushTime}
                onChange={(e) => {
                  setPushTime(e.target.value);
                  if (pushStatus === 'granted') registerDailyPushReminder(e.target.value);
                }}
                style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--line-strong)', background: 'var(--parchment-deep)', color: 'var(--ink)', fontSize: '13px', outline: 'none' }}
              />

              <button
                onClick={handleTogglePush}
                style={{
                  padding: '8px 18px',
                  borderRadius: '999px',
                  border: 'none',
                  background: pushStatus === 'granted' ? 'var(--moss)' : 'var(--line-strong)',
                  color: pushStatus === 'granted' ? '#fff' : 'var(--ink)',
                  fontWeight: 600,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {pushStatus === 'granted' ? '🔔 Reminders On' : 'Enable Push'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
