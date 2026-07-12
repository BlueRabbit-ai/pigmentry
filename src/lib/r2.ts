import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const R2_ENDPOINT = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

let _client: S3Client | null = null;

function getClient(): S3Client {
  if (!_client) {
    _client = new S3Client({
      region: "auto",
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }
  return _client;
}

const BUCKET = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!;

/**
 * Generate a unique storage key for a gallery image.
 */
export function galleryKey(userId: string, style: string, ext = "png"): string {
  const ts = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  return `gallery/prod/${userId}/${style}-${ts}-${rand}.${ext}`;
}

/**
 * Generate a storage key for a watermarked preview thumbnail.
 */
export function galleryPreviewKey(originalKey: string): string {
  return originalKey.replace("gallery/prod/", "gallery/preview/").replace(/\.\w+$/, ".webp");
}

/**
 * Build the public URL for an R2 object.
 */
export function publicUrl(key: string): string {
  return `${PUBLIC_URL}/${key}`;
}

/**
 * Upload a buffer to R2.
 */
export async function uploadToR2(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<string> {
  const client = getClient();
  await client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
  return publicUrl(key);
}

/**
 * Delete an object from R2.
 */
export async function deleteFromR2(key: string): Promise<void> {
  const client = getClient();
  await client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
}

/**
 * Generate a pre-signed URL for temporary access (valid for `expiresIn` seconds).
 * Useful for tracking downloads without exposing the public URL.
 */
export async function signedDownloadUrl(
  key: string,
  expiresIn = 60
): Promise<string> {
  const client = getClient();
  return getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: BUCKET,
      Key: key,
      ResponseContentDisposition: "attachment",
    }),
    { expiresIn }
  );
}

/**
 * Convert a base64 data URL string into a Buffer.
 */
export function base64ToBuffer(dataUrl: string): { buffer: Buffer; mimeType: string } {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) throw new Error("Invalid data URL");
  const mimeType = match[1];
  const buffer = Buffer.from(match[2], "base64");
  return { buffer, mimeType };
}
