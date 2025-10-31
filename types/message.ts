import mongoose, { Schema, models } from "mongoose";

const messageSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      default: "general", // fallback value
    },
    language: {
      type: String,
      required: true,
      default: "en-US", // fallback value
    },
  },
  { timestamps: true },
);

export const Message =
  models.Message || mongoose.model("Message", messageSchema);
