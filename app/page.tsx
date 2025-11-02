"use client";

import {
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
  useCallback,
} from "react";
import { Roboto, Noto_Serif_JP } from "next/font/google";
import { Center, VoiceOption } from "@/types/definitions";
import { SpiralContext, TriggerContext } from "@/lib/context";
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

  const randomizeCenter = useCallback(() => {
    /* randomize the center position */
    setCenter({
      x: randomIntRange(config.cXMin, config.cXMax),
      y: randomIntRange(config.cYMin, config.cYMax),
    });
  }, [config.cXMin, config.cXMax, config.cYMin, config.cYMax]);

  const handleLanguageSelect = useCallback(
    (l: string) => {
      setSpeaking(false);
      randomizeCenter();
      setLanguage(l);
      setSpirals([]);
    },
    [randomizeCenter, setLanguage],
  );

  const handleTopicSelect = useCallback(
    (t: string) => {
      setSpeaking(false);
      randomizeCenter();
      setTopic(t);
      setSpirals([]);
    },
    [randomizeCenter, setTopic],
  );

  const handleSpawn = useCallback(async () => {
    startTransition(async () => {
      const text = await fetchRandomMessagesAction(language, topic, 5);
      setSpirals((prev) => {
        const newSpiral = (
          <Spiral
            key={prev.length}
            svgRef={svgRef}
            id={prev.length}
            center={center}
            text={text}
            language={language}
          />
        );
        return [...prev, newSpiral];
      });
    });
  }, [language, topic, center, startTransition]);

  const handleTrigger = useCallback(
    (msg: string) => {
      if (process.env.NODE_ENV === "development") {
        console.log(msg);
      }
      if (spirals.length < config.spiralMax) {
        handleSpawn();
      }
    },
    [spirals.length, config.spiralMax, handleSpawn],
  );

  useEffect(() => {
    randomizeCenter();
    setHydrated(true);
  }, [randomizeCenter]);

  useEffect(() => {
    if (hydrated && spirals.length === 0) {
      const t = setTimeout(() => {
        handleSpawn();
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [hydrated, spirals.length, handleSpawn]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-white dark:bg-black">
      {/* <Logo center={center} topic={topic} language={language} /> */}

      <TriggerContext.Provider value={handleTrigger}>
        <SpiralSVG svgRef={svgRef} language={language} spirals={spirals} />
      </TriggerContext.Provider>

      <Header />

      <div className="absolute bottom-5 right-5 flex items-center gap-2 text-sm font-medium">
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
