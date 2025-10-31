"use server";

import { connectDB } from "@/lib/db";
import { Message } from "@/types/message";

export async function postMessage(
  text: string,
  topic: string,
  language: string,
) {
  await connectDB();
  const message = await Message.create({ text, topic, language });
  return message;
}
