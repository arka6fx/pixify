import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");

  const records = type && type !== "all"
    ? await db.query.brandAsset.findMany({
        where: (a, { eq, and }) => and(eq(a.userId, session.user.id), eq(a.type, type)),
        orderBy: (a, { desc }) => [desc(a.createdAt)],
      })
    : await db.query.brandAsset.findMany({
        where: (a, { eq }) => eq(a.userId, session.user.id),
        orderBy: (a, { desc }) => [desc(a.createdAt)],
      });

  return NextResponse.json(records);
}
