"use client";

import { useEffect, useState } from "react";
import Config from "@/app/lib/config";
import Word from "@/app/ui/word";

export default function Typewriter({
  config,
  words,
  initialFontSize,
  rdn,
}: {
  config: Config;
  words: string[];
  initialFontSize: number;
  rdn: number;
}) {
  const [index, setIndex] = useState(0);
  const [pairs, setPairs] = useState<any>([]);

  const addWord = (w: string, fontSize: string, opacity: number) => {
    setPairs([...pairs, { w: w, fontSize: fontSize, opacity: opacity }]);
  };

  useEffect(() => {
    if (index < words.length) {
      const timer = setTimeout(() => {
        for (let i = 0; i < index + 1; i++) {
          const fontSize = (1 - i / words.length) * initialFontSize;
          const opacity = 1 - i / words.length;
          addWord(words[i], `${fontSize}em`, opacity);
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
          <Word w={p.w} fontSize={p.fontSize} opacity={p.opacity} key={i} />
        ))
      }
    </>
  );
}
