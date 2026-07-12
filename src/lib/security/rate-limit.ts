/**
 * Simple in-memory rate limiter.
 *
 * For production, replace with Redis-based rate limiting (e.g., Upstash).
 * This implementation is suitable for single-instance deployments and
 * provides a consistent API that can be swapped out later.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  windowMs: number;
  max: number;
  keyPrefix: string;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
const CLEANUP_INTERVAL = 60_000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}

/**
 * Check if a request should be rate limited.
 *
 * @returns { allowed: boolean; remaining: number; resetAt: number }
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetAt: number } {
  cleanup();

  const now = Date.now();
  const key = `${config.keyPrefix}:${identifier}`;
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    // First request or window expired — create new entry
    const newEntry: RateLimitEntry = {
      count: 1,
      resetAt: now + config.windowMs,
    };
    store.set(key, newEntry);
    return {
      allowed: true,
      remaining: config.max - 1,
      resetAt: newEntry.resetAt,
    };
  }

  entry.count++;

  if (entry.count > config.max) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    };
  }

  return {
    allowed: true,
    remaining: config.max - entry.count,
    resetAt: entry.resetAt,
  };
}

/**
 * Rate limit configurations for different endpoints.
 */
export const RATE_LIMITS = {
  upload: {
    windowMs: 60_000, // 1 minute
    max: 10,
    keyPrefix: "rate:upload",
  },
  generation: {
    windowMs: 3_600_000, // 1 hour
    max: 20,
    keyPrefix: "rate:generation",
  },
  auth: {
    windowMs: 900_000, // 15 minutes
    max: 20,
    keyPrefix: "rate:auth",
  },
  api: {
    windowMs: 60_000, // 1 minute
    max: 60,
    keyPrefix: "rate:api",
  },
} satisfies Record<string, RateLimitConfig>;

/**
 * Apply rate limiting and return headers for the response.
 */
export function applyRateLimit(
  identifier: string,
  limitConfig: RateLimitConfig
): { allowed: boolean; headers: Record<string, string> } {
  const result = checkRateLimit(identifier, limitConfig);

  return {
    allowed: result.allowed,
    headers: {
      "X-RateLimit-Limit": String(limitConfig.max),
      "X-RateLimit-Remaining": String(result.remaining),
      "X-RateLimit-Reset": String(Math.ceil(result.resetAt / 1000)),
    },
  };
}
