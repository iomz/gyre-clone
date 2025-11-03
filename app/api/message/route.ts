import { NextResponse } from "next/server";
import { postMessage } from "@/services/messageService";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, topic, language } = body as {
      text?: string;
      topic?: string;
      language?: string;
    };
    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }
    const message = await postMessage(
      text,
      topic || "general",
      language || "en-GB",
    );

    return NextResponse.json({ success: true, message });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to save";
    console.error("POST /api/message error:", err);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
