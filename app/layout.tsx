import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GYRE Clone",
  description: "Animated swirl text with Web Speech API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`min-h-screen bg-black text-white antialiased`}>
        {children}
      </body>
    </html>
  );
}
