"use client";

import { Suspense } from "react";
import { useEffect, useRef, useState } from "react";
import Spiral from "@/app/ui/spiral-dev";

export default function Home() {
  const [text, setText] = useState<string>("");
  const [length, setLength] = useState<number>(1000);
  const [maxR, setMaxR] = useState<number>(250);
  const [turns, setTurns] = useState<number>(6);
  const [startOffset, setStartOffset] = useState<number>(10);
  const [initialFontSize, setInitialFontSize] = useState<number>(1.0);
  const [opacityRate, setOpacityRate] = useState<number>(1.0);

  const svgRef = useRef<any>(null);
  const config = {
    pointsPerTurn: 240,
    rConstant: 10,
    textSliceBase: 1000,
    typeSpeed: 1, // in ms
  };

  // fetch text from API
  useEffect(() => {
    async function fetchText() {
      let res = null;
      let data: { text: any } | null = null;
      try {
        res = await fetch(`/api/text?length=${length}`);
        data = await res.json();
        if (data) {
          // @ts-ignore
          setText(data.text ?? "");
        }
      } catch (e) {
        const text =
          "Ultimately, love is the thread that weaves meaning into the fabric of human existence. It is the force that inspires art, music, poetry, and countless acts of kindness. It gives depth to our joys and softens the pain of our sorrows. To love and to be loved is to touch something beyond ourselves, to experience a connection that affirms our shared humanity. It is both a refuge and a challenge, a constant invitation to grow, to forgive, and to embrace life in all its beauty and complexity. In every sense, love is the heartbeat of our existence, quietly persistent, endlessly patient, and infinitely transformative.";
        setText(text);
      }
    }
    fetchText();
  }, [length]);

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
          <Spiral
            config={config}
            text={text}
            length={length}
            svgRef={svgRef}
            maxR={maxR}
            turns={turns}
            startOffset={startOffset}
            initialFontSize={initialFontSize}
            opacityRate={opacityRate}
          />
        </svg>
      </Suspense>
      <div className="absolute bottom-5 right-5 flex items-center gap-2 text-sm font-medium text-white">
        <label className="text-gray-300">startOffset: {startOffset}</label>
        <input
          type="range"
          value={startOffset}
          max={100}
          min={0}
          step={1}
          onChange={(e) => {
            setStartOffset(Number(e.target.value));
          }}
          className="ml-2 w-24 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white"
        />

        <label className="text-gray-300">turns: {turns}</label>
        <input
          type="range"
          value={turns}
          max={20}
          min={1}
          step={1}
          onChange={(e) => {
            setTurns(Number(e.target.value));
          }}
          className="ml-2 w-24 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white"
        />

        <label className="text-gray-300">maxR: {maxR}</label>
        <input
          type="range"
          value={maxR}
          max={500}
          min={200}
          step={10}
          onChange={(e) => {
            setMaxR(Number(e.target.value));
          }}
          className="ml-2 w-24 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white"
        />

        <label className="text-gray-300">opacityRate: {opacityRate}</label>
        <input
          type="range"
          value={opacityRate}
          max={10}
          min={1}
          step={0.1}
          onChange={(e) => {
            setOpacityRate(Number(e.target.value));
          }}
          className="ml-2 w-24 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white"
        />

        <label className="text-gray-300">
          initialFontSize: {initialFontSize}
        </label>
        <input
          type="range"
          value={initialFontSize}
          max={1.5}
          min={0.0}
          step={0.01}
          onChange={(e) => {
            setInitialFontSize(Number(e.target.value));
          }}
          className="ml-2 w-24 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white"
        />

        <label className="text-gray-300">Length: {length}</label>
        <input
          type="range"
          value={length}
          max={6000}
          min={100}
          step={100}
          onChange={(e) => setLength(Number(e.target.value))}
          className="ml-2 w-24 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white"
        />
      </div>
    </div>
  );
}
