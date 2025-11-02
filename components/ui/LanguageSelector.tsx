"use client";

import { useEffect, useState, useTransition } from "react";
import { fetchLanguagesAction } from "@/app/actions";
import { languageName } from "@/utils/language";

type HandleLanguageSelect = (language: string) => void;

export default function LanguageSelector({
  language,
  topic,
  onChangeAction,
}: {
  language: string;
  topic: string;
  onChangeAction: HandleLanguageSelect;
}) {
  const [languages, setLanguages] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const newLanguages = await fetchLanguagesAction(topic);
      setLanguages(newLanguages);
    });
  }, [topic]);

  return (
    <label className="text-gray-300">
      Language:
      <select
        disabled={isPending}
        value={language}
        onChange={(e) => onChangeAction(e.target.value)}
        className="ml-2 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white"
      >
        {languages.map((l, i) => (
          <option key={i} value={l}>
            {languageName(l.slice(0, 2))}
          </option>
        ))}
      </select>
    </label>
  );
}
