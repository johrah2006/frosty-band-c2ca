// Cloudflare Worker — التوليد الحقيقي للصور
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/api/generate" && request.method === "POST") {
      try {
        const { name = "", feeling = "" } = await request.json();
        if (!feeling.trim()) return Response.json({error:"اكتبي الشعور أولاً."},{status:400});

        const prompt = `
Create a beautiful premium Saudi National Day 96 artwork inspired by the emotion in this Arabic feeling:
"${feeling.slice(0,500)}"
Do NOT render the sentence or any readable text inside the image. Visualize the emotion itself.
Use Saudi identity, elegant green and cream palette, subtle Saudi flag elements, heritage architecture,
palm trees, mountains and/or a modern Saudi skyline, blended according to the feeling.
Make the emotional meaning obvious through lighting, composition and visual symbolism.
Professional digital art for a school exhibition, cinematic light, refined, beautiful, balanced,
no logos, no watermark, no random letters, no identifiable people.
`;

        const result = await env.AI.run("@cf/black-forest-labs/flux-1-schnell", {
          prompt,
          steps: 8,
          seed: Math.floor(Math.random() * 2147483647)
        });

        return Response.json({
          dataURI: `data:image/jpeg;base64,${result.image}`,
          name
        });
      } catch (e) {
        return Response.json({error:"تعذر توليد الصورة حالياً."},{status:500});
      }
    }

    return env.ASSETS.fetch(request);
  }
};
