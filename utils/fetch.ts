export async function fetchSpiralText(
  language: string,
  topic: string,
  n: number = 5,
) {
  let res = null;
  let data: { concatenatedText: string } | null = null;
  try {
    res = await fetch(
      `/api/message?hl=${encodeURIComponent(language)}&q=${encodeURIComponent(topic)}&n=${encodeURIComponent(n)}`,
    );
    data = await res.json();
    if (data) {
      return data.concatenatedText ?? "";
    }
  } catch {
    const text = "text fetch server is down";
    return text;
  }
}
