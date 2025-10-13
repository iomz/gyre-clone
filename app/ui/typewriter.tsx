"use client";

import { useEffect, useState } from "react";
import { Config } from "@/app/lib/types";
import Word from "@/app/ui/word";

export default function Typewriter({
  config,
  text,
  initialFontSize,
}: {
  config: Config;
  text: string;
  initialFontSize: number;
}) {
  const [index, setIndex] = useState(0);
  const [opacityRate, setOpacityRate] = useState(1);
  const [pairs, setPairs] = useState<any>([]);

  const addWord = (w: string, fontSize: string, opacity: number) => {
    setPairs([...pairs, { w: w, fontSize: fontSize, opacity: opacity }]);
  };

  useEffect(() => {
    if (index < text.length) {
      /* draw each word */
      const timer = setTimeout(() => {
        const fontSize = (1 - index / text.length) * initialFontSize;
        const opacity = 1 - index / text.length;
        addWord(text[index], `${fontSize}em`, opacity);
        setIndex(index + 1);
      }, config.typeSpeed);
      return () => clearTimeout(timer);
    } else if (index == text.length && index != 0 && opacityRate > 0) {
      /* fade out the text after finished typing */
      const timer = setTimeout(() => {
        const newOpacityRate = opacityRate - config.fadeoutRate;
        setOpacityRate(newOpacityRate);
      }, config.fadeoutSpeed);
      return () => clearTimeout(timer);
    }
  }, [index, opacityRate, text]);

  return (
    <>
      {
        // @ts-ignore
        pairs.map((p, i) => (
          <Word
            w={p.w}
            fontSize={p.fontSize}
            opacity={p.opacity * opacityRate}
            key={i}
          />
        ))
      }
    </>
  );
}
