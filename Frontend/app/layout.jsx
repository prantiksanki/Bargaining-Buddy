import { Inter } from "next/font/google"
import { ThemeProvider } from "../components/theme-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "BargainBuddy - Compare Prices & Save Money",
  description: "Find the best deals across multiple retailers and save money on your purchases.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.className} min-h-screen bg-background antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="bargain-buddy-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

import './globals.css'