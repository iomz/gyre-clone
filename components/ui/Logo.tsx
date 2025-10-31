import Image from "next/image";
import { Center } from "@/types/definitions";

export default function Logo({
  center,
  language,
}: {
  center: Center;
  language: string;
}) {
  let logoPath = "/logo.webp";
  if (language == "ja-JP") {
    logoPath = "/logo-ja.webp";
  }
  return (
    <a
      href="https://github.com/iomz/gyre-clone"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image
        src={logoPath}
        alt="logo"
        width={246}
        height={95}
        style={{
          position: "absolute",
          right: `${100 - center?.x - 4}%`,
          bottom: `${100 - center?.y - 2}%`,
        }}
      />
    </a>
  );
}
