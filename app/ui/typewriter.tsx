"use client";

import { useEffect, useState } from "react";
import TSpan from "@/app/ui/tspan";

export default function Typewriter({
  words,
  scaleConstant,
  typeSpeed,
}: {
  words: string[];
  scaleConstant: number;
  typeSpeed: number;
}) {
  const [index, setIndex] = useState(0);
  const [pairs, setPairs] = useState<any>([]);

  const addTspan = (w: string, scale: number) => {
    setPairs([...pairs, { w: w, scale: scale }]);
  };

  useEffect(() => {
    if (index < words.length) {
      const timer = setTimeout(() => {
        for (let i = 0; i < index + 1; i++) {
          const scale = 1 - (i / words.length) * scaleConstant;
          addTspan(words[i], scale);
        }
        setIndex(index + 1);
      }, typeSpeed);
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
