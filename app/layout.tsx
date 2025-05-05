import Link from "next/link"
import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import ConditionalFooter from "../components/conditional-footer"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "ReserveMate - 스포츠 예약 시스템",
  description: "ReserveMate에서 간편하게 스포츠 시설을 예약하고 관리하세요.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-white`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} forcedTheme="light">
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1 pb-8 sm:pb-10 lg:pb-12">{children}</main>
            <ConditionalFooter />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}