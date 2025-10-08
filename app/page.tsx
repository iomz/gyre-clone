"use client";

import Spiral from "@/app/ui/spiral";
import { useEffect, useRef, useState } from "react";

type VoiceOption = SpeechSynthesisVoice | null;

export default function Home() {
  const [text0, setText0] = useState("");
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [text3, setText3] = useState("");
  const [text4, setText4] = useState("");
  const [text5, setText5] = useState("");
  const [length, setLength] = useState<number>(4000);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>(null);
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<string>("en-US");
  const svgRef = useRef<any>(null);

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

  // fetch text from API
  useEffect(() => {
    let mounted = true;
    async function fetchText() {
      setLoading(true);
      try {
        let res = await fetch(
          `/api/text?length=${length}&language=${encodeURIComponent(language)}`,
        );
        let data = await res.json();
        if (mounted) setText0(data.text ?? "");

        res = await fetch(
          `/api/text?length=${length}&language=${encodeURIComponent(language)}`,
        );
        data = await res.json();
        if (mounted) setText1(data.text ?? "");

        res = await fetch(
          `/api/text?length=${length}&language=${encodeURIComponent(language)}`,
        );
        data = await res.json();
        if (mounted) setText2(data.text ?? "");

        res = await fetch(
          `/api/text?length=${length}&language=${encodeURIComponent(language)}`,
        );
        data = await res.json();
        if (mounted) setText3(data.text ?? "");

        res = await fetch(
          `/api/text?length=${length}&language=${encodeURIComponent(language)}`,
        );
        data = await res.json();
        if (mounted) setText4(data.text ?? "");

        res = await fetch(
          `/api/text?length=${length}&language=${encodeURIComponent(language)}`,
        );
        data = await res.json();
        if (mounted) setText5(data.text ?? "");
      } catch (e) {
        if (mounted) {
          const text =
            "Ultimately, love is the thread that weaves meaning into the fabric of human existence. It is the force that inspires art, music, poetry, and countless acts of kindness. It gives depth to our joys and softens the pain of our sorrows. To love and to be loved is to touch something beyond ourselves, to experience a connection that affirms our shared humanity. It is both a refuge and a challenge, a constant invitation to grow, to forgive, and to embrace life in all its beauty and complexity. In every sense, love is the heartbeat of our existence, quietly persistent, endlessly patient, and infinitely transformative.";
          setText0(text);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchText();
    return () => {
      mounted = false;
    };
  }, [length, language]);

  // speak text
  useEffect(() => {
    const text = text0;
    if (text && !loading && selectedVoice) {
      const utter = new SpeechSynthesisUtterance(text);
      utter.voice = selectedVoice;
      utter.lang = language;
      utter.pitch = 1;
      utter.rate = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
    }
  }, [text0, selectedVoice, language]);

  const handleReplay = () => {
    if (!text0) return;
    const utter = new SpeechSynthesisUtterance(text0);
    utter.voice = selectedVoice ?? null;
    utter.lang = language;
    utter.rate = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Fullscreen SVG */}
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* 6 distinctive spirals */}
        <Spiral svgRef={svgRef} text={text0} />
        <Spiral svgRef={svgRef} text={text1} />
        <Spiral svgRef={svgRef} text={text2} />
        <Spiral svgRef={svgRef} text={text3} />
        <Spiral svgRef={svgRef} text={text4} />
        <Spiral svgRef={svgRef} text={text5} />
      </svg>

      <div className="absolute bottom-5 right-5 flex items-center gap-2 text-sm font-medium text-white">
        <label className="text-gray-300">
          Length:
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="ml-2 w-24 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white"
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

        <div className="bg-white/10 px-3 py-1.5 rounded-md backdrop-blur-sm">
          {loading ? "Loading" : "Loaded"}
        </div>
        <button
          onClick={() => handleReplay()}
          className="bg-white/10 border border-white/20 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition"
        >
          Replay
        </button>
      </div>
    </div>
  );
}
