import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { thumbnail } from "@/lib/schema";
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

  const record = await db.query.thumbnail.findFirst({
    where: (t, { eq }) => and(eq(t.id, id), eq(t.userId, session.user.id)),
  });

  if (!record) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await deleteFile(record.imageUrl);
  await db.delete(thumbnail).where(eq(thumbnail.id, id));

  return NextResponse.json({ success: true });
}
