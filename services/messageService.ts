import { connectDB } from "@/lib/db";
import { Message } from "@/types/message";

export async function getRandomMessages(
  category: string,
  language: string,
  n: number = 1,
) {
  await connectDB();

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
  return result[0]?.concatenatedText || "";
}

export async function postMessage(
  text: string,
  category: string,
  language: string,
) {
  await connectDB();
  const message = await Message.create({ text, category, language });
  return message;
}
