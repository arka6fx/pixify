import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { creatorAvatar } from "@/lib/schema";
import { upload } from "@/lib/storage";

export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const records = await db.query.creatorAvatar.findMany({
    where: (a, { eq }) => eq(a.userId, session.user.id),
    orderBy: (a, { desc }) => [desc(a.createdAt)],
  });

  return NextResponse.json(records);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const name = formData.get("name") as string | null;

  if (!file) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const stored = await upload(buffer, file.name, "avatars");

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
