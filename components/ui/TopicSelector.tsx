"use client";

import { useEffect, useState, useTransition } from "react";
import { fetchTopicsAction } from "@/app/actions";

type HandleTopicSelect = (topic: string) => void;

export default function TopicSelector({
  topic,
  onChangeAction,
}: {
  topic: string;
  onChangeAction: HandleTopicSelect;
}) {
  const [topics, setTopics] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const newTopics = await fetchTopicsAction();
      setTopics(newTopics);
    });
  }, []);

  return (
    <label className="text-gray-300">
      Topic:
      <select
        disabled={isPending}
        value={topic}
        onChange={(e) => onChangeAction(e.target.value)}
        className="ml-2 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white"
      >
        {topics.map((t, i) => (
          <option key={i} value={t}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </option>
        ))}
      </select>
    </label>
  );
}
