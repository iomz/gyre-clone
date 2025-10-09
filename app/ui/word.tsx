export default function Word({
  w,
  scale,
  fontSizeConstant,
}: {
  w: string;
  scale: number;
  fontSizeConstant: number;
}) {
  return (
    <tspan
      style={{
        fontSize: `${fontSizeConstant * scale}em`,
        opacity: `${scale}`,
      }}
    >
      {w === " " ? "\u00A0" : w + "\u00A0"}
    </tspan>
  );
}
