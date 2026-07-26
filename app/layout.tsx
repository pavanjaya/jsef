import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import CustomCursor from "./components/CustomCursor";
import Loader from "./components/Loader";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
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
    <html lang="en" className={jakarta.variable}>
      <body>
        <Loader />
        <CustomCursor />
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
