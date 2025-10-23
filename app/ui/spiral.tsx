"use client";

import { useEffect, useRef, useState, RefObject } from "react";
import { Center, Config } from "@/app/lib/types";

export default function Spiral({
  svgRef,
  config,
  center,
  text,
}: {
  svgRef: RefObject<any>;
  config: Config;
  center: Center;
  text: string;
}) {
  const [startOffset, setStartOffset] = useState<number>(10);
  const [initialFontSize, setInitialFontSize] = useState<number>(1);
  const [pathId, setPathId] = useState<string>("");
  const [circumference, setCircumference] = useState<number>(0);
  const [index, setIndex] = useState(0);
  const pathRef = useRef<any>(null);
  const textPathRef = useRef<any>(null);

  const addChar = (
    textPathRef: RefObject<SVGTextPathElement>,
    w: string,
    fontSize: number,
    opacity: number = 0,
  ) => {
    const tspan = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "tspan",
    );
    tspan.style.fontSize = `${fontSize}em`;
    tspan.style.opacity = `${opacity}`;
    tspan.textContent = w === " " ? "\u00A0" : w;
    textPathRef.current?.appendChild(tspan);
  };

  const buildClockwiseSpiral = (
    center: Center,
    turns: number,
    maxR: number,
    cutoffR: number,
    startOffset: number,
  ) => {
    const thetaMax = Math.PI * 2 * turns;
    const b = maxR / thetaMax;

    const pts = [];
    const totalPoints = config.pointsPerTurn * turns;

    for (let i = 0; i <= totalPoints; i++) {
      const t = i / totalPoints;
      const theta = t * thetaMax;
      const r = b * theta;
      if (r < cutoffR) {
        continue;
      }
      const x = center.x + r * Math.cos(theta);
      const y = center.y - r * Math.sin(theta); // clockwise
      pts.push([x, y]);
    }

    setCircumference(Math.floor(((100 - startOffset) / 100) * pts.length));
    pts.reverse(); // draw inward

    let d = "";
    for (let i = 0; i < pts.length; i++) {
      const [x, y] = pts[i];
      d += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
    }
    return d;
  };

  /* set up the spiral
   * text -> the text to display
   * center -> the center of the spiral
   *
   * */
  useEffect(() => {
    // fetch the spiral svg+path ref objects
    const svg = svgRef.current;
    const path = pathRef.current;
    if (!svg || !path) return;

    // TODO: remove the spiral

    // randomize the center
    const xJitter = Math.floor(Math.random() * config.jitter) - config.jitter;
    const yJitter = Math.floor(Math.random() * config.jitter) - config.jitter;
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

    // randomize the turns
    const turns =
      Math.floor(Math.random() * (config.turnMax - config.turnMin)) +
      config.turnMin;

    // randomize the maximum r of the spiral
    const maxR =
      Math.floor(Math.random() * (config.rMax - config.rMin)) + config.rMin;

    // randomize the start percentage of the spiral path
    setStartOffset(
      Math.floor(
        Math.random() * (config.startOffsetMax - config.startOffsetMin),
      ) + config.startOffsetMin,
    );

    // randomize the initial font size
    setInitialFontSize(
      Math.random() * (config.fontMax - config.fontMin) + config.fontMin,
    );

    // generate the d for the spiral
    const d = buildClockwiseSpiral(
      spiralCenter,
      turns,
      maxR,
      config.cutoffR,
      startOffset,
    );
    path.setAttribute("d", d);

    const textEl = textPathRef.current;
    if (!path || !textEl) {
      return;
    }

    // set a unique id for the path
    setPathId(Math.random().toString(36).replace("0.", ""));
  }, [text, center]);

  /* populate the tspans along the spiral path
   * circumference -> the perimeter of the spiral calculated during the build
   *
   * */
  useEffect(() => {
    const tspans = textPathRef.current.children;
    if (tspans.length > 0) {
      return;
    }
    if (circumference == 0) {
      return;
    }
    // populate the spiral text
    for (let index = 0; index < text.length; index++) {
      if (index > circumference) {
        break;
      }
      const fontSize = (1 - index / circumference) * initialFontSize;
      addChar(textPathRef, text[index], fontSize);
    }
    setIndex(0);
  }, [text, initialFontSize, circumference]);

  /* set the opacity to realize the typewriter effect
   * index -> used for the timer
   *
   * */
  useEffect(() => {
    const tspans = textPathRef.current.children;
    //console.log(circumference, tspans.length, index);
    if (
      circumference == 0 ||
      tspans.length < 2 ||
      index > tspans.length ||
      index > circumference ||
      index < 0
    ) {
      return;
    }
    const timer = setTimeout(() => {
      const opacity = 1 - index / tspans.length;
      tspans[index].style.opacity = `${opacity}`;
      setIndex(index + 1);
    }, config.typeSpeed);
    return () => clearTimeout(timer);
  }, [index, circumference]);

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
