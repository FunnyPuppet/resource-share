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
  title: "资源帮",
  description: "资源分享平台"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <nav className="flex justify-center gap-6 p-4 bg-gray-100">
          <a href="/">首页</a>
          <a href="/resource">资源分享</a>
          <a href="/share">我要分享</a>
          <a href="/help">资源帮找</a>
          <a href="/about">关于本站</a>
          <a href="/profile">个人中心</a>
        </nav>
        {children}
      </body>
    </html>
  );
}
