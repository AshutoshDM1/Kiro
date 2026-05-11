import type { Metadata } from "next";
import { Oxanium, Geist, Caveat } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Footer from "@/shared/Footer/Footer";
import Navbar from "@/shared/Navbar/Navbar";

const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-oxanium" });
const caveat = Caveat({ subsets: ["latin"], variable: "--font-caveat" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Kiro",
  description: "AI-Powered Solana Terminal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        "font-geist",
        oxanium.variable,
        geist.variable,
        caveat.variable,
      )}
    >
      <body className="bg-[#F5F4F3]">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
