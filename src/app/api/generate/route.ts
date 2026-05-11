import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { generateVariations } from "@/lib/generation";
import type { StylePreset } from "@/lib/types";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Generation not configured. Contact support." },
      { status: 503 }
    );
  }

  const body = await request.json();
  const { prompt, style, avatarId } = body as {
    prompt: string;
    style: StylePreset;
    avatarId?: string;
  };

  if (!prompt || !style) {
    return NextResponse.json(
      { error: "Missing required fields: prompt, style" },
      { status: 400 }
    );
  }

  try {
    const results = await generateVariations(prompt, style, session.user.id, avatarId);
    return NextResponse.json({ thumbnails: results });
  } catch (error) {
    console.error("Generation failed:", error);
    const message =
      error instanceof Error && error.message.includes("rate limit")
        ? "Too many requests. Please wait a moment and try again."
        : "Generation failed. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
