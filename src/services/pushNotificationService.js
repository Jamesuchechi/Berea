import { supabase } from '../lib/supabase';

/**
 * Web Push Notification Service for Daily Scripture Reminders
 */

export async function requestNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return { supported: false, permission: 'denied', reason: 'Web Push Notifications not supported in this browser.' };
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await registerDailyPushReminder('07:00');
    }
    return { supported: true, permission };
  } catch (err) {
    return { supported: true, permission: 'denied', error: err.message };
  }
}

export function getNotificationPermissionStatus() {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
}

export async function registerDailyPushReminder(reminderTime = '07:00') {
  if (typeof window === 'undefined' || !('Notification' in window)) return false;
  if (Notification.permission !== 'granted') return false;

  try {
    // Schedule a local test notification or Service Worker Push registration
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg.showNotification) {
        // Broadcast test reminder
        reg.showNotification('Berea Daily Scripture Reminder', {
          body: 'Daily verse reminder set for ' + reminderTime + '! "For she is a reflection of eternal light..."',
          icon: '/berea_logo.jpg',
          badge: '/icon-192.png',
          tag: 'berea-daily-reminder',
        });
      }
    }

    // Save to remote DB if signed in
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('push_subscriptions').upsert(
        {
          user_id: session.user.id,
          endpoint: 'browser_local_subscription_' + session.user.id,
          p256dh: 'keys_placeholder',
          auth: 'auth_placeholder',
          reminder_time: reminderTime + ':00',
          is_active: true,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'endpoint' }
      );
    }

    localStorage.setItem('berea_daily_reminder_time', reminderTime);
    localStorage.setItem('berea_daily_reminder_active', 'true');
    return true;
  } catch (err) {
    console.warn('[pushNotificationService] Push registration warning:', err);
    return false;
  }
}

export async function disableDailyPushReminder() {
  localStorage.setItem('berea_daily_reminder_active', 'false');

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase
        .from('push_subscriptions')
        .update({ is_active: false })
        .eq('user_id', session.user.id);
    }
  } catch {}
}
