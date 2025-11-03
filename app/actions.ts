"use server";
import { connectDB } from "@/lib/db";
import { Message } from "@/types/message";
import type { PipelineStage } from "mongoose";

export async function fetchLanguagesAction(topic: string) {
  await connectDB();

  const uniqueLanguages = await Message.distinct("language", { topic });
  return uniqueLanguages;
}

export async function fetchTopicsAction() {
  await connectDB();

  const uniqueTopics = await Message.distinct("topic");
  return uniqueTopics;
}

export async function fetchRandomMessagesAction(
  language: string,
  topic: string,
  n: number,
) {
  await connectDB();

  const match: Record<string, string> = {};
  if (topic) {
    match.topic = topic;
  }
  if (language) {
    match.language = language;
  }

  // MongoDB aggregation pipeline - using Record for type safety
  // while maintaining flexibility for complex MongoDB aggregation operators
  const pipeline: Array<Record<string, unknown>> = [];

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

  const result = await Message.aggregate(
    pipeline as unknown as PipelineStage[],
  );
  return result[0]?.concatenatedText || "something went wrong";
}
