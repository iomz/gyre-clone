"use client";

import { useEffect, useRef, useState, RefObject } from "react";
import Typewriter from "@/app/ui/typewriter";

export default function Spiral({
  text,
  svgRef,
}: {
  text: string;
  svgRef: RefObject<any>;
}) {
  const [startOffset, setStartOffset] = useState("10%");
  const [words, setWords] = useState(["test"]);
  const [pathId, setPathId] = useState("test");
  const pathRef = useRef<any>(null);
  const textPathRef = useRef<any>(null);

  const config = {
    jitter: 50,
    pointsPerTurn: 240,
    rMax: 800,
    rMin: 300,
    scaleConstant: 0.8, // from 1 -> 0.8
    start: "gyre", // "center", "top-left", "top-right", "bottom-left", "bottom-right"
    startOffsetMax: 30,
    startOffsetMin: 0,
    textSliceBase: 900,
    turns: 15,
    typeSpeed: 50, // in ms
  };

  const buildClockwiseSpiral = (
    r: number,
    center: { x: number; y: number },
  ) => {
    const maxR = r;
    const turns = config.turns;
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

  const drawSpiral = async (r: number, xJitter: number, yJitter: number) => {
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!svg || !path) return;

    const vw = window.innerWidth / 2;
    const vh = window.innerHeight / 2;
    svg.setAttribute(
      "viewBox",
      `0 0 ${Math.max(100, vw)} ${Math.max(100, vh)}`,
    );

    const width = parseFloat(svg.viewBox.baseVal.width);
    const height = parseFloat(svg.viewBox.baseVal.height);

    const center = { x: (5 * width) / 7 + xJitter, y: height / 2 + yJitter };

    const d = buildClockwiseSpiral(r, center);
    path.setAttribute("d", d);
  };

  useEffect(() => {
    /* This section decides the random factors */
    setStartOffset(
      `${Math.floor(Math.random() * config.startOffsetMax) + config.startOffsetMin}%`,
    );
    const r = Math.floor(Math.random() * config.rMax) + config.rMin;
    const textSlice = config.textSliceBase + 5 * r;
    const xJitter = Math.floor(Math.random() * config.jitter) - config.jitter;
    const yJitter = Math.floor(Math.random() * config.jitter) - config.jitter;

    drawSpiral(r, xJitter, yJitter);
    setWords(text.slice(0, textSlice).split(" "));

    const path = pathRef.current;
    const textEl = textPathRef.current;
    if (!path || !textEl) return;

    setPathId(Math.random().toString(36).replace("0.", ""));

    //console.log(`r: ${r}, text.length: ${textSlice}`);
  }, [text]);

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

      <text id="spiral-text" className="text-white font-normal">
        <textPath
          href={"#" + pathId}
          startOffset={startOffset}
          ref={textPathRef}
          style={{ opacity: 1 }}
        >
          <Typewriter
            words={words}
            scaleConstant={config.scaleConstant}
            typeSpeed={config.typeSpeed}
          />
        </textPath>
      </text>
    </>
  );
}
