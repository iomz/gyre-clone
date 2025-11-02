"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VoiceOption } from "@/types/definitions";

export default function VoiceSelector({
  language,
  selectedVoice,
  setSelectedVoiceAction,
}: {
  language: string;
  selectedVoice: VoiceOption;
  setSelectedVoiceAction: Dispatch<SetStateAction<VoiceOption>>;
}) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  // load voices
  useEffect(() => {
    function loadVoices() {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
      if (v.length > 0) {
        //const preferred = v.find((x) => x.lang === language) || v[0];
        if (language === "en-GB") {
          const preferred =
            v.find((x) => x.name.includes("Google UK English Male")) ||
            v.filter((v) => v.lang.slice(0, 2) === language.slice(0, 2))[0];
          setSelectedVoiceAction(preferred);
        } else if (language === "ja-JP") {
          const preferred =
            v.find((x) => x.name.includes("O-Ren")) ||
            v.filter((v) => v.lang.slice(0, 2) === language.slice(0, 2))[0];
          setSelectedVoiceAction(preferred);
        } else if (language === "pt-PT") {
          const preferred =
            v.find((x) => x.name.includes("Joana")) ||
            v.filter((v) => v.lang.slice(0, 2) === language.slice(0, 2))[0];
          setSelectedVoiceAction(preferred);
        } else {
          const preferred = v.filter(
            (v) => v.lang.slice(0, 2) === language.slice(0, 2),
          )[0];
          setSelectedVoiceAction(preferred);
        }
      }
    }
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [language]);

  return (
    <Select
      value={`${selectedVoice?.name}|${selectedVoice?.lang}`}
      onValueChange={(value) => {
        const [name, lang] = value.split("|");
        const v = voices.find((x) => x.name === name && x.lang === lang);
        setSelectedVoiceAction(v || null);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Voice</SelectLabel>
          {voices
            .filter((v) => v.lang.slice(0, 2) === language.slice(0, 2))
            .map((v, i) => (
              <SelectItem key={i} value={`${v.name}|${v.lang}`}>
                {v.name} - {v.lang}
              </SelectItem>
            ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
