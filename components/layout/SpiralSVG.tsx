import { RefObject } from "react";

export default function SpiralSVG({
  svgRef,
  language,
  spirals,
}: {
  svgRef: RefObject<SVGSVGElement | null>;
  language: string;
  spirals: React.JSX.Element[];
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      ref={svgRef}
      className="w-full h-full"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* Fullscreen SVG */}
      <style>
        {`
          text {
            font-family: ${language === "ja-JP" ? "noto-serif-jp monospace" : "roboto"};
          }
        `}
      </style>
      {spirals}
    </svg>
  );
}
