"use client";

import { useEffect, useRef, useState, RefObject } from "react";
import Config from "@/app/lib/config";
import Typewriter from "@/app/ui/typewriter";

export default function Spiral({
  config,
  text,
  svgRef,
  cx,
  cy,
  rdn,
}: {
  config: Config;
  text: string;
  svgRef: RefObject<any>;
  cx: number;
  cy: number;
  rdn: number;
}) {
  const [startOffset, setStartOffset] = useState("10%");
  const [initialFontSize, setInitialFontSize] = useState(1);
  const [words, setWords] = useState<string[]>([]);
  const [pathId, setPathId] = useState("");
  const pathRef = useRef<any>(null);
  const textPathRef = useRef<any>(null);

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

    const center = {
      x: cx * (width / 100) + xJitter,
      y: cy * (height / 100) + yJitter,
    };

    const d = buildClockwiseSpiral(r, center);
    path.setAttribute("d", d);
  };

  const animate = () => {
    // remove this spiral

    /* This section decides the random factors */
    // the start percentage of the spiral path
    setStartOffset(
      `${Math.floor(Math.random() * config.startOffsetMax) + config.startOffsetMin}%`,
    );
    // the r of the spiral
    const r =
      Math.floor(Math.random() * (config.rMax - config.rMin)) + config.rMin;
    // the length of the text to be rendered
    const textSlice = config.textSliceBase + config.rConstant * r;
    // the jitter of the center position of the spiral
    const xJitter = Math.floor(Math.random() * config.jitter) - config.jitter;
    const yJitter = Math.floor(Math.random() * config.jitter) - config.jitter;
    // the initial font size
    setInitialFontSize(
      Math.floor(Math.random() + config.fontMax - config.fontMin) +
        config.fontMin,
    );

    drawSpiral(r, xJitter, yJitter);
    setWords(text.slice(0, textSlice).split(" "));

    const path = pathRef.current;
    const textEl = textPathRef.current;
    if (!path || !textEl) return;

    setPathId(Math.random().toString(36).replace("0.", ""));
  };

  useEffect(() => {
    // console.log(cx, cy); // somehow this runs twice as expected
    animate();
  }, [text, cx, cy, config]);

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
          startOffset={startOffset}
          ref={textPathRef}
          style={{ opacity: 1 }}
        >
          <Typewriter
            config={config}
            words={words}
            initialFontSize={initialFontSize}
            rdn={rdn}
          />
        </textPath>
      </text>
    </>
  );
}
