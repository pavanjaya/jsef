import type { Metadata } from "next";
import { IBM_Plex_Serif } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Loader from "./components/Loader";

const plexSerif = IBM_Plex_Serif({
  variable: "--font-plex-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "JSEC — Jangid Sports & Education Committee",
  description:
    "Jangid Sports & Education Committee — empowering our community in Nashik through sports, learning, culture, and shared purpose since 2018.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plexSerif.variable}>
      <head>
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" />
      </head>
      <body>
        <Loader />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
