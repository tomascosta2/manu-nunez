import { put, del } from "@vercel/blob";
import fs from "node:fs/promises";
import path from "node:path";

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

// Blob disponible por OIDC (BLOB_STORE_ID) o token estático legacy; el SDK resuelve la auth.
const blobEnabled = () => Boolean(process.env.BLOB_STORE_ID || process.env.BLOB_READ_WRITE_TOKEN);

export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const filename = `${crypto.randomUUID()}.${ext}`;

  if (blobEnabled()) {
    const blob = await put(`images/${filename}`, file, {
      access: "public",
      contentType: file.type,
    });
    return blob.url;
  }

  // Dev fallback: write to /public/uploads, served as static asset
  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const buf = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOADS_DIR, filename), buf);
  return `/uploads/${filename}`;
}

export async function deleteImage(url: string): Promise<void> {
  if (blobEnabled() && url.startsWith("https://")) {
    try {
      await del(url);
    } catch (e) {
      console.error("[blob] delete failed", e);
    }
    return;
  }
  if (url.startsWith("/uploads/")) {
    try {
      await fs.unlink(path.join(UPLOADS_DIR, path.basename(url)));
    } catch {}
  }
}
