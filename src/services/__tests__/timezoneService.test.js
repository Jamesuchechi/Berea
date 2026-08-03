import { describe, it, expect } from 'vitest';
import { getUserTimezone, getUserLocalDate, getLocalDayDifference } from '../timezoneService';

describe('timezoneService', () => {
  it('should detect system or fallback timezone string', () => {
    const tz = getUserTimezone();
    expect(typeof tz).toBe('string');
    expect(tz.length).toBeGreaterThan(0);
  });

  it('should format dates to YYYY-MM-DD format', () => {
    const testDate = new Date('2026-08-03T12:00:00Z');
    const localDateStr = getUserLocalDate(testDate, 'UTC');
    expect(localDateStr).toBe('2026-08-03');
  });

  it('should calculate local day difference correctly', () => {
    const diff1 = getLocalDayDifference('2026-08-01', '2026-08-02');
    expect(diff1).toBe(1);

    const diffSame = getLocalDayDifference('2026-08-03', '2026-08-03');
    expect(diffSame).toBe(0);

    const diffSkip = getLocalDayDifference('2026-08-01', '2026-08-04');
    expect(diffSkip).toBe(3);
  });
});
