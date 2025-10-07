"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export default function Home() {
  const svgRef = useRef<any>(null);
  const pathRef = useRef<any>(null);
  const textRef = useRef<any>(null);

  const [status, setStatus] = useState("Ready");

  const config = {
    turns: 10,
    pointsPerTurn: 240,
    start: "center", // "center", "top-left", "top-right", "bottom-left", "bottom-right"
  };

  const content =
    "Love is the quiet force that binds our lives together, often revealed in the smallest gestures — a gentle word, a patient silence, a hand that stays when everything else feels uncertain. It is the warmth that lingers in the memory of a shared smile, the comfort that comes from knowing someone truly sees you, even in your most flawed moments. Love transcends distance and time, existing in the spaces between words and in the unspoken understanding that two hearts can hold each other even when they are apart. It teaches us empathy, guiding us to feel another’s pain as our own, and patience, as we learn that relationships, like life itself, require care, attention, and gentle tending. \
    Ultimately, love is the thread that weaves meaning into the fabric of human existence. It is the force that inspires art, music, poetry, and countless acts of kindness. It gives depth to our joys and softens the pain of our sorrows. To love and to be loved is to touch something beyond ourselves, to experience a connection that affirms our shared humanity. It is both a refuge and a challenge, a constant invitation to grow, to forgive, and to embrace life in all its beauty and complexity. In every sense, love is the heartbeat of our existence, quietly persistent, endlessly patient, and infinitely transformative.";
  const words = content.split(" ");

  const getStartPosition = (width: number, height: number, margin = 40) => {
    switch (config.start) {
      case "top-left":
        return { cx: margin, cy: margin };
      case "top-right":
        return { cx: width - margin, cy: margin };
      case "bottom-left":
        return { cx: margin, cy: height - margin };
      case "bottom-right":
        return { cx: width - margin, cy: height - margin };
      default:
        return { cx: width / 2, cy: height / 2 };
    }
  };

  const buildClockwiseSpiral = (width: number, height: number) => {
    const margin = Math.max(40, Math.min(width, height) * 0.05);
    const { cx, cy } = getStartPosition(width, height, margin);
    const maxR = Math.min(width, height) / 2 - margin;
    const turns = config.turns;
    const thetaMax = Math.PI * 2 * turns;
    const b = maxR / thetaMax;

    const pts = [];
    const totalPoints = config.pointsPerTurn * turns;

    for (let i = 0; i <= totalPoints; i++) {
      const t = i / totalPoints;
      const theta = t * thetaMax;
      const r = b * theta;
      const x = cx + r * Math.cos(theta);
      const y = cy - r * Math.sin(theta); // clockwise
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

  const drawAnimatedSpiral = async () => {
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

    const d = buildClockwiseSpiral(width, height);
    path.setAttribute("d", d);

    const len = path.getTotalLength();
    path.style.strokeDasharray = len;
    path.style.strokeDashoffset = 0;
    const duration = Math.min(8000, Math.max(2000, Math.round(len * 0.6)));
    path.style.transition = `stroke-dashoffset ${duration}ms linear`;

    setTimeout(() => setStatus("Complete"), duration);
  };

  const handleReplay = () => {
    setStatus("Replaying...");

    setTimeout(() => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(content);
        u.rate = 1;
        window.speechSynthesis.speak(u);
      }
    }, 50);
  };

  useEffect(() => {
    drawAnimatedSpiral();
    const handleResize = () => {
      // @ts-ignore
      clearTimeout(window._resizeTimer);
      // @ts-ignore
      window._resizeTimer = setTimeout(drawAnimatedSpiral, 200);
    };
    window.addEventListener("resize", handleResize);

    const path = pathRef.current;
    const textEl = textRef.current;
    if (!path || !textEl) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    path.getBoundingClientRect();

    //const words = content.trim().split(/\s+/).length;
    //const durationMs = Math.max(3000, words * 350);

    //path.style.transition = `stroke-dashoffset ${durationMs}ms linear`;
    //textEl.style.transition = `opacity ${Math.min(1200, durationMs / 2)}ms ease-out ${durationMs / 6}ms`;

    requestAnimationFrame(() => {
      path.style.strokeDashoffset = "0";
      textEl.style.opacity = "1";
    });

    let utterance;
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      utterance = new SpeechSynthesisUtterance(content);
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      utterance.onend = () => setStatus("Played");
    }

    return () => {
      try {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
        window.removeEventListener("resize", handleResize);
      } catch {}
    };
  }, []);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      {/* Fullscreen SVG */}
      <svg
        ref={svgRef}
        className="w-full h-full"
        viewBox="0 0 800 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <path
            id="spiral"
            ref={pathRef}
            d=""
            className="fill-none stroke-white"
            style={{
              strokeWidth: 0,
            }}
          />
        </defs>
        <use href="#spiral" />
        <text id="spiral-text" className="text-white font-normal">
          <textPath
            href="#spiral"
            startOffset="20%"
            ref={textRef}
            style={{ opacity: 0 }}
          >
            {words.map((c, i) => {
              const scale = 1 - (i / words.length) * 0.7; // from 1 → 0.5
              console.log(scale);
              return (
                <tspan
                  key={i}
                  style={{
                    fontSize: `${scale}em`,
                    opacity: `${scale}`,
                  }}
                >
                  {c === " " ? "\u00A0" : c + "\u00A0"}
                </tspan>
              );
            })}
          </textPath>
        </text>
      </svg>

      <div className="absolute bottom-5 right-5 flex items-center gap-2 text-sm font-medium text-white">
        <div className="bg-white/10 px-3 py-1.5 rounded-md backdrop-blur-sm">
          {status}
        </div>
        <button
          onClick={handleReplay}
          className="bg-white/10 border border-white/20 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition"
        >
          Replay
        </button>
      </div>
    </div>
  );
}
