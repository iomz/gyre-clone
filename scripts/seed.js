// scripts/seed.js
import { MongoClient } from "mongodb";
import fs from "fs";

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const data = JSON.parse(fs.readFileSync("./data/messages.json", "utf-8"));

async function seed() {
  await client.connect();
  const db = client.db("gyre-clone");
  const collection = db.collection("messages");
  const count = await collection.countDocuments();
  if (count === 0) {
    await collection.insertMany(data);
    console.log("✅ Imported messages.json");
  } else {
    console.log("⚙️ Collection already populated");
  }
  await client.close();
}

seed();
