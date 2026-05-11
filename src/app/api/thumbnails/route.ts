import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { and } from "drizzle-orm";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const favoritesOnly = searchParams.get("favorites") === "true";

  const records = await db.query.thumbnail.findMany({
    where: (t, { eq }) =>
      favoritesOnly
        ? and(eq(t.userId, session.user.id), eq(t.isFavorite, true))
        : eq(t.userId, session.user.id),
    orderBy: (t, { desc }) => [desc(t.createdAt)],
  });

  return NextResponse.json(records);
}
