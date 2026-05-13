import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import sharp from "sharp";

const SESSION_TOKEN = "s3llzpk-adm1n-v3rified-2026";
const MAX_PX = 1400;
const QUALITY = 82;

export async function POST(req: NextRequest) {
  const cookie = req.cookies.get("admin_session")?.value;
  if (cookie !== SESSION_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: photos, error } = await supabaseAdmin
    .from("ad_photos")
    .select("id, url, ad_id");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!photos || photos.length === 0) return NextResponse.json({ processed: 0, skipped: 0, failed: 0 });

  let processed = 0, skipped = 0, failed = 0;

  for (const photo of photos) {
    try {
      // Download original
      const res = await fetch(photo.url);
      if (!res.ok) { failed++; continue; }
      const buffer = Buffer.from(await res.arrayBuffer());

      // Get metadata to check if resize needed
      const meta = await sharp(buffer).metadata();
      const w = meta.width ?? 0;
      const h = meta.height ?? 0;

      // Skip if already small enough and already jpeg
      if (w <= MAX_PX && h <= MAX_PX && meta.format === "jpeg") {
        skipped++;
        continue;
      }

      // Compress
      let pipeline = sharp(buffer).rotate(); // auto-orient from EXIF
      if (w > MAX_PX || h > MAX_PX) {
        pipeline = pipeline.resize(MAX_PX, MAX_PX, { fit: "inside", withoutEnlargement: true });
      }
      const compressed = await pipeline.jpeg({ quality: QUALITY, mozjpeg: true }).toBuffer();

      // Extract storage path from URL
      // URL format: https://xxx.supabase.co/storage/v1/object/public/ad-photos/<path>
      const urlObj = new URL(photo.url);
      const pathMatch = urlObj.pathname.match(/\/object\/public\/ad-photos\/(.+)/);
      if (!pathMatch) { failed++; continue; }
      const storagePath = pathMatch[1];

      // Re-upload (overwrite)
      const { error: upErr } = await supabaseAdmin.storage
        .from("ad-photos")
        .update(storagePath, compressed, { contentType: "image/jpeg", upsert: true });

      if (upErr) { failed++; continue; }
      processed++;
    } catch {
      failed++;
    }
  }

  return NextResponse.json({ processed, skipped, failed, total: photos.length });
}
