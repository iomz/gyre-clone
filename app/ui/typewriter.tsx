"use client";

import { useEffect, useState } from "react";
import TSpan from "@/app/ui/tspan";

export default function Typewriter({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);
  const [pairs, setPairs] = useState<any>([]);

  const addTspan = (w: string, scale: number) => {
    setPairs([...pairs, { w: w, scale: scale }]);
  };

  useEffect(() => {
    if (index < words.length) {
      const timer = setTimeout(() => {
        for (let i = 0; i < index + 1; i++) {
          const scale = 1 - (i / words.length) * 0.8; // from 1 → 0.7
          addTspan(words[i], scale);
        }
        setIndex(index + 1);
      }, 50); // typing speed in ms
      return () => clearTimeout(timer);
    }
  }, [index, words]);

  return (
    <>
      {
        // @ts-ignore
        pairs.map((p, i) => (
          <TSpan w={p.w} scale={p.scale} key={i} />
        ))
      }
    </>
  );
}
