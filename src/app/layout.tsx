import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/cursor";
import ParticleCanvas from "@/components/particle-canvas";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FIDA Global | Intelligent Business Solutions",
  description: "FIDA Global provides innovative IT consultancy, infrastructure, networking, and managed services with a focus on smart business management systems.",
  icons: {
    icon: "/logo.png",
  },
};

import PageTransition from "@/components/page-transition";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} dark h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans grain">
        {/* Global — applies to every page */}
        <CustomCursor />
        <ParticleCanvas />
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}
