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
    <label className="text-gray-300">
      Voice:
      <select
        value={selectedVoice?.name ?? ""}
        onChange={(e) => {
          const opt = e.target.selectedOptions[0];
          const v = voices.find(
            (x) => x.name === opt.value && x.lang === opt.dataset.lang,
          );
          setSelectedVoiceAction(v || null);
        }}
        className="ml-2 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white"
      >
        {voices
          .filter((v) => v.lang.slice(0, 2) === language.slice(0, 2))
          .map((v, i) => (
            <option key={i} value={v.name} data-lang={v.lang}>
              {v.name} - {v.lang}
            </option>
          ))}
      </select>
    </label>
  );
}
