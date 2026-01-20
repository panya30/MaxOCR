import type { Metadata } from "next";
import { Sarabun, Instrument_Serif } from "next/font/google";
import "./globals.css";

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sarabun",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MaxOCR - แปลงภาพเป็นข้อความไทย",
  description:
    "Thai OCR powered by Typhoon AI - แปลงภาพเป็นข้อความไทย รองรับทั้งตัวพิมพ์และลายมือ",
  keywords: ["OCR", "Thai", "ไทย", "แปลงภาพ", "Typhoon", "AI"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" className="dark">
      <body
        className={`${sarabun.variable} ${instrumentSerif.variable} font-sans min-h-screen antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
