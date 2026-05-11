import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { creatorAvatar } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { deleteFile } from "@/lib/storage";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const record = await db.query.creatorAvatar.findFirst({
    where: (a, { eq }) => and(eq(a.id, id), eq(a.userId, session.user.id)),
  });

  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await deleteFile(record.imageUrl);
  await db.delete(creatorAvatar).where(eq(creatorAvatar.id, id));

  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();

  if (body.isDefault === true) {
    await db
      .update(creatorAvatar)
      .set({ isDefault: false })
      .where(and(eq(creatorAvatar.userId, session.user.id), eq(creatorAvatar.isDefault, true)));

    const [updated] = await db
      .update(creatorAvatar)
      .set({ isDefault: true })
      .where(eq(creatorAvatar.id, id))
      .returning();

    return NextResponse.json(updated);
  }

  const [updated] = await db
    .update(creatorAvatar)
    .set(body)
    .where(eq(creatorAvatar.id, id))
    .returning();

  return NextResponse.json(updated);
}
