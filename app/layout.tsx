import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "@/components/functional/theme-provider";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} min-h-screen antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Suspense>{children}</Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
