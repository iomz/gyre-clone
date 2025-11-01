import Image from "next/image";
import { Center } from "@/types/definitions";

export default function Logo({
  center,
  topic,
  language,
}: {
  center: Center;
  topic: string;
  language: string;
}) {
  let logoPath = "/logo.webp";
  if (language == "ja-JP") {
    logoPath = "/logo-ja.webp";
  }
  return (
    <a
      href={`https://google.com/search?q=${topic}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div
        className="glowWrapper"
        style={{
          position: "absolute",
          right: `${100 - center?.x - 4}%`,
          bottom: `${100 - center?.y - 2}%`,
        }}
      >
        <Image src={logoPath} alt="logo" width={246} height={95} />
      </div>
    </a>
  );
}
