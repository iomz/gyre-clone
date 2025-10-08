"use client";

import { useEffect, useState } from "react";
import Word from "@/app/ui/word";

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

  const addWord = (w: string, scale: number) => {
    setPairs([...pairs, { w: w, scale: scale }]);
  };

  useEffect(() => {
    if (index < words.length) {
      const timer = setTimeout(() => {
        for (let i = 0; i < index + 1; i++) {
          const scale = 1 - (i / words.length) * scaleConstant;
          addWord(words[i], scale);
        }
        setIndex(index + 1);
      }, typeSpeed);
      return () => clearTimeout(timer);
    } else if (index == words.length) {
      console.log("typing finished.");
    }
  }, [index, words]);

  return (
    <>
      {
        // @ts-ignore
        pairs.map((p, i) => (
          <Word w={p.w} scale={p.scale} key={i} />
        ))
      }
    </>
  );
}
