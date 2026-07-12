/**
 * Credit costs per output size class (matches build plan).
 */
export const CREDIT_COSTS = {
  phone: 1,
  square: 1,
  laptop: 2,
  custom: 2,
  premium: 3,
} as const;

/**
 * Size presets available for generation.
 */
export const SIZE_PRESETS = [
  {
    slug: "phone",
    label: "Phone Wallpaper",
    width: 1170,
    height: 2532,
    aspectRatio: "9:19.5",
    description: "Fits most modern phone screens",
  },
  {
    slug: "square",
    label: "Square",
    width: 2048,
    height: 2048,
    aspectRatio: "1:1",
    description: "Perfect for social media and profile pictures",
  },
  {
    slug: "laptop",
    label: "Laptop Wallpaper",
    width: 2880,
    height: 1800,
    aspectRatio: "16:10",
    description: "Fits most laptop screens",
  },
  {
    slug: "custom",
    label: "Custom Size",
    width: 0,
    height: 0,
    aspectRatio: "custom",
    description: "Set your own dimensions up to 2K",
  },
] as const;

/**
 * Maximum allowed upload size in bytes (20MB).
 */
export const MAX_UPLOAD_SIZE = 20 * 1024 * 1024;

/**
 * Maximum image dimensions for upload.
 */
export const MAX_IMAGE_WIDTH = 4096;
export const MAX_IMAGE_HEIGHT = 4096;
export const MAX_MEGAPIXELS = 16; // 16MP max

/**
 * Allowed image MIME types for upload.
 */
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

/**
 * Rate limit: max generations per user per hour.
 */
export const MAX_GENERATIONS_PER_HOUR = 20;
