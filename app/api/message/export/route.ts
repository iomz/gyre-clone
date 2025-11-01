import { NextResponse } from "next/server";
import { exportMessage } from "@/services/messageService";

export async function GET() {
  try {
    const message = await exportMessage();

    // Convert JSON to string
    const json = JSON.stringify(message, null, 2);

    // Return response with headers for file download
    return new NextResponse(json, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="messages.json"`,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
