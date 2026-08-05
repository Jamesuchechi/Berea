import { describe, it, expect, beforeEach, vi } from 'vitest';
import { checkPostingRateLimit, recordPostTimestamp, blockUser, unblockUser, getBlockedUserIds, fetchPendingFlags, actionFlagItem } from '../moderationService';

describe('moderationService Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('Rate Limiting (Spam Prevention)', () => {
    it('should allow posting when post count is under 3 per hour', async () => {
      const check = await checkPostingRateLimit();
      expect(check.allowed).toBe(true);
    });

    it('should block post creation when rate limit threshold (3 posts/hr) is exceeded', async () => {
      recordPostTimestamp();
      recordPostTimestamp();
      recordPostTimestamp();

      const check = await checkPostingRateLimit();
      expect(check.allowed).toBe(false);
      expect(check.reason).toContain('Rate limit reached');
    });
  });

  describe('User Blocking & Muting', () => {
    it('should add target user ID to blocked list', async () => {
      await blockUser('user_spammer_123');
      const blocked = await getBlockedUserIds();
      expect(blocked).toContain('user_spammer_123');
    });

    it('should remove user from blocked list on unblock', async () => {
      await blockUser('user_spammer_123');
      await unblockUser('user_spammer_123');
      const blocked = await getBlockedUserIds();
      expect(blocked).not.toContain('user_spammer_123');
    });
  });

  describe('Admin Moderation Queue', () => {
    it('should fetch pending moderation flags', async () => {
      const flags = await fetchPendingFlags();
      expect(flags.length).toBeGreaterThan(0);
      expect(flags[0].reason).toBeDefined();
    });

    it('should action or dismiss a flag item', async () => {
      const result = await actionFlagItem('flag_demo_1', 'dismiss');
      expect(result.success).toBe(true);
    });
  });
});
