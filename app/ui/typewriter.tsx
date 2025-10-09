"use client";

import { useEffect, useState } from "react";
import Config from "@/components/config";
import Word from "@/app/ui/word";

export default function Typewriter({
  config,
  words,
  rdn,
}: {
  config: Config;
  words: string[];
  rdn: number;
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
          const scale = 1 - (i / words.length) * config.scaleConstant;
          addWord(words[i], scale);
        }
        setIndex(index + 1);
      }, config.typeSpeed);
      return () => clearTimeout(timer);
    }
  }, [index, words]);

  useEffect(() => {
    setIndex(0);
    setPairs([]);
  }, [rdn]);

  return (
    <>
      {
        // @ts-ignore
        pairs.map((p, i) => (
          <Word
            w={p.w}
            scale={p.scale}
            fontSizeConstant={config.fontSizeConstant}
            key={i}
          />
        ))
      }
    </>
  );
}
