export default function TSpan({ w, scale }: { w: string; scale: number }) {
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
