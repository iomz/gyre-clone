import { readdir, readFileSync, statSync } from "fs";
import { extname, join, resolve } from "path";

const isValidLanguageCode = (code) => {
  // Regex: 2 lowercase letters for language - then 2 uppercase letters for region
  // E.g.,
  // ja → 2-letter language code (ISO 639-1)
  // JP → 2-letter region code (ISO 3166-1 alpha-2)
  const regex = /^[a-z]{2}(-[A-Z]{2})$/;
  return regex.test(code);
};

const postData = async (endpoint, data) => {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseBody = await response.text();
    console.log("Response:", responseBody);
    return responseBody;
  } catch (err) {
    console.error("Error posting data:", err);
    throw err;
  }
};

// --- Step 1: Get CLI arguments ---
const [, , endpoint, dir] = process.argv;

if (!endpoint || !dir) {
  console.error("Usage: node post.js <endpoint> <dir>");
  process.exit(1);
}

// --- Step 2: Find text files ---
readdir(dir, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    process.exit(1);
  }

  // Examine each file
  files.forEach((file) => {
    const filePath = join(dir, file);
    const stat = statSync(filePath);

    if (stat.isFile() && extname(file) === ".txt") {
      const parts = file.replace(".txt", "").split("_");
      const topic = parts[0];
      const language = parts[1];

      if (!isValidLanguageCode(language)) {
        return;
      }

      // --- Step 3: Read file contents ---
      const absPath = resolve(filePath);
      const fileContent = readFileSync(absPath, "utf-8");

      // split into lines
      const lines = fileContent.split("\n").filter(Boolean);

      // --- Step 4: Send POST requests ---
      lines.forEach((text, _) => {
        postData(endpoint, { text, topic, language });
      });
    }
  });
});
