import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TradeMirror | Trading Journal",
  description:
    "A modern trading journal for reflecting on performance, psychology, and strategy execution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth bg-[#020617] antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#020617] text-slate-50">
        {children}
      </body>
    </html>
  );
}
