"use client";

import { useEffect, useRef, useState, RefObject } from "react";
import { Center, ConfigDev } from "@/app/lib/definitions";

export default function Spiral({
  config,
  text,
  svgRef,
  maxR,
  turns,
  startOffset,
  initialFontSize,
  cutoffR,
}: {
  config: ConfigDev;
  text: string;
  svgRef: RefObject<SVGSVGElement | null>;
  maxR: number;
  turns: number;
  startOffset: number;
  initialFontSize: number;
  cutoffR: number;
}) {
  const [pathId, setPathId] = useState<string>("");
  const [circumference, setCircumference] = useState<number>(0);
  const [index, setIndex] = useState<number>(-1);
  const [length, setLength] = useState<number>(0);
  const pathRef = useRef<SVGPathElement>(null);
  const textPathRef = useRef<SVGTextPathElement>(null);

  const addTspan = (w: string, fontSize: number, opacity: number = 0) => {
    const tspan = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "tspan",
    );
    tspan.style.fontSize = `${fontSize}em`;
    tspan.style.opacity = `${opacity}`;
    tspan.textContent = w === " " ? "\u00A0" : w;
    textPathRef.current?.appendChild(tspan);
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
    /* get the svg and path ref */
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

    const textEl = textPathRef.current;
    if (!path || !textEl) return;

    // set a unique id for the path
    setPathId(Math.random().toString(36).replace("0.", ""));
  }, [text, maxR, turns, startOffset, initialFontSize, cutoffR]);

  /* populate the tspans along the spiral path
   * circumference -> the perimeter of the spiral calculated during the build
   *
   * */
  useEffect(() => {
    const tspans = textPathRef.current.children;
    if (tspans.length > 0) {
      return;
    }
    // populate the spiral text
    let cumulativeLength = 0;
    for (let index = 0; index < text.length; index++) {
      if (cumulativeLength > circumference) {
        break;
      }
      const fontSize = (1 - cumulativeLength / circumference) * initialFontSize;
      cumulativeLength += (fontSize * Math.PI) / 2;
      addTspan(text[index], fontSize);
      setIndex(0);
    }
  }, [text, initialFontSize, circumference]);

  /* set the opacity to realize the typewriter effect
   * index -> used for the timer
   *
   * */
  useEffect(() => {
    // set the opacity for each character for typewriter effect
    const tspans = textPathRef.current.children;
    console.log(tspans.length, length, circumference);
    if (
      tspans.length == 0 ||
      length > tspans.length ||
      length > circumference ||
      index < 0
    ) {
      return;
    }
    const timer = setTimeout(() => {
      const fontSize = (1 - length / circumference) * initialFontSize;
      setLength(length + (fontSize * Math.PI) / 2);
      const opacity = 1 - length / circumference;
      tspans[index].style.fontSize = `${fontSize}em`;
      tspans[index].style.opacity = `${opacity}`;
      setIndex(index + 1);
    }, config.typeSpeed);
    return () => clearTimeout(timer);
  }, [index]);

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
