import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Message } from "@/models/Message";

export async function POST(req: Request) {
  try {
    const { text, category, language } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "Missing text" }, { status: 400 });
    }
    await connectDB();
    const message = await Message.create({ text, category, language });

    return NextResponse.json({ success: true, message });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}

// GET — fetch all messages (optionally filtered by category)
export async function GET(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("q");
    const language = searchParams.get("hl");
    const n = parseInt(searchParams.get("n") || "0", 10); // optional limit

    const match: Record<string, string> = {};
    if (category) {
      match.category = category;
    }
    if (language) {
      match.language = language;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pipeline: any[] = [];

    // Optional filters
    if (Object.keys(match).length > 0) {
      pipeline.push({ $match: match });
    }

    // Optional sampling (if you want a random subset)
    if (n > 0) {
      pipeline.push({ $sample: { size: n } });
    }

    // Combine all text fields into a single string
    pipeline.push({
      $group: {
        _id: null,
        concatenatedText: { $push: "$text" },
      },
    });

    // Merge array into one string with spaces
    pipeline.push({
      $project: {
        _id: 0,
        concatenatedText: {
          $reduce: {
            input: "$concatenatedText",
            initialValue: "",
            in: {
              $concat: [
                "$$value",
                { $cond: [{ $eq: ["$$value", ""] }, "", " "] },
                "$$this",
              ],
            },
          },
        },
      },
    });

    const result = await Message.aggregate(pipeline);
    const output = result[0]?.concatenatedText || "";

    return NextResponse.json({ concatenatedText: output });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to concatenate messages" },
      { status: 500 },
    );
  }
}
