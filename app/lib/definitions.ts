import { createContext } from "react";

export interface Center {
  x: number;
  y: number;
}

export interface Config {
  cutoffR: number;
  cXMax: number;
  cXMin: number;
  cYMax: number;
  cYMin: number;
  fontMax: number;
  fontMin: number;
  jitter: number;
  numberOfSpirals: number;
  pointsPerTurn: number;
  rMax: number;
  rMin: number;
  startOffsetMax: number;
  startOffsetMin: number;
  turnMax: number;
  turnMin: number;
  typeSpeed: number;
}

export interface ConfigDev {
  pointsPerTurn: number;
  typeSpeed: number;
}

export const CenterContext = createContext({
  x: 0,
  y: 0,
});

export const SpiralContext = createContext({
  cutoffR: 80,
  cXMax: 75,
  cXMin: 25,
  cYMax: 55,
  cYMin: 45,
  fontMax: 1.0, // in em
  fontMin: 0.3, // in em
  jitter: 30,
  numberOfSpirals: 2,
  pointsPerTurn: 240,
  rMax: 400,
  rMin: 150,
  startOffsetMax: 15,
  startOffsetMin: 0,
  turnMax: 12,
  turnMin: 6,
  typeSpeed: 50, // in ms
});
