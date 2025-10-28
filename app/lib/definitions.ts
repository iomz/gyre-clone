import { createContext } from "react";

export interface Center {
  x: number;
  y: number;
}

export interface CharData {
  w: string;
  fontSize: number;
  opacity: number;
}

export interface ConfigDev {
  pointsPerTurn: number;
  typeSpeed: number;
}

export const SpiralContext = createContext({
  cutoffFontSize: 0.2,
  cutoffR: 40,
  cXMax: 70,
  cXMin: 30,
  cYMax: 55,
  cYMin: 45,
  fontMax: 1.0, // in em
  fontMin: 0.5, // in em
  fontScaleConstant: 1.25,
  jitter: 30,
  numberOfSpirals: 2,
  opacityConstant: 0.8,
  pointsPerTurn: 240,
  rMax: 400,
  rMin: 200,
  startOffsetMax: 15,
  startOffsetMin: 0,
  turnMax: 10,
  turnMin: 4,
  typeSpeed: 1, // in ms
});

export const TriggerContext = createContext<(msg: string) => void>(() => {});
