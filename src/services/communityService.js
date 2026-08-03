import { supabase } from '../lib/supabase';
import { enqueueAction, registerSyncProcessor } from './offlineQueue';

/**
 * Service for community prayer wall, comments, prayed-for taps, and moderation flags.
 */

export async function fetchPrayers() {
  try {
    const { data, error } = await supabase
      .from('prayer_request')
      .select(`
        id,
        user_id,
        is_anonymous,
        category,
        title,
        content,
        status,
        created_at,
        prayer_prayed_for(count)
      `)
      .order('created_at', { ascending: false });

    if (error || !data) return getLocalPrayers();

    return data.map(p => ({
      id: p.id,
      userId: p.user_id,
      isAnonymous: p.is_anonymous,
      category: p.category,
      title: p.title,
      content: p.content,
      status: p.status,
      createdAt: p.created_at,
      prayedCount: p.prayer_prayed_for?.[0]?.count || 0,
    }));
  } catch {
    return getLocalPrayers();
  }
}

export async function createPrayer({ title, content, category = 'general', isAnonymous = false }) {
  const localPayload = {
    id: `prayer_${Date.now()}`,
    title,
    content,
    category,
    isAnonymous,
    status: 'active',
    createdAt: new Date().toISOString(),
    prayedCount: 0,
  };

  saveLocalPrayer(localPayload);

  if (!navigator.onLine) {
    await enqueueAction('CREATE_PRAYER', localPayload);
    return { success: true, item: localPayload, queued: true };
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();

    const { data, error } = await supabase
      .from('prayer_request')
      .insert({
        user_id: session?.user?.id || null,
        is_anonymous: isAnonymous,
        category,
        title,
        content,
      })
      .select()
      .single();

    if (error) {
      await enqueueAction('CREATE_PRAYER', localPayload);
      return { success: true, item: localPayload, queued: true };
    }

    const item = {
      id: data.id,
      userId: data.user_id,
      isAnonymous: data.is_anonymous,
      category: data.category,
      title: data.title,
      content: data.content,
      status: data.status,
      createdAt: data.created_at,
      prayedCount: 0,
    };

    saveLocalPrayer(item);
    return { success: true, item };
  } catch {
    await enqueueAction('CREATE_PRAYER', localPayload);
    return { success: true, item: localPayload, queued: true };
  }
}

export async function tapPrayedFor(requestId) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { success: true, localOnly: true };

    const { error } = await supabase
      .from('prayer_prayed_for')
      .insert({
        request_id: requestId,
        user_id: session.user.id,
      });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function submitCommunityFlag({ contentType, contentId, reason }) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { success: false, error: 'Auth required to submit flag' };

    const { error } = await supabase
      .from('community_flag')
      .insert({
        reporter_id: session.user.id,
        content_type: contentType,
        content_id: contentId,
        reason,
      });

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ── Offline Sync Processor ───────────────────────────────────────────────────

registerSyncProcessor(async (action) => {
  if (action.type === 'CREATE_PRAYER') {
    const result = await createPrayer(action.payload);
    return result.success;
  }
  return true;
});

// ── Local Storage Helpers ─────────────────────────────────────────────────────

function getLocalPrayers() {
  try {
    const raw = localStorage.getItem('berea_prayers');
    return raw ? JSON.parse(raw) : [
      {
        id: 'p_sample_1',
        title: 'Peace and Guidance in Scripture Study',
        content: 'Please pray for wisdom as our small group studies the Deuterocanonical texts together.',
        category: 'guidance',
        isAnonymous: false,
        status: 'active',
        createdAt: new Date().toISOString(),
        prayedCount: 12,
      },
    ];
  } catch {
    return [];
  }
}

function saveLocalPrayer(item) {
  const current = getLocalPrayers();
  const updated = [item, ...current.filter(p => p.id !== item.id)];
  localStorage.setItem('berea_prayers', JSON.stringify(updated));
}
