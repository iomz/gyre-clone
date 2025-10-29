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
  const [speaking, setSpeaking] = useState<boolean>(false);
  const [language, setLanguage] = useState<string>("en-US");
  const [topic, setTopic] = useState<string>("love");
  const [center, setCenter] = useState<Center>({ x: 100, y: 100 });
  const svgRef = useRef<SVGSVGElement | null>(null);
  const config = useContext(SpiralContext);

  async function fetchSpiralText(
    language: string,
    topic: string,
    n: number = 5,
  ) {
    let res = null;
    let data: { concatenatedText: string } | null = null;
    try {
      res = await fetch(
        `/api/message?language=${encodeURIComponent(language)}&category=${encodeURIComponent(topic)}&n=${encodeURIComponent(n)}`,
      );
      data = await res.json();
      if (data) {
        return data.concatenatedText ?? "";
      }
    } catch {
      const text = "text fetch server is down";
      return text;
    }
  }

  function playRadioNoise(duration = 2) {
    const audioCtx = new AudioContext();

    // Create a buffer of random samples
    const bufferSize = audioCtx.sampleRate * duration; // e.g., 2 seconds
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);

    // Fill with random values between -1 and 1
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    // Play the buffer
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    // Optional: apply a filter to make it more “radio-like”
    const filter = audioCtx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 18000; // high frequencies
    filter.Q.value = 0.7;

    noise.connect(filter).connect(audioCtx.destination);
    noise.start();
    noise.stop(audioCtx.currentTime + duration);
  }

  const handleSpeech = async () => {
    if (speaking) {
      setSpeaking(false);
      handleStop();
    } else {
      setSpeaking(true);
      await handlePlay();
    }
  };

  const handlePlay = async () => {
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
      setTimeout(() => handlePlay(), config.speechInterval); // wait 5 seconds after speech ends
    };
  };

  const handleStop = () => {
    window.speechSynthesis.cancel(); // stops immediately
  };

  const handleSwitchTopic = (l: string, t: string) => {
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
        center={center}
        text={text}
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

  const randomizeCenter = () => {
    /* randomize the center position */
    const cx =
      Math.floor(Math.random() * (config.cXMax - config.cXMin)) + config.cXMin;
    const cy =
      Math.floor(Math.random() * (config.cYMax - config.cYMin)) + config.cYMin;
    setCenter({ x: cx, y: cy });
  };

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
          setSelectedVoice(preferred);
        } else if (language.startsWith("ja")) {
          const preferred = v.find((x) => x.name.startsWith("O-Ren")) || v[0];
          setSelectedVoice(preferred);
        } else if (language.startsWith("pt")) {
          const preferred = v.find((x) => x.name.startsWith("Joana")) || v[0];
          setSelectedVoice(preferred);
        }
      }
    }
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
      handleStop();
    };
  }, [language]);

  useEffect(() => {
    randomizeCenter();
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
            onChange={(e) => handleSwitchTopic(e.target.value, topic)}
            className="ml-2 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white"
          >
            <option value="en-US">English (en-US)</option>
            <option value="ja-JP">日本語 (ja-JP)</option>
            <option value="pt-PT">Português (pt-PT)</option>
          </select>
        </label>

        <label className="text-gray-300">
          Topic:
          <select
            value={topic}
            onChange={(e) => handleSwitchTopic(language, e.target.value)}
            className="ml-2 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white"
          >
            <option value="love">Love</option>
            <option value="philosophy">Philosophy</option>
            <option value="politics">Politics</option>
            <option value="science">Science</option>
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
          onClick={() => handleSpeech()}
          className="bg-white/10 border border-white/20 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition"
        >
          {speaking ? "Stop" : "Speak"}
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
