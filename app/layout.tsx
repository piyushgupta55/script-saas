import type { Metadata } from "next";
import { Outfit, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ScriptSaaS - Turn Ideas into Viral Scripts in Seconds",
  description: "The world's most powerful AI script engine. Extract viral patterns from PDFs and generate high-retention content instantly.",
  openGraph: {
    title: "ScriptSaaS - Viral Content Engine",
    description: "Generate viral-ready scripts with AI-driven hooks and structures.",
    images: ["/og-image.png"],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body style={{ fontFamily: 'var(--font-outfit), sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
