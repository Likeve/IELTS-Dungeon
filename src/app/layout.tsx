import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const langyuan = localFont({
  src: "../../public/Fonts/字小魂朗圆体.ttf",
  variable: "--font-langyuan",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["900"],
});

export const metadata: Metadata = {
  title: "雅思写作修罗场",
  description: "雅思写作训练平台 - 词汇、同义替换、长难句、听写、写作一站式训练",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${nunito.variable} ${langyuan.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
