import React, { useState, useEffect } from 'react';
import { audioEngine } from '../audio/AudioEngine';
import { requestNotificationPermission, registerDailyPushReminder, getNotificationPermissionStatus, disableDailyPushReminder } from '../../services/pushNotificationService';
import { fetchUserStreakSummary } from '../../services/streakService';

export default function DailyVerseCard() {
  const [copied, setCopied] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [streakCount, setStreakCount] = useState(7);

  const dailyVerse = {
    reference: 'Wisdom of Solomon 7:26',
    text: 'For she is a reflection of eternal light, a spotless mirror of the working of God, and an image of his goodness.',
    translation: 'NRSV Catholic Edition',
  };

  useEffect(() => {
    let isMounted = true;
    async function load() {
      const summary = await fetchUserStreakSummary();
      if (isMounted && summary.currentStreak) {
        setStreakCount(summary.currentStreak);
      }
      const perm = getNotificationPermissionStatus();
      if (isMounted && perm === 'granted') {
        setNotificationsEnabled(true);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(`"${dailyVerse.text}" — ${dailyVerse.reference} (${dailyVerse.translation})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAudio = () => {
    if (isPlaying) {
      audioEngine.stop();
      setIsPlaying(false);
    } else {
      audioEngine.speak(`${dailyVerse.reference}. ${dailyVerse.text}`);
      setIsPlaying(true);
    }
  };

  const handleToggleReminder = async () => {
    if (notificationsEnabled) {
      await disableDailyPushReminder();
      setNotificationsEnabled(false);
    } else {
      const res = await requestNotificationPermission();
      if (res.permission === 'granted') {
        await registerDailyPushReminder('07:00');
        setNotificationsEnabled(true);
      } else {
        alert(res.reason || 'Notification permission was denied by browser settings.');
      }
    }
  };

  return (
    <div className="card" style={{ background: 'var(--parchment-deep)', border: '1.5px solid var(--gold)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold)', fontWeight: 700 }}>
            VERSE OF THE DAY
          </span>
          <span style={{ fontSize: '11px', background: 'var(--moss)', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
            {dailyVerse.translation}
          </span>
        </div>

        <span style={{ fontSize: '12.5px', color: 'var(--gold)', fontWeight: 600 }}>
          🔥 {streakCount}-Day Habit Streak
        </span>
      </div>

      <p style={{ fontFamily: 'var(--font-display)', fontSize: '19px', lineHeight: 1.7, color: 'var(--ink)', marginBottom: '16px', fontStyle: 'italic' }}>
        "{dailyVerse.text}"
      </p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <strong style={{ fontSize: '15px', color: 'var(--ink)' }}>
          — {dailyVerse.reference}
        </strong>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleAudio}
            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--line-strong)', background: 'var(--bg-card)', color: 'var(--ink)', fontSize: '12.5px', cursor: 'pointer', fontWeight: 600 }}
          >
            <i className={isPlaying ? "ti ti-player-pause" : "ti ti-player-play"}></i> {isPlaying ? "Stop" : "Listen"}
          </button>

          <button
            onClick={handleCopy}
            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--line-strong)', background: 'var(--bg-card)', color: 'var(--ink)', fontSize: '12.5px', cursor: 'pointer', fontWeight: 600 }}
          >
            {copied ? "✓ Copied!" : "📋 Copy Verse"}
          </button>

          <button
            onClick={handleToggleReminder}
            style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--line-strong)', background: notificationsEnabled ? 'var(--moss)' : 'var(--bg-card)', color: notificationsEnabled ? '#fff' : 'var(--ink)', fontSize: '12.5px', cursor: 'pointer', fontWeight: 600 }}
          >
            🔔 {notificationsEnabled ? "Daily Reminders On (7:00 AM)" : "Set Daily Push Reminder"}
          </button>
        </div>
      </div>
    </div>
  );
}
