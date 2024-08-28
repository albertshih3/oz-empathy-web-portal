import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster, toast } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Administrative Dashboard",
  description: "Empathy Guide app web dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Toaster position="bottom-center" richColors />
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
