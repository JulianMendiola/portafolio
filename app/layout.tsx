import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";
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
  title: "Julian Mendiola — Emprendedor Tech",
  description:
    "Construyo productos digitales con IA. Fundador de TallerPro y otros proyectos.",
  openGraph: {
    title: "Julian Mendiola — Emprendedor Tech",
    description: "Construyo productos digitales con IA.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-screen">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
