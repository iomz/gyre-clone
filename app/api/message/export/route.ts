import { NextResponse } from "next/server";
import { exportMessage } from "@/services/messageService";

export async function GET() {
  try {
    const message = await exportMessage();

    return NextResponse.json(message);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
