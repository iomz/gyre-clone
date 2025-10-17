"use client";

import { useEffect, useRef, useState, RefObject } from "react";
import { Center, ConfigDev } from "@/app/lib/types";

export default function Spiral({
  config,
  text,
  length,
  svgRef,
  maxR,
  turns,
  startOffset,
  initialFontSize,
  opacityRate,
}: {
  config: ConfigDev;
  text: string;
  length: number;
  svgRef: RefObject<any>;
  maxR: number;
  turns: number;
  startOffset: number;
  initialFontSize: number;
  opacityRate: number;
}) {
  const [pathId, setPathId] = useState<string>("");
  const [slicedText, setSlicedText] = useState<string>("");
  const pathRef = useRef<any>(null);
  const textPathRef = useRef<any>(null);

  const addWord = (w: string, fontSize: number, opacity: number) => {
    const tspan = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "tspan",
    );
    tspan.style.fontSize = `${fontSize}em`;
    tspan.style.opacity = `${opacity}`;
    tspan.textContent = w === " " ? "\u00A0" : w;
    textPathRef.current?.appendChild(tspan);
    //console.log(tspan.textContent);
  };

  const buildClockwiseSpiral = (center: Center) => {
    const thetaMax = Math.PI * 2 * turns;
    const b = maxR / thetaMax;

    const pts = [];
    const totalPoints = config.pointsPerTurn * turns;

    for (let i = 0; i <= totalPoints; i++) {
      const t = i / totalPoints;
      const theta = t * thetaMax;
      const r = b * theta;
      const x = center.x + r * Math.cos(theta);
      const y = center.y - r * Math.sin(theta); // clockwise
      pts.push([x, y]);
    }

    pts.reverse(); // draw inward

    let d = "";
    for (let i = 0; i < pts.length; i++) {
      const [x, y] = pts[i];
      d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }
    return d;
  };

  useEffect(() => {
    /* draw spiral */
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!svg || !path) return;

    // calculate the center
    const vw = window.innerWidth / 2;
    const vh = window.innerHeight / 2;
    svg.setAttribute(
      "viewBox",
      `0 0 ${Math.max(100, vw)} ${Math.max(100, vh)}`,
    );
    const width = parseFloat(svg.viewBox.baseVal.width);
    const height = parseFloat(svg.viewBox.baseVal.height);
    const spiralCenter = {
      x: width / 2,
      y: height / 2,
    };

    // generate the d for the spiral
    const d = buildClockwiseSpiral(spiralCenter);
    path.setAttribute("d", d);

    /* build the text to be displayed */
    //setWords(text.slice(0, textSlice).split(" "));
    setSlicedText(text.slice(0, length));

    const textEl = textPathRef.current;
    if (!path || !textEl) return;

    // set a unique id for the path
    setPathId(Math.random().toString(36).replace("0.", ""));
  }, [text, length, maxR, turns, startOffset, initialFontSize]);

  useEffect(() => {
    for (let index = 0; index < slicedText.length && index < length; index++) {
      const fontSize = (1 - index / slicedText.length) * initialFontSize;
      const opacity = 1 - (index / slicedText.length) * opacityRate;
      addWord(slicedText[index], fontSize, opacity);
    }
  }, [slicedText, length]);

  useEffect(() => {
    const tspans = textPathRef.current.children;
    for (let index = 0; index < tspans.length && index < length; index++) {
      const fontSize = (1 - index / tspans.length) * initialFontSize;
      const opacity = 1 - (index / tspans.length) * opacityRate;
      tspans[index].style.fontSize = `${fontSize}em`;
      tspans[index].style.opacity = `${opacity}`;
    }
  }, [initialFontSize, opacityRate, length]);

  return (
    <>
      <defs>
        <path
          id={pathId}
          ref={pathRef}
          d=""
          className="fill-none"
          style={{
            strokeWidth: 0,
          }}
        />
      </defs>

      <text className="text-white font-normal spiral-text">
        <textPath
          href={"#" + pathId}
          startOffset={`${startOffset}%`}
          ref={textPathRef}
          style={{ opacity: 1 }}
        ></textPath>
      </text>
    </>
  );
}
