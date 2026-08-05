import { supabase } from '../lib/supabase';
import { askAIContextualAssistant } from '../lib/ai';

/**
 * Reading Plan Progress & AI Plan Generation Service
 */

export async function getUserPlanProgress(planId) {
  try {
    const { data: session } = await supabase.auth.getSession();
    const user = session?.session?.user;

    if (user) {
      const { data, error } = await supabase
        .from('user_plan_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('plan_id', planId)
        .single();

      if (!error && data) return data;
    }
  } catch {}

  // Fallback to localStorage
  const raw = localStorage.getItem(`berea_plan_progress_${planId}`);
  if (raw) {
    try { return JSON.parse(raw); } catch {}
  }

  return {
    plan_id: planId,
    current_day: 1,
    streak_count: 0,
    last_completed_at: null,
    completed_days: [],
  };
}

export async function saveUserPlanProgress(planId, currentDay, completedDays = []) {
  const payload = {
    plan_id: planId,
    current_day: currentDay,
    completed_days: completedDays,
    last_completed_at: new Date().toISOString(),
  };

  try {
    const { data: session } = await supabase.auth.getSession();
    const user = session?.session?.user;

    if (user) {
      await supabase.from('user_plan_progress').upsert({
        user_id: user.id,
        plan_id: planId,
        current_day: currentDay,
        last_completed_at: payload.last_completed_at,
      });
    }
  } catch {}

  localStorage.setItem(`berea_plan_progress_${planId}`, JSON.stringify(payload));
  return payload;
}

/**
 * Calculate Catch-Up Schedule for missed days
 */
export function calculateCatchUpSchedule(currentDay, totalDays, completedDays = []) {
  const missedCount = (currentDay - 1) - completedDays.length;
  const isBehind = missedCount > 0;

  const remainingDays = Math.max(1, totalDays - completedDays.length);
  const recommendedDailyReadings = isBehind
    ? Math.min(3, Math.ceil((totalDays - completedDays.length) / Math.max(1, totalDays - currentDay + 1)))
    : 1;

  return {
    isBehind,
    missedCount: Math.max(0, missedCount),
    recommendedDailyReadings,
    remainingDays,
    statusText: isBehind
      ? `⚠️ You are ${missedCount} day(s) behind schedule. Read ${recommendedDailyReadings} session(s) per day to catch up by day ${totalDays}!`
      : '🟢 You are on track with your reading schedule!',
  };
}

/**
 * Generate AI-Personalized Reading Plan calling the server-side AI edge function
 */
export async function generateAIPersonalizedPlan({ topic, durationDays = 7, tradition = 'protestant' }) {
  const prompt = `Generate a structured ${durationDays}-day Christian reading plan on "${topic}" for a user in the ${tradition} tradition. Return a JSON object with title, description, and an array of ${durationDays} days each containing day_number, title, and passage_ref (e.g. "John 3:1-21" or "Tobit 1:1-15").`;

  try {
    const aiResponse = await askAIContextualAssistant({
      userInput: prompt,
      tradition,
      trigger: 'chat',
    });

    if (aiResponse && aiResponse.message) {
      // Try parsing JSON block if present
      const jsonMatch = aiResponse.message.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          id: `ai_plan_${Date.now()}`,
          slug: `ai-plan-${Date.now()}`,
          title: parsed.title || `${topic} (${durationDays}-Day Plan)`,
          description: parsed.description || `AI-generated study plan on ${topic}.`,
          kind: 'ai_generated',
          duration_days: durationDays,
          days: parsed.days || [],
        };
      }
    }
  } catch {}

  // Local structured fallback plan
  return {
    id: `ai_plan_fallback_${Date.now()}`,
    slug: `ai-plan-${topic.toLowerCase().replace(/\s+/g, '-')}`,
    title: `AI Plan: ${topic}`,
    description: `Personalized ${durationDays}-day guide on ${topic} (${tradition} lens).`,
    kind: 'ai_generated',
    duration_days: durationDays,
    days: Array.from({ length: durationDays }, (_, i) => ({
      day_number: i + 1,
      title: `${topic} — Day ${i + 1}`,
      passage_ref: i % 2 === 0 ? `John ${i + 1}:1-16` : `Tobit ${Math.min(14, i + 1)}:1-12`,
    })),
  };
}
