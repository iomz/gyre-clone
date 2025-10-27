"use client";

import { Suspense } from "react";
import { useContext, useEffect, useRef, useState } from "react";
import { Center, SpiralContext, TriggerContext } from "@/app/lib/definitions";
import Spiral from "@/app/ui/spiral";

type VoiceOption = SpeechSynthesisVoice | null;

export default function Home() {
  const [spirals, setSpirals] = useState<React.JSX.Element[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(null);
  const [language, setLanguage] = useState<string>("en-US");
  const [center, setCenter] = useState<Center>({ x: 100, y: 100 });
  const svgRef = useRef<any>(null);
  const config = useContext(SpiralContext);

  async function fetchText() {
    let res = null;
    let data: { text: any } | null = null;
    try {
      res = await fetch(`/api/text?language=${encodeURIComponent(language)}`);
      data = await res.json();
      if (data) {
        return data.text ?? "";
      }
    } catch (e) {
      const text = "text fetch server is down";
      return text;
    }
  }

  const handleRedraw = () => {
    randomizeCenter();
  };

  const handleReplay = async () => {
    const text = await fetchText();
    // TODO: implement text to speak algorithm here
    console.log("I should be speaking...");
    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = selectedVoice ?? null;
    utter.lang = language;
    utter.pitch = 0.8;
    utter.rate = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);

    utter.onend = () => {
      setTimeout(() => handleReplay(), 5000); // wait 5 seconds after speech ends
    };
  };

  const handleSpawn = async () => {
    const text = await fetchText();
    const newSpiral = (
      <Spiral
        key={spirals.length}
        svgRef={svgRef}
        center={center}
        text={text}
      />
    );
    setSpirals((prev) => [...prev, newSpiral]);
  };

  const handleTrigger = (msg: string) => console.log(msg);

  const randomizeCenter = () => {
    /* randomize the center position */
    const cx =
      Math.floor(Math.random() * (config.cXMax - config.cXMin)) + config.cXMin;
    const cy =
      Math.floor(Math.random() * (config.cYMax - config.cYMin)) + config.cYMin;
    setCenter({ x: cx, y: cy });
  };

  useEffect(() => {
    randomizeCenter();
  }, []);

  // load voices
  useEffect(() => {
    function loadVoices() {
      const v = window.speechSynthesis.getVoices();
      setVoices(v);
      if (!selectedVoice && v.length > 0) {
        const preferred = v.find((x) => x.lang === language) || v[0];
        setSelectedVoice(preferred);
      }
    }
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [language]);

  useEffect(() => {
    setHydrated(true);
  }, []);

  // runs after hydration
  useEffect(() => {
    const t = setTimeout(() => {
      //console.log("fully hydrated!");
      //handleReplay();
    }, 5000);

    // cleanup
    return () => clearTimeout(t);
  }, [hydrated]);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Fullscreen SVG */}
      <Suspense>
        <svg
          ref={svgRef}
          className="w-full h-full"
          viewBox="0 0 1600 900"
          preserveAspectRatio="xMidYMid slice"
        >
          <TriggerContext.Provider value={handleTrigger}>
            {spirals}
          </TriggerContext.Provider>
        </svg>
      </Suspense>
      <div className="absolute bottom-5 right-5 flex items-center gap-2 text-sm font-medium text-white">
        <label className="text-gray-300">
          Spirals:
          <input
            type="number"
            value={spirals.length}
            className="ml-2 w-24 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white"
            readOnly
          />
        </label>

        <label className="text-gray-300">
          Language:
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="ml-2 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white"
          >
            <option value="en-US">English (US)</option>
            <option value="pt-PT">Português (PT)</option>
          </select>
        </label>

        <label className="text-gray-300">
          Voice:
          <select
            value={selectedVoice?.name ?? ""}
            onChange={(e) => {
              const v = voices.find((x) => x.name === e.target.value);
              setSelectedVoice(v || null);
            }}
            className="ml-2 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white"
          >
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} — {v.lang}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={() => handleReplay()}
          className="bg-white/10 border border-white/20 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition"
        >
          Replay
        </button>

        <button
          onClick={() => handleRedraw()}
          className="bg-white/10 border border-white/20 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition"
        >
          Redraw
        </button>

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
