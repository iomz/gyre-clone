"use client";

import { useEffect, useRef } from "react";

interface SpiralOffset {
  x: number;
  y: number;
}

interface Spiral {
  img: HTMLCanvasElement;
  w: number;
  h: number;
  rotation: number;
  offset: SpiralOffset;
  baseSpeed: number;
  timeOffset: number;
}

interface SpiralImageParams {
  maxRadius: number;
  spacing: number;
  turns: number;
  strokeWidth: number;
}

export default function SpiralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const SUPER_DPI = 2.0;
    const dpi = (window.devicePixelRatio || 1) * SUPER_DPI;

    let W = 0,
      H = 0,
      cx = 0,
      cy = 0;

    const SPIRAL_COUNT = 7;
    const CENTER_HOLE_RADIUS = 150;
    const spirals: Spiral[] = [];

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;

      canvas.width = W * dpi;
      canvas.height = H * dpi;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;

      ctx.setTransform(dpi, 0, 0, dpi, 0, 0);

      cx = W / 2;
      cy = H / 2;
    }

    function generateSpirals() {
      spirals.length = 0;
      const maxRadius = Math.max(W, H) * 0.9;

      for (let i = 0; i < SPIRAL_COUNT; i++) {
        const turns = Math.random() * 8 + 7;
        const spacing = maxRadius / (turns * 2 * Math.PI);
        const strokeWidth = Math.random() * 0.8 + 0.2;

        // Animation dynamics
        const baseSpeed = -(Math.random() * 0.4 + 0.15); // clockwise
        const timeOffset = Math.random() * 1000;

        const offset = {
          x: (Math.random() - 0.5) * 60,
          y: (Math.random() - 0.5) * 60,
        };

        const spiralImage = createSpiralImage({
          maxRadius,
          spacing,
          turns,
          strokeWidth,
        });

        spirals.push({
          img: spiralImage.canvas,
          w: spiralImage.w,
          h: spiralImage.h,
          rotation: Math.random() * Math.PI * 2,
          offset,
          baseSpeed,
          timeOffset,
        });
      }
    }

    function createSpiralImage({
      maxRadius,
      spacing,
      turns,
      strokeWidth,
    }: SpiralImageParams) {
      const size = maxRadius * 2 + strokeWidth * 4;
      const off = document.createElement("canvas");

      off.width = size * dpi;
      off.height = size * dpi;

      const octx = off.getContext("2d")!;
      octx.scale(dpi, dpi);
      octx.translate(size / 2, size / 2);

      const totalTheta = turns * Math.PI * 2;

      octx.lineCap = "round";
      octx.lineWidth = strokeWidth;

      octx.beginPath();
      for (let theta = 0; theta < totalTheta; theta += 0.05) {
        const r = spacing * theta;
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);

        const t = r / maxRadius;
        const opacity = Math.pow(t, 3);

        octx.strokeStyle = `rgba(255,255,255,${opacity})`;

        if (r < CENTER_HOLE_RADIUS) continue;

        if (theta === 0) octx.moveTo(x, y);
        else octx.lineTo(x, y);
      }
      octx.stroke();

      return { canvas: off, w: size, h: size };
    }

    function animate(time: number) {
      ctx.clearRect(0, 0, W, H);

      for (const s of spirals) {
        const ease = 0.06 + Math.sin((time + s.timeOffset) * 0.0004) * 0.04;

        s.rotation += s.baseSpeed * ease;

        ctx.save();
        ctx.translate(cx + s.offset.x, cy + s.offset.y);
        ctx.rotate(s.rotation);
        ctx.drawImage(s.img, -s.w / 2, -s.h / 2, s.w, s.h);
        ctx.restore();
      }

      // ctx.fillStyle = "gray";
      // ctx.beginPath();
      // ctx.arc(cx, cy, CENTER_HOLE_RADIUS, 0, Math.PI * 2);
      // ctx.fill();

      requestAnimationFrame(animate);
    }

    resize();
    generateSpirals();
    requestAnimationFrame(animate);

    window.addEventListener("resize", () => {
      resize();
      generateSpirals();
    });

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}
