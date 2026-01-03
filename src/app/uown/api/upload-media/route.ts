/**
 * Set ENV here: https://vercel.com/vprojectz-dev/web-portal/settings/environments/production
 */
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";

///
export async function POST(req: Request) {
  // App key protection
  const appKey = req.headers.get("x-uown-app-key");
  if (appKey !== process.env.UOWN_APP_KEY) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // Query params
  const { searchParams } = new URL(req.url);
  const folder = (searchParams.get("folder") ?? "uploads").replace(/^\/+|\/+$/g, "");
  const userId = searchParams.get("userId") ?? "anonymous";
  if (folder.includes("..")) return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
  // File
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Missing file" }, { status: 400 });
  //
  const buffer = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `${folder}/${userId}/${randomUUID()}-${safeName}`;
  const r2 = new S3Client({
    region: "auto",
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY!,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY!,
    },
  });
  //
  await r2.send(
    new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_UOWN_BUCKET!,
      Key: key,
      Body: buffer,
      ContentType: file.type,
    })
  );
  const publicUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
  return NextResponse.json({ url: publicUrl });
}