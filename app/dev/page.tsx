"use client";

import { Suspense } from "react";
import { useEffect, useRef, useState } from "react";
import SpiralDev from "@/components/functional/SpiralDev";
import { fetchSpiralText } from "@/utils/fetch";

export default function Home() {
  const [text, setText] = useState<string | undefined>("");
  const [maxR, setMaxR] = useState<number>(250);
  const [turns, setTurns] = useState<number>(6);
  const [startOffset, setStartOffset] = useState<number>(10);
  const [initialFontSize, setInitialFontSize] = useState<number>(1.0);
  const [cutoffR, setCutoffR] = useState<number>(80);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const handleSpawn = async () => {
    const output = await fetchSpiralText("ja-JP", "love", 5);
    setText(output);
  };

  useEffect(() => {
    handleSpawn();
  }, []);

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
          <SpiralDev
            text={text}
            svgRef={svgRef}
            maxR={maxR}
            turns={turns}
            startOffset={startOffset}
            initialFontSize={initialFontSize}
            cutoffR={cutoffR}
          />
        </svg>
      </Suspense>
      <div className="absolute bottom-5 right-5 flex items-center gap-2 text-sm font-medium text-white">
        <label className="text-gray-300">cutoffR: {cutoffR}</label>
        <input
          type="range"
          value={cutoffR}
          max={300}
          min={0}
          step={10}
          onChange={(e) => {
            setCutoffR(Number(e.target.value));
          }}
          className="ml-2 w-24 px-2 py-1 bg-gray-800 border border-gray-600 rounded text-white"
        />

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
      </div>
    </div>
  );
}
