import { connectDB } from "@/lib/mongodb";
import { Message } from "@/models/Message";

export async function fetchText(category: string, language: string, n: number) {
  try {
    await connectDB();

    // Build a dynamic match object
    const match: Record<string, any> = {};
    if (category) match.category = category;
    if (language) match.language = language;

    const pipeline: any[] = [];

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

    return output;
  } catch (err) {
    console.error(err);
    return "";
  }
}
