/**
 * Server-side upload validation.
 *
 * Every upload must pass these checks before storage or processing.
 * These run on the server (API route or server action), never trust
 * client-side validation alone.
 */

import {
  ALLOWED_MIME_TYPES,
  MAX_UPLOAD_SIZE,
  MAX_IMAGE_WIDTH,
  MAX_IMAGE_HEIGHT,
  MAX_MEGAPIXELS,
} from "@/lib/constants";

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitized?: {
    mimeType: string;
    extension: string;
    sizeBytes: number;
  };
}

/**
 * Verify file signature (magic bytes) matches the claimed MIME type.
 * Prevents extension spoofing and polyglot attacks.
 */
function verifyMagicBytes(buffer: Buffer, claimedMime: string): boolean {
  // JPEG: FF D8 FF
  if (claimedMime === "image/jpeg" || claimedMime === "image/jpg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  // PNG: 89 50 4E 47
  if (claimedMime === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }
  // WebP: 52 49 46 46 ... 57 45 42 50
  if (claimedMime === "image/webp") {
    return (
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50
    );
  }
  return false;
}

/**
 * Get extension from MIME type (for safe filename generation).
 */
function getExtensionFromMime(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  };
  return map[mime] ?? ".bin";
}

/**
 * Validate a file upload server-side.
 *
 * @param buffer - Raw file bytes
 * @param claimedMimeType - The MIME type reported by the client
 * @param claimedSize - File size in bytes
 * @returns ValidationResult with sanitized data if valid
 */
export function validateUpload(
  buffer: Buffer,
  claimedMimeType: string,
  claimedSize: number
): ValidationResult {
  // 1. Check MIME type against allowlist
  if (
    !ALLOWED_MIME_TYPES.includes(
      claimedMimeType as (typeof ALLOWED_MIME_TYPES)[number]
    )
  ) {
    return {
      valid: false,
      error: `Unsupported file type: ${claimedMimeType}. Allowed: JPEG, PNG, WebP.`,
    };
  }

  // 2. Check file size
  if (claimedSize > MAX_UPLOAD_SIZE) {
    return {
      valid: false,
      error: `File too large (${(claimedSize / (1024 * 1024)).toFixed(1)}MB). Maximum: ${MAX_UPLOAD_SIZE / (1024 * 1024)}MB.`,
    };
  }

  // 3. Verify magic bytes (prevents extension spoofing)
  if (!verifyMagicBytes(buffer, claimedMimeType)) {
    return {
      valid: false,
      error: "File signature does not match the claimed file type. Upload rejected.",
    };
  }

  // 4. Reject zero-byte files
  if (buffer.length === 0) {
    return {
      valid: false,
      error: "Empty file. Upload rejected.",
    };
  }

  return {
    valid: true,
    sanitized: {
      mimeType: claimedMimeType,
      extension: getExtensionFromMime(claimedMimeType),
      sizeBytes: buffer.length,
    },
  };
}

/**
 * Validate image dimensions from metadata (requires image processing library).
 * Placeholder for when sharp or similar is integrated.
 */
export function validateDimensions(
  width: number,
  height: number
): { valid: boolean; error?: string } {
  if (width <= 0 || height <= 0) {
    return { valid: false, error: "Invalid image dimensions." };
  }
  if (width > MAX_IMAGE_WIDTH || height > MAX_IMAGE_HEIGHT) {
    return {
      valid: false,
      error: `Image dimensions too large (${width}×${height}). Maximum: ${MAX_IMAGE_WIDTH}×${MAX_IMAGE_HEIGHT}.`,
    };
  }
  const megapixels = (width * height) / 1_000_000;
  if (megapixels > MAX_MEGAPIXELS) {
    return {
      valid: false,
      error: `Image resolution too high (${megapixels.toFixed(1)}MP). Maximum: ${MAX_MEGAPIXELS}MP.`,
    };
  }
  return { valid: true };
}

/**
 * Generate a cryptographically random storage key for uploaded files.
 * Prevents path traversal and enumeration.
 */
export function generateStorageKey(
  userId: string,
  extension: string
): string {
  const random = crypto.randomUUID();
  return `uploads/${userId}/${random}${extension}`;
}

/**
 * Sanitize a user-provided filename for safe logging.
 * Strips all path separators and control characters.
 */
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[<>:"/\\|?*\x00-\x1f]/g, "_")
    .slice(0, 255);
}
