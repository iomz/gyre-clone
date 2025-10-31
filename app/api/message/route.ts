import { NextResponse } from "next/server";
import { postMessage } from "@/services/messageService";

export async function POST(req: Request) {
  try {
    const { text, topic, language } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }
    const message = await postMessage(text, topic, language);

    return NextResponse.json({ success: true, message });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
