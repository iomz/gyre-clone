export interface Center {
  x: number;
  y: number;
}

export interface Config {
  cXMax: number;
  cXMin: number;
  cYMax: number;
  cYMin: number;
  fadeoutRate: number;
  fadeoutSpeed: number;
  fontMax: number;
  fontMin: number;
  jitter: number;
  pointsPerTurn: number;
  rConstant: number;
  rMax: number;
  rMin: number;
  startOffsetMax: number;
  startOffsetMin: number;
  textSliceBase: number;
  turnMax: number;
  turnMin: number;
  typeSpeed: number;
}

export interface ConfigDev {
  pointsPerTurn: number;
  rConstant: number;
  textSliceBase: number;
  typeSpeed: number;
}
