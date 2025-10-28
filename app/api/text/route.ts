export async function GET(req: Request) {
  const url = new URL(req.url);
  const length = url.searchParams.get("length") ?? "4000";
  const language = url.searchParams.get("language") ?? "en-US";

  const languageNameMap: Record<string, string> = {
    "pt-PT": "Português",
    "en-US": "English",
    "en-GB": "English (UK)",
    "ja-JP": "Japanese",
    "fr-FR": "French",
    "de-DE": "German",
    "es-ES": "Spanish",
  };

  const languageName = languageNameMap[language] ?? "Português";

  /*
    const prompt = `Write an engaging paragraph of approximately ${length} words in ${languageName} about creativity, imagination, and discovery. Use natural tone and fluent grammar of ${languageName}.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices?.[0]?.message?.content ?? "";
    return new Response(JSON.stringify({ text }), {
      headers: { "Content-Type": "application/json" },
    });
    */
  const text = "";
  return new Response(
    JSON.stringify({ text: text.slice(0, parseInt(length)) }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}
