export default function Char({
  w,
  fontSize,
  opacity = 0,
}: {
  w: string;
  fontSize: number;
  opacity: number;
}) {
  return (
    <tspan
      style={{
        fontSize: `${fontSize}em`,
        opacity: `${opacity}`,
      }}
    >
      {w === " " ? "\u00A0" : w}
    </tspan>
  );
}
