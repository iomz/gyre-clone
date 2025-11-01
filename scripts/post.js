import { readFileSync } from "fs";
import { resolve } from "path";
import { request } from "https";

const endpoint = "https://gyre-clone.sazanka.io/api/message";
const url = new URL(endpoint);
// --- Step 1: Get CLI arguments ---
const [, , topic, language, filePath] = process.argv;

if (!filePath || !topic || !language) {
  console.error("Usage: node post.js <topic> <language> <file>");
  process.exit(1);
}

// --- Step 2: Read file contents ---
const absPath = resolve(filePath);
const fileContent = readFileSync(absPath, "utf-8");

// split into lines
const lines = fileContent.split("\n").filter(Boolean);

// --- Step 3: Send POST requests ---
lines.forEach((text, i) => {
  const data = JSON.stringify({ text, topic, language });

  const req = request(
    url,
    {
      hostname: url.hostname,
      port: url.port | 443,
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
      },
    },
    (res) => {
      let body = "";
      res.on("data", (chunk) => (body += chunk));
      res.on("end", () => {
        console.log(`[${i + 1}] Response:`, body);
      });
    },
  );

  req.on("error", (err) => console.error(`[${i + 1}] Error:`, err.message));
  req.write(data);
  req.end();
});
