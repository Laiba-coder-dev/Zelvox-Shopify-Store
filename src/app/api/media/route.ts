import { promises as fs } from "node:fs";
import path from "node:path";
import { MIME_EXT, resolveUpload } from "@/lib/uploads";

type Params = { path: string[] };

const OCTET = "application/octet-stream";

function typeForExtension(ext: string): string {
  const entry = Object.entries(MIME_EXT).find(([, extension]) => extension === ext);
  return entry?.[0] ?? OCTET;
}

/**
 * Public media endpoint for uploaded product photography.
 * Inquiry attachments are NOT served here — they require an admin session.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<Params> }
) {
  const { path: parts } = await params;
  if (!parts || parts.length !== 2 || parts[0] !== "products") {
    return new Response("Not found", { status: 404 });
  }

  const storedName = decodeURIComponent(parts[1]);
  const filePath = resolveUpload("products", storedName);
  if (!filePath) return new Response("Not found", { status: 404 });

  try {
    const data = await fs.readFile(filePath);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": typeForExtension(path.extname(filePath).toLowerCase()),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
