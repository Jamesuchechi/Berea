import { supabase } from '../lib/supabase';

/**
 * Service for reading plans and user progress persistence.
 */

const DEFAULT_PLANS = [
  {
    id: 'plan_gospels_30',
    slug: 'gospels_30',
    title: 'The Four Gospels in 30 Days',
    description: 'Walk through Matthew, Mark, Luke, and John with thematic cross-references across canonical and early church perspectives.',
    durationDays: 30,
    kind: 'fixed',
    isPublic: true,
  },
  {
    id: 'plan_deuterocanon_14',
    slug: 'deuterocanon_14',
    title: 'Deuterocanon Foundations',
    description: 'Explore Wisdom of Solomon, Sirach, Tobit, and Judith with historical context notes.',
    durationDays: 14,
    kind: 'fixed',
    isPublic: true,
  },
  {
    id: 'plan_psalms_90',
    slug: 'psalms_90',
    title: 'Psalms & Wisdom Literature',
    description: 'A 90-day journey through Psalms, Proverbs, and Ecclesiastes.',
    durationDays: 90,
    kind: 'fixed',
    isPublic: true,
  },
];

export async function fetchReadingPlans() {
  try {
    const { data, error } = await supabase
      .from('reading_plan')
      .select('*')
      .eq('is_public', true)
      .order('duration_days', { ascending: true });

    if (error || !data || data.length === 0) {
      return DEFAULT_PLANS;
    }

    return data.map(p => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      description: p.description,
      durationDays: p.duration_days,
      kind: p.kind,
      isPublic: p.is_public,
    }));
  } catch {
    return DEFAULT_PLANS;
  }
}

export async function getUserPlanProgress(planId) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return getLocalPlanProgress(planId);

    const { data, error } = await supabase
      .from('user_plan_progress')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('plan_id', planId)
      .single();

    if (error || !data) return getLocalPlanProgress(planId);

    return {
      id: data.id,
      planId: data.plan_id,
      currentDay: data.current_day,
      completedDays: data.completed_days || [],
      startedAt: data.started_at,
      lastCompletedAt: data.last_completed_at,
      streakCount: data.streak_count,
    };
  } catch {
    return getLocalPlanProgress(planId);
  }
}

export async function completePlanDay(planId, dayNumber) {
  const localProgress = getLocalPlanProgress(planId);
  const updatedCompleted = Array.from(new Set([...localProgress.completedDays, dayNumber]));
  const updatedCurrent = Math.max(localProgress.currentDay, dayNumber + 1);

  const updatedLocal = {
    ...localProgress,
    currentDay: updatedCurrent,
    completedDays: updatedCompleted,
    lastCompletedAt: new Date().toISOString(),
    streakCount: localProgress.streakCount + 1,
  };

  saveLocalPlanProgress(planId, updatedLocal);

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { success: true, progress: updatedLocal, localOnly: true };

    const payload = {
      user_id: session.user.id,
      plan_id: planId,
      current_day: updatedCurrent,
      completed_days: updatedCompleted,
      last_completed_at: new Date().toISOString(),
      streak_count: updatedLocal.streakCount,
    };

    const { data, error } = await supabase
      .from('user_plan_progress')
      .upsert(payload, { onConflict: 'user_id,plan_id' })
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    return {
      success: true,
      progress: {
        id: data.id,
        planId: data.plan_id,
        currentDay: data.current_day,
        completedDays: data.completed_days,
        startedAt: data.started_at,
        lastCompletedAt: data.last_completed_at,
        streakCount: data.streak_count,
      },
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ── Local Storage Helpers ─────────────────────────────────────────────────────

function getLocalPlanProgress(planId) {
  try {
    const raw = localStorage.getItem(`berea_plan_prog_${planId}`);
    if (raw) return JSON.parse(raw);
  } catch {}

  return {
    planId,
    currentDay: 1,
    completedDays: [],
    startedAt: new Date().toISOString(),
    lastCompletedAt: null,
    streakCount: 0,
  };
}

function saveLocalPlanProgress(planId, progress) {
  try {
    localStorage.setItem(`berea_plan_prog_${planId}`, JSON.stringify(progress));
  } catch {}
}
