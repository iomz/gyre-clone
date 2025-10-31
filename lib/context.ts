import { createContext } from "react";

export const SpiralContext = createContext({
  cutoffFontSize: 0.2,
  cutoffRRatio: 1 / 5 / 2, // of window height
  cXMax: 70,
  cXMin: 30,
  cYMax: 55,
  cYMin: 45,
  fontMax: 1.0, // in em
  fontMin: 0.5, // in em
  fontScaleConstant: 1.25,
  japaneseSizeAdjust: 0.8,
  jitter: 30,
  numberOfSpirals: 2,
  opacityConstant: 0.9,
  pointsPerTurn: 240,
  rMaxRatio: 9 / 5 / 2, // of window height
  rMinRatio: 7 / 10 / 2, // of window height
  speechInterval: 10000,
  speechPitch: 0.8,
  speechRate: 0.9,
  spiralMax: 30,
  startOffsetMax: 15,
  turnMax: 10,
  turnMin: 4,
  typeSpeed: 50, // in ms
});

export const TriggerContext = createContext<(msg: string) => void>(() => {});
