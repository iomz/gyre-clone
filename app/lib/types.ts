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
