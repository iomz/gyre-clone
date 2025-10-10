export default function Word({
  w,
  fontSize,
  opacity,
}: {
  w: string;
  fontSize: number;
  opacity: number;
}) {
  return (
    <tspan
      style={{
        fontSize: `${fontSize}`,
        opacity: `${opacity}`,
      }}
    >
      {w === " " ? "\u00A0" : w + "\u00A0"}
    </tspan>
  );
}
