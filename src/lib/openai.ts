import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateThumbnail(
  prompt: string,
  aspectRatio: "16:9" | "9:16" = "16:9"
): Promise<string | null> {
  const size = aspectRatio === "16:9" ? "1792x1024" : "1024x1792";
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt,
    n: 1,
    size,
    quality: "standard",
    style: "vivid",
    response_format: "url",
  });
  return response.data?.[0]?.url ?? null;
}

export async function describeImage(imageUrl: string): Promise<string | null> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Describe this person's appearance in detail for an AI image generation prompt. Focus on: hair style and color, face shape, expression, clothing, accessories, and any distinctive features.",
          },
          { type: "image_url", image_url: { url: imageUrl } },
        ],
      },
    ],
    max_tokens: 300,
  });
  return response.choices?.[0]?.message?.content ?? null;
}
