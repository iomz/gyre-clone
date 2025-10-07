"use client";

import { useEffect, useRef, useState, RefObject } from "react";
import TSpan from "@/app/ui/tspan";

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

  const config = {
    turns: 15,
    pointsPerTurn: 240,
    start: "gyre", // "center", "top-left", "top-right", "bottom-left", "bottom-right"
  };

  const pathRef = useRef<any>(null);
  const textRef = useRef<any>(null);

  const buildClockwiseSpiral = (
    r: number,
    center: { x: number; y: number },
  ) => {
    console.log(center);

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

    const center = { x: (3 * width) / 5 + xJitter, y: height / 2 + yJitter };
    console.log(center);

    const d = buildClockwiseSpiral(r, center);
    path.setAttribute("d", d);
  };

  useEffect(() => {
    /* This section decides the random factors */
    setStartOffset(`${Math.floor(Math.random() * 15) + 10}%`); // [10, 25]%
    const r = Math.floor(Math.random() * 600) + 200; // [200, 800]
    const textSlice = 800 + 5 * r; // this determines the density and the swirl center
    const xJitter = Math.floor(Math.random() * 10) - 10;
    const yJitter = Math.floor(Math.random() * 10) - 10;

    drawSpiral(r, xJitter, yJitter);
    setWords(text.slice(0, textSlice).split(" "));

    const path = pathRef.current;
    const textEl = textRef.current;
    if (!path || !textEl) return;

    setPathId(Math.random().toString(36).replace("0.", ""));

    console.log(`r: ${r}, text.length: ${textSlice}`);
  }, []);

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
          ref={textRef}
          style={{ opacity: 1 }}
        >
          <TSpan words={words} />
        </textPath>
      </text>
    </>
  );
}
