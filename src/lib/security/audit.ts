/**
 * Audit logging utility.
 *
 * Wraps Convex audit mutations with consistent formatting.
 * All security-relevant events (auth, uploads, generations, billing)
 * should be logged through this module.
 */

export interface AuditEvent {
  eventType: string;
  severity: "info" | "warning" | "error";
  userId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Standardized audit event types for common operations.
 */
export const AUDIT_EVENTS = {
  // Auth
  USER_SIGNED_UP: "auth.user_signed_up",
  USER_SIGNED_IN: "auth.user_signed_in",
  USER_SIGNED_OUT: "auth.user_signed_out",
  AUTH_FAILED: "auth.failed",

  // Uploads
  UPLOAD_ATTEMPTED: "upload.attempted",
  UPLOAD_REJECTED: "upload.rejected",
  UPLOAD_ACCEPTED: "upload.accepted",

  // Generations
  GENERATION_REQUESTED: "generation.requested",
  GENERATION_STARTED: "generation.started",
  GENERATION_COMPLETED: "generation.completed",
  GENERATION_FAILED: "generation.failed",

  // Credits
  CREDITS_GRANTED: "credits.granted",
  CREDITS_DEDUCTED: "credits.deducted",
  CREDITS_INSUFFICIENT: "credits.insufficient",
  CREDITS_REFUNDED: "credits.refunded",

  // Billing
  PURCHASE_INITIATED: "billing.purchase_initiated",
  PURCHASE_COMPLETED: "billing.purchase_completed",
  PURCHASE_FAILED: "billing.purchase_failed",
  SUBSCRIPTION_CHANGED: "billing.subscription_changed",

  // Security
  RATE_LIMIT_HIT: "security.rate_limit_hit",
  SUSPICIOUS_UPLOAD: "security.suspicious_upload",
  INVALID_ACCESS: "security.invalid_access",
  CSRF_FAILURE: "security.csrf_failure",
} as const;

/**
 * Build a structured audit event.
 */
export function buildAuditEvent(
  eventType: string,
  severity: AuditEvent["severity"],
  overrides: Partial<Omit<AuditEvent, "eventType" | "severity">> = {}
): AuditEvent {
  return {
    eventType,
    severity,
    ...overrides,
  };
}

/**
 * Format audit details as a structured JSON string for storage.
 */
export function formatAuditDetails(data: Record<string, unknown>): string {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    ...data,
  });
}
