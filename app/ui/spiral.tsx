"use client";

import { useEffect, useRef, useState, RefObject } from "react";
import { Center, Config } from "@/app/lib/types";
import Typewriter from "@/app/ui/typewriter";

export default function Spiral({
  config,
  text,
  svgRef,
  center,
  delay,
}: {
  config: Config;
  text: string;
  svgRef: RefObject<any>;
  center: Center;
  delay: number;
}) {
  const [startOffset, setStartOffset] = useState<string>("10%");
  const [initialFontSize, setInitialFontSize] = useState<number>(1);
  const [pathId, setPathId] = useState<string>("");
  const [slicedText, setSlicedText] = useState<string>("");
  const pathRef = useRef<any>(null);
  const textPathRef = useRef<any>(null);

  const buildClockwiseSpiral = (r: number, center: Center) => {
    const maxR = r;
    const turns =
      Math.floor(Math.random() * (config.turnMax - config.turnMin)) +
      config.turnMin;
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
      Math.random() * (config.fontMax - config.fontMin) + config.fontMin,
    );

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
      x: center.x * (width / 100) + xJitter,
      y: center.y * (height / 100) + yJitter,
    };

    // generate the d for the spiral
    const d = buildClockwiseSpiral(r, spiralCenter);
    path.setAttribute("d", d);

    /* build the text to be displayed */
    //setWords(text.slice(0, textSlice).split(" "));
    setSlicedText(text.slice(0, textSlice));

    const textEl = textPathRef.current;
    if (!path || !textEl) return;

    // set a unique id for the path
    setPathId(Math.random().toString(36).replace("0.", ""));
  };

  useEffect(() => {
    const t = setTimeout(() => {
      animate();
    }, delay);
    // cleanup
    return () => clearTimeout(t);
  }, [text, center]);

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
            text={slicedText}
            initialFontSize={initialFontSize}
          />
        </textPath>
      </text>
    </>
  );
}
