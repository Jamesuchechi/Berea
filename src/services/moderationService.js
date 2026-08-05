import { supabase } from '../lib/supabase';

/**
 * Moderation Service for Rate Limiting, Flagging Queue, and User Blocking
 * Updated in Phase 9 with 1000ms DB timeout race for offline/instant fallback.
 */

const DB_TIMEOUT_MS = 1000;
const RATE_LIMIT_MAX_PER_HOUR = 3;

function withTimeout(promise, ms = DB_TIMEOUT_MS) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), ms)),
  ]);
}

/**
 * Check if the user is currently allowed to create a new post
 */
export async function checkPostingRateLimit() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return checkLocalRateLimit();
    }

    const { data, error } = await withTimeout(
      supabase.rpc('check_user_posting_rate_limit', {
        p_user_id: session.user.id,
        p_limit: RATE_LIMIT_MAX_PER_HOUR,
      })
    );

    if (error || data === false) {
      const localCheck = checkLocalRateLimit();
      if (!localCheck.allowed) return localCheck;
      return { allowed: false, reason: 'Posting limit reached (max 3 posts per hour). Please wait before posting again.' };
    }

    return { allowed: true };
  } catch (err) {
    return checkLocalRateLimit();
  }
}

/**
 * Record a post creation timestamp locally for rate limit enforcement
 */
export function recordPostTimestamp() {
  const timestamps = JSON.parse(localStorage.getItem('berea_post_timestamps') || '[]');
  const now = Date.now();
  // Keep only timestamps within the last hour (3600,000 ms)
  const recent = timestamps.filter(ts => now - ts < 3600000);
  recent.push(now);
  localStorage.setItem('berea_post_timestamps', JSON.stringify(recent));
}

function checkLocalRateLimit() {
  const timestamps = JSON.parse(localStorage.getItem('berea_post_timestamps') || '[]');
  const now = Date.now();
  const recent = timestamps.filter(ts => now - ts < 3600000);

  if (recent.length >= RATE_LIMIT_MAX_PER_HOUR) {
    const oldest = recent[0];
    const cooldownSeconds = Math.ceil((3600000 - (now - oldest)) / 1000);
    return {
      allowed: false,
      reason: `Rate limit reached. Please wait ${Math.max(1, Math.ceil(cooldownSeconds / 60))} minute(s) before posting again.`,
      cooldownSeconds,
    };
  }

  return { allowed: true };
}

/**
 * Block a disruptive user
 */
export async function blockUser(blockedId, reason = 'User blocked') {
  saveLocalBlock(blockedId);

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await withTimeout(
        supabase.from('user_block').upsert(
          {
            blocker_id: session.user.id,
            blocked_id: blockedId,
            reason,
            created_at: new Date().toISOString(),
          },
          { onConflict: 'blocker_id,blocked_id' }
        )
      );
    }
  } catch {}

  return { success: true };
}

/**
 * Unblock a user
 */
export async function unblockUser(blockedId) {
  removeLocalBlock(blockedId);

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await withTimeout(
        supabase
          .from('user_block')
          .delete()
          .eq('blocker_id', session.user.id)
          .eq('blocked_id', blockedId)
      );
    }
  } catch {}

  return { success: true };
}

/**
 * Fetch blocked user IDs for filtering feeds
 */
export async function getBlockedUserIds() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return getLocalBlockedIds();

    const { data, error } = await withTimeout(
      supabase
        .from('user_block')
        .select('blocked_id')
        .eq('blocker_id', session.user.id)
    );

    if (error || !data) return getLocalBlockedIds();
    return data.map(b => b.blocked_id);
  } catch {
    return getLocalBlockedIds();
  }
}

/**
 * Fetch pending moderation flags for Admin Review Queue
 */
export async function fetchPendingFlags() {
  try {
    const { data, error } = await withTimeout(
      supabase
        .from('community_flag')
        .select('*')
        .order('created_at', { ascending: false })
    );

    if (error || !data || data.length === 0) {
      return getLocalFlags();
    }

    return data;
  } catch {
    return getLocalFlags();
  }
}

/**
 * Admin action on a flag item ('dismiss' | 'actioned' | 'archive_content')
 */
export async function actionFlagItem(flagId, actionType, contentId = null) {
  try {
    await withTimeout(
      supabase
        .from('community_flag')
        .update({ status: actionType === 'dismiss' ? 'dismissed' : 'actioned' })
        .eq('id', flagId)
    );

    if (actionType === 'archive_content' && contentId) {
      await withTimeout(
        supabase
          .from('prayer_request')
          .update({ status: 'archived', is_hidden: true })
          .eq('id', contentId)
      );
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getLocalBlockedIds() {
  return JSON.parse(localStorage.getItem('berea_blocked_users') || '[]');
}

function saveLocalBlock(id) {
  const list = getLocalBlockedIds();
  if (!list.includes(id)) {
    list.push(id);
    localStorage.setItem('berea_blocked_users', JSON.stringify(list));
  }
}

function removeLocalBlock(id) {
  const list = getLocalBlockedIds().filter(item => item !== id);
  localStorage.setItem('berea_blocked_users', JSON.stringify(list));
}

function getLocalFlags() {
  return [
    {
      id: 'flag_demo_1',
      reporter_id: 'user_101',
      content_type: 'prayer_request',
      content_id: 'prayer_3',
      reason: 'Spam promotional link',
      status: 'pending',
      created_at: new Date(Date.now() - 3600000).toISOString(),
    },
  ];
}
