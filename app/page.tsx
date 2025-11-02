"use client";

import { useContext, useEffect, useRef, useState, useTransition } from "react";
import { Roboto, Noto_Serif_JP } from "next/font/google";
import { Center, VoiceOption } from "@/types/definitions";
import { SpiralContext, TriggerContext } from "@/lib/context";
import Logo from "@/components/ui/Logo";
import Spiral from "@/components/functional/Spiral";
import SpiralSVG from "@/components/layout/SpiralSVG";
import SpiralCounter from "@/components/ui/SpiralCounter";
import ModeToggle from "@/components/functional/ModeToggle";
import LanguageSelector from "@/components/ui/LanguageSelector";
import TopicSelector from "@/components/ui/TopicSelector";
import Header from "@/components/layout/Header";
import SpeakButton from "@/components/functional/SpeakButton";
import SpawnButton from "@/components/ui/SpawnButton";
import VoiceSelector from "@/components/functional/VoiceSelector";
import { useSyncedParam } from "@/hooks/useSyncedParam";
import { randomIntRange } from "@/utils/random";
import { fetchRandomMessagesAction } from "@/app/actions";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const notoSerifJP = Noto_Serif_JP({
  variable: "--font-noto-serif-jp",
  subsets: ["latin"],
});

export default function App() {
  const [topic, setTopic] = useSyncedParam("q", "love");
  const [language, setLanguage] = useSyncedParam("hl", "en-GB");
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(null);
  const [spirals, setSpirals] = useState<React.JSX.Element[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [center, setCenter] = useState<Center>({ x: 0, y: 0 });
  const [isPending, startTransition] = useTransition();
  const [speaking, setSpeaking] = useState(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const config = useContext(SpiralContext);

  const handleLanguageSelect = (l: string) => {
    setSpeaking(false);
    randmizeCenter();
    setLanguage(l);
    setSpirals([]);
  };

  const handleTopicSelect = (t: string) => {
    setSpeaking(false);
    randmizeCenter();
    setTopic(t);
    setSpirals([]);
  };

  const handleSpawn = async () => {
    startTransition(async () => {
      const text = await fetchRandomMessagesAction(language, topic, 5);
      const newSpiral = (
        <Spiral
          key={spirals.length}
          svgRef={svgRef}
          id={spirals.length}
          center={center}
          text={text}
          language={language}
        />
      );
      setSpirals((prev) => [...prev, newSpiral]);
    });
  };

  const handleTrigger = (msg: string) => {
    console.log(msg);
    if (spirals.length < config.spiralMax) {
      handleSpawn();
    }
  };

  const randmizeCenter = () => {
    /* randomize the center position */
    setCenter({
      x: randomIntRange(config.cXMin, config.cXMax),
      y: randomIntRange(config.cYMin, config.cYMax),
    });
  };

  useEffect(() => {
    randmizeCenter();
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && spirals.length == 0) {
      const t = setTimeout(() => {
        handleSpawn();
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [hydrated, spirals]);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <Logo center={center} topic={topic} language={language} />

      <TriggerContext.Provider value={handleTrigger}>
        <SpiralSVG svgRef={svgRef} language={language} spirals={spirals} />
      </TriggerContext.Provider>

      <Header />

      <div className="absolute bottom-5 right-5 flex items-center gap-2 text-sm font-medium text-white">
        <SpiralCounter numberOfSpirals={spirals.length} />

        <ModeToggle />

        <TopicSelector topic={topic} onChangeAction={handleTopicSelect} />

        <LanguageSelector
          language={language}
          topic={topic}
          onChangeAction={handleLanguageSelect}
        />

        <VoiceSelector
          language={language}
          selectedVoice={selectedVoice}
          setSelectedVoiceAction={setSelectedVoice}
        />

        <SpiralContext.Provider value={config}>
          <SpeakButton
            language={language}
            topic={topic}
            selectedVoice={selectedVoice}
            speaking={speaking}
            setSpeakingAction={setSpeaking}
          />
        </SpiralContext.Provider>

        <SpawnButton isPending={isPending} handleSpawn={handleSpawn} />
      </div>
    </div>
  );
}
