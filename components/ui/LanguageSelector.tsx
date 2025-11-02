"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
    <Select
      disabled={isPending}
      value={language}
      onValueChange={(v) => onChangeAction(v)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Language</SelectLabel>
          {languages.map((l, i) => (
            <SelectItem key={i} value={l}>
              {languageName(l.slice(0, 2))}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
