export default function Word({ w, scale }: { w: string; scale: number }) {
  return (
    <tspan
      style={{
        fontSize: `${scale}em`,
        opacity: `${scale}`,
      }}
    >
      {w === " " ? "\u00A0" : w + "\u00A0"}
    </tspan>
  );
}
