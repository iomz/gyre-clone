import { NextResponse } from "next/server";
import { getRandomMessages, postMessage } from "@/services/messageService";

export async function POST(req: Request) {
  try {
    const { text, category, language } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }
    const message = await postMessage(text, category, language);

    return NextResponse.json({ success: true, message });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

// GET — fetch all messages (optionally filtered by category)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("q") || "love";
    const language = searchParams.get("hl") || "en-US";
    const n = parseInt(searchParams.get("n") || "1", 10); // optional limit

    const message = await getRandomMessages(category, language, n);
    return NextResponse.json({ concatenatedText: message });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to concatenate messages" },
      { status: 500 },
    );
  }
}
