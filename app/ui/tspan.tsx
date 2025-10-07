export default function TSpan({ words }: { words: string[] }) {
  return (
    <>
      {words.map((c: string, i: number | null | undefined) => {
        if (i == undefined) {
          return;
        }
        const scale = 1 - (i / words.length) * 0.7; // from 1 → 0.5
        return (
          <tspan
            key={i}
            style={{
              fontSize: `${scale}em`,
              opacity: `${scale}`,
            }}
          >
            {c === " " ? "\u00A0" : c + "\u00A0"}
          </tspan>
        );
      })}
    </>
  );
}
