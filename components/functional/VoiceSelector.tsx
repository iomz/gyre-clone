"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
        if (language.startsWith("en")) {
          const preferred =
            v.find((x) => x.name === "Google UK English Male") || v[0];
          setSelectedVoiceAction(preferred);
        } else if (language.startsWith("ja")) {
          const preferred = v.find((x) => x.name.startsWith("O-Ren")) || v[0];
          setSelectedVoiceAction(preferred);
        } else if (language.startsWith("pt")) {
          const preferred = v.find((x) => x.name.startsWith("Joana")) || v[0];
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
    <select
      value={selectedVoice?.name ?? ""}
      onChange={(e) => {
        const v = voices.find((x) => x.name === e.target.value);
        setSelectedVoiceAction(v || null);
      }}
      className="ml-2 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white"
    >
      {voices.map((v) => (
        <option key={v.name} value={v.name}>
          {v.name} — {v.lang}
        </option>
      ))}
    </select>
  );
}
