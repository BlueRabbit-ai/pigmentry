export const RATE_LIMIT_GENERATIONS = {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
} as const;

export const RATE_LIMIT_UPLOADS = {
  windowMs: 60 * 1000, // 1 minute
  max: 10,
} as const;

export const RATE_LIMIT_AUTH = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
} as const;
