import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import { randomBytes } from "node:crypto";

/**
 * Secure on-disk uploads.
 *
 * - `products/`  → public product imagery, served by /api/media/products/*
 * - `inquiries/` → buyer documents (spec sheets, drawings), served only
 *                  through the authenticated admin attachment route.
 */

export const UPLOADS_ROOT = path.join(process.cwd(), "data", "uploads");
export const UPLOAD_CATEGORIES = ["products", "inquiries"] as const;
export type UploadCategory = (typeof UPLOAD_CATEGORIES)[number];

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/avif": ".avif",
  "application/pdf": ".pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "application/vnd.ms-excel": ".xls",
  "text/plain": ".txt",
  "text/csv": ".csv",
};

export type SaveResult = {
  storedName: string;
  relativePath: string;
  size: number;
  mimeType: string;
  originalName: string;
};

export async function saveUpload(
  file: File,
  category: UploadCategory,
  opts: { allowedTypes: readonly string[]; maxBytes: number }
): Promise<SaveResult> {
  if (!file || typeof file === "string" || file.size === 0) {
    throw new Error("Empty file.");
  }
  if (!opts.allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type || "unknown"} is not allowed.`);
  }
  if (file.size > opts.maxBytes) {
    throw new Error(`File exceeds the ${Math.round(opts.maxBytes / 1024 / 1024)} MB limit.`);
  }
  const ext = EXT_BY_TYPE[file.type] ?? "";
  const storedName = `${Date.now()}-${randomBytes(8).toString("hex")}${ext}`;
  const dir = path.join(UPLOADS_ROOT, category);
  await fs.mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, storedName), buffer);
  return {
    storedName,
    relativePath: path.join(category, storedName),
    size: file.size,
    mimeType: file.type,
    originalName: sanitizeFilename(file.name || storedName),
  };
}

/** Absolute path for a stored upload, or null when the name is unsafe. */
export function resolveUpload(category: UploadCategory, storedName: string): string | null {
  if (!UPLOAD_CATEGORIES.includes(category)) return null;
  if (!/^[\w.-]+$/.test(storedName) || storedName.includes("..")) return null;
  const base = path.join(UPLOADS_ROOT, category);
  const full = path.join(base, storedName);
  if (!full.startsWith(base + path.sep)) return null;
  return full;
}

export async function deleteUpload(category: UploadCategory, storedName: string): Promise<void> {
  const full = resolveUpload(category, storedName);
  if (!full) return;
  await fs.unlink(full).catch(() => undefined);
}

export function mediaUrl(category: UploadCategory, storedName: string): string {
  return `/api/media/${category}/${encodeURIComponent(storedName)}`;
}

export function sanitizeFilename(name: string): string {
  return name
    .replace(/[\\/:*?"<>|]+/g, "-")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
}

export const MIME_EXT: Record<string, string> = EXT_BY_TYPE;
