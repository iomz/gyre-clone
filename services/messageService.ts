"use server";

import { connectDB } from "@/lib/db";
import { Message } from "@/types/message";

export async function postMessage(
  text: string,
  category: string,
  language: string,
) {
  await connectDB();
  const message = await Message.create({ text, category, language });
  return message;
}
