"use client";

import { Suspense } from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { Roboto, Noto_Serif_JP } from "next/font/google";
import { Center, VoiceOption } from "@/types/definitions";
import { SpiralContext, TriggerContext } from "@/lib/context";
import Logo from "@/components/ui/Logo";
import Spiral from "@/components/functional/Spiral";
import SpiralSVG from "@/components/layout/SpiralSVG";
import SpiralCounter from "@/components/ui/SpiralCounter";
import LanguageSelector from "@/components/ui/LanguageSelector";
import TopicSelector from "@/components/ui/TopicSelector";
import Header from "@/components/layout/Header";
import SpeakButton from "@/components/functional/SpeakButton";
import VoiceSelector from "@/components/functional/VoiceSelector";
import { useSyncedParam } from "@/hooks/useSyncedParam";
import { fetchSpiralText } from "@/utils/fetch";
import { randomIntRange } from "@/utils/random";

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
  const [language, setLanguage] = useSyncedParam("hl", "en-US");
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(null);
  const [spirals, setSpirals] = useState<React.JSX.Element[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [center, setCenter] = useState<Center>({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement | null>(null);
  const config = useContext(SpiralContext);

  const handleSwitch = (l: string, t: string) => {
    setLanguage(l);
    setTopic(t);
    setSpirals([]);
  };

  const handleSpawn = async () => {
    const text = await fetchSpiralText(language, topic, 5);
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
  };

  const handleTrigger = (msg: string) => {
    console.log(msg);
    if (spirals.length < config.spiralMax) {
      handleSpawn();
    }
  };

  useEffect(() => {
    /* randomize the center position */
    setCenter({
      x: randomIntRange(config.cXMin, config.cXMax),
      y: randomIntRange(config.cYMin, config.cYMax),
    });
    setHydrated(true);
  }, []);

  // runs after hydration
  useEffect(() => {
    const t = setTimeout(() => {
      //console.log("fully hydrated!");
      handleSpawn();
    }, 1000);

    // cleanup
    return () => clearTimeout(t);
  }, [hydrated]);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <Logo center={center} language={language} />

      <Suspense>
        <TriggerContext.Provider value={handleTrigger}>
          <SpiralSVG svgRef={svgRef} language={language} spirals={spirals} />
        </TriggerContext.Provider>
      </Suspense>

      <Header />

      <div className="absolute bottom-5 right-5 flex items-center gap-2 text-sm font-medium text-white">
        <SpiralCounter numberOfSpirals={spirals.length} />

        <label className="text-gray-300">
          Language:
          <LanguageSelector
            language={language}
            topic={topic}
            onChange={handleSwitch}
          />
        </label>

        <label className="text-gray-300">
          Topic:
          <TopicSelector
            language={language}
            topic={topic}
            onChange={handleSwitch}
          />
        </label>

        <label className="text-gray-300">
          Voice:
          <VoiceSelector
            language={language}
            selectedVoice={selectedVoice}
            setSelectedVoiceAction={setSelectedVoice}
          />
        </label>

        <SpiralContext.Provider value={config}>
          <SpeakButton
            language={language}
            topic={topic}
            selectedVoice={selectedVoice}
          />
        </SpiralContext.Provider>

        <button
          onClick={() => handleSpawn()}
          className="bg-white/10 border border-white/20 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition"
        >
          Spawn
        </button>
      </div>
    </div>
  );
}
