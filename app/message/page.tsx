"use client";

import { useState } from "react";

export default function Home() {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [language, setLanguage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, category, language }),
    });

    if (res.ok) {
      setStatus("✅ Saved!");
      setText("");
      setCategory("");
    } else {
      setStatus("❌ Failed");
    }
  };

  return (
    <main style={{ padding: 20 }}>
      <form onSubmit={handleSubmit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write something..."
          style={{ padding: 8, width: "800px" }}
        />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category"
          style={{ padding: 8, width: "200px", marginLeft: 8 }}
        />
        <input
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          placeholder="Language"
          style={{ padding: 8, width: "200px", marginLeft: 8 }}
        />
        <button type="submit" style={{ marginLeft: 8 }}>
          Save
        </button>
      </form>
      <p>{status}</p>
    </main>
  );
}
