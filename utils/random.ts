export function randomIntRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function generateRandomId(): string {
  return Math.random().toString(36).replace("0.", "");
}
