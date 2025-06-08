import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import Navigation from "@/app/components/Navigation"
import Footer from "@/app/components/Footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "资源帮",
  description: "资源分享平台"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100`}
      >
        <Navigation />
        <div className="mt-2 pt-4 mx-auto w-full max-w-full md:max-w-[80%] xl:max-w-[60%]">
          {children}
        </div>
        <Footer></Footer>
      </body>
    </html>
  )
}
