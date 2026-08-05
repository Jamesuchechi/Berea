/**
 * SuperMemo SM-2 Spaced Repetition Algorithm Implementation
 *
 * References:
 * https://en.wikipedia.org/wiki/SuperMemo#Description_of_SM-2_algorithm
 */

/**
 * Quality rating scale:
 * 0 - Complete blackout
 * 1 - Incorrect response; remembered upon seeing answer
 * 2 - Incorrect response; easy to remember upon seeing answer
 * 3 - Correct response recalled with serious difficulty
 * 4 - Correct response after a hesitation
 * 5 - Perfect recall
 */
export function calculateSM2NextReview({
  quality,
  repetitions = 0,
  intervalDays = 1,
  easeFactor = 2.5,
}) {
  const q = Math.max(0, Math.min(5, Number(quality) || 0));

  let newRepetitions = repetitions;
  let newIntervalDays = intervalDays;
  let newEaseFactor = easeFactor;

  if (q >= 3) {
    if (newRepetitions === 0) {
      newIntervalDays = 1;
    } else if (newRepetitions === 1) {
      newIntervalDays = 6;
    } else {
      newIntervalDays = Math.round(intervalDays * easeFactor);
    }
    newRepetitions += 1;
  } else {
    newRepetitions = 0;
    newIntervalDays = 1;
  }

  // Calculate new Ease Factor: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  newEaseFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (newEaseFactor < 1.3) {
    newEaseFactor = 1.3;
  }

  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + newIntervalDays);

  return {
    quality: q,
    repetitions: newRepetitions,
    intervalDays: newIntervalDays,
    easeFactor: Number(newEaseFactor.toFixed(3)),
    nextReviewAt: nextReviewDate.toISOString(),
  };
}

/**
 * Check if a memorization item is currently due for review
 */
export function isItemDueForReview(nextReviewAt) {
  if (!nextReviewAt) return true;
  return new Date(nextReviewAt).getTime() <= Date.now();
}
