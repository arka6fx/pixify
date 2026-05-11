import { generateThumbnail, describeImage } from "@/lib/openai";
import { upload } from "@/lib/storage";
import { db } from "@/lib/db";
import { thumbnail } from "@/lib/schema";
import type { StylePreset } from "@/lib/types";

const STYLE_MODIFIERS: Record<StylePreset, string> = {
  Cinematic: "dramatic lighting, film-like color grading, shallow depth of field, cinematic composition, anamorphic look",
  Minimal: "clean composition, plenty of negative space, minimalist design, subtle accents, uncluttered",
  Bold: "high contrast, saturated colors, punchy visual hierarchy, striking, attention-grabbing",
  Neon: "synthwave-inspired, glowing neon accents, cyberpunk aesthetic, vibrant purples and pinks, dark background with bright neon",
  Vintage: "warm tones, film grain texture, retro color palette, nostalgic, 1970s-80s aesthetic",
  Clean: "bright and crisp, professional look, soft natural tones, well-lit, polished",
  Dark: "moody atmosphere, high contrast, dramatic shadows, dark aesthetics, brooding tones",
  Vibrant: "high-energy, colorful explosion, eye-popping color combinations, dynamic",
  Retro: "80s/90s inspired, nostalgic color schemes, retro-futuristic, arcade aesthetic",
  Gaming: "esports-ready, dynamic composition, energetic, motion feel, competitive gaming vibe",
};

const VARIATION_MODIFIERS = [
  "slightly wider composition, more negative space",
  "tighter crop, more intimate feel",
  "different color temperature, warmer tones",
  "different color temperature, cooler tones",
];

function buildEnhancedPrompt(
  basePrompt: string,
  style: StylePreset,
  avatarDescription?: string
): string {
  const parts = [basePrompt];
  parts.push(STYLE_MODIFIERS[style]);
  if (avatarDescription) {
    parts.push(`featuring ${avatarDescription}`);
  }
  return parts.join(". ");
}

export async function generateVariations(
  basePrompt: string,
  style: StylePreset,
  userId: string,
  avatarId?: string | null
) {
  let avatarDescription: string | undefined;

  if (avatarId) {
    const avatar = await db.query.creatorAvatar.findFirst({
      where: (av, { eq }) => eq(av.id, avatarId),
    });
    if (avatar) {
      try {
        avatarDescription = (await describeImage(avatar.imageUrl)) ?? undefined;
      } catch {
        console.warn("Vision API failed, continuing without avatar description");
      }
    }
  }

  const prompts = [basePrompt];
  for (let i = 1; i < 4; i++) {
    prompts.push(`${basePrompt}, ${VARIATION_MODIFIERS[i]}`);
  }

  const enrichedPrompts = prompts.map((p) =>
    buildEnhancedPrompt(p, style, avatarDescription)
  );

  const results = await Promise.all(
    enrichedPrompts.map(async (ep) => {
      const imageUrl = await generateThumbnail(ep);
      if (!imageUrl) throw new Error("Generation returned no image");
      const stored = await upload(
        await fetch(imageUrl).then((r) => r.arrayBuffer()).then((b) => Buffer.from(b)),
        `thumbnail-${Date.now()}.png`,
        "thumbnails"
      );
      const [record] = await db
        .insert(thumbnail)
        .values({
          userId,
          prompt: ep,
          style,
          imageUrl: stored.url,
        })
        .returning();
      return record;
    })
  );

  return results;
}
