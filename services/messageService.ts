"use server";

import { connectDB } from "@/lib/db";
import { Message } from "@/types/message";

export async function exportMessage() {
  await connectDB();
  const message = await Message.find(
    {},
    { text: 1, topic: 1, language: 1, _id: 0 },
  );
  return message;
}

export async function postMessage(
  text: string,
  topic: string,
  language: string,
) {
  await connectDB();
  const message = await Message.create({ text, topic, language });
  return message;
}
