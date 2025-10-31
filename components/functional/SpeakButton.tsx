"use client";

import { useContext, useState } from "react";
import { VoiceOption } from "@/types/definitions";
import { SpiralContext } from "@/lib/context";
import { playRadioNoise } from "@/utils/audio";
import { fetchSpiralText } from "@/utils/fetch";

export default function SpeakButton({
  language,
  topic,
  selectedVoice,
}: {
  language: string;
  topic: string;
  selectedVoice: VoiceOption;
}) {
  const [speaking, setSpeaking] = useState(false);
  const config = useContext(SpiralContext);

  const speak = async () => {
    // Usage: 0.2 second of radio-like noise
    playRadioNoise(0.2);

    const text = await fetchSpiralText(language, topic, 1);
    //console.log("I should be speaking...");
    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = selectedVoice ?? null;
    utter.lang = language;
    utter.pitch = config.speechPitch;
    utter.rate = config.speechRate;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);

    utter.onend = () => {
      setTimeout(() => speak(), config.speechInterval); // wait 5 seconds after speech ends
    };
  };

  const handleSpeak = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    speak();
  };

  return (
    <button
      onClick={handleSpeak}
      className={`bg-white/10 border border-white/20 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition ${
        speaking ? "bg-red-400" : "bg-blue-400"
      } text-white`}
    >
      {speaking ? "Mute" : "Speak"}
    </button>
  );
}
