"use client";

import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
  useTransition,
} from "react";
import { Button } from "@/components/ui/button";
import { VoiceOption } from "@/types/definitions";
import { SpiralContext } from "@/lib/context";
import { playRadioNoise } from "@/utils/audio";
import { fetchRandomMessagesAction } from "@/app/actions";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function SpeakButton({
  language,
  topic,
  selectedVoice,
  speaking,
  setSpeakingAction,
}: {
  language: string;
  topic: string;
  selectedVoice: VoiceOption;
  speaking: boolean;
  setSpeakingAction: Dispatch<SetStateAction<boolean>>;
}) {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isPending, startTransition] = useTransition();
  const config = useContext(SpiralContext);

  const speak = async () => {
    // Usage: 0.2 second of radio-like noise
    playRadioNoise(0.2);

    startTransition(async () => {
      const text = await fetchRandomMessagesAction(language, topic, 1);
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
    });
  };

  const handleSpeak = () => {
    /* somehow this enables speech on iOS */
    const utter = new SpeechSynthesisUtterance("");
    utter.voice = selectedVoice;
    speechSynthesis.cancel();
    speechSynthesis.speak(utter);

    setIsModalOpen(false);
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeakingAction(false);
      return;
    }
    setSpeakingAction(true);
    speak();
  };

  useEffect(() => {
    if (!speaking) {
      window.speechSynthesis.cancel();
    }
  }, [speaking]);

  useEffect(() => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeakingAction(false);
    }
  }, [selectedVoice]);

  return (
    <>
      <Button
        disabled={isPending}
        onClick={handleSpeak}
        className={"hover:bg-white/20 w-[180px]"}
      >
        {speaking ? "Mute" : "Speak"}
      </Button>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Warning"
        message="This website plays audio."
        onConfirm={handleSpeak}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
}
