import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { upload } from "@/lib/storage";
import { db } from "@/lib/db";
import { brandAsset, creatorAvatar } from "@/lib/schema";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const type = formData.get("type") as string | null;
  const name = formData.get("name") as string | null;

  if (!file || !type) {
    return NextResponse.json(
      { error: "Missing required fields: file, type" },
      { status: 400 }
    );
  }

  if (!["avatar", "asset"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const stored = await upload(buffer, file.name, type === "avatar" ? "avatars" : "assets");

  if (type === "avatar") {
    const [record] = await db
      .insert(creatorAvatar)
      .values({
        userId: session.user.id,
        name: name || file.name,
        imageUrl: stored.url,
      })
      .returning();
    return NextResponse.json(record);
  }

  const [record] = await db
    .insert(brandAsset)
    .values({
      userId: session.user.id,
      name: name || file.name,
      type: "graphic",
      imageUrl: stored.url,
      fileSize: buffer.length,
    })
    .returning();
  return NextResponse.json(record);
}
