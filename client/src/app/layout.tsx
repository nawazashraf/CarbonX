import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
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
<<<<<<< HEAD
  title: "CarbonX Marketplace | Real Climate Action",
  description: "Accelerate global net-zero goals through a high-integrity, transparent marketplace for tokenized carbon removals and biodiversity credits.",
=======
  title: {
    default: "CarbonX",
    template: "%s | CarbonX",
  },
  description:
    "CarbonX is a decentralized carbon credit marketplace enabling transparent verification, tokenization, trading, and retirement of carbon credits on the blockchain.",
>>>>>>> 169915d7f64aba3f83a70c16b06875c644909b26
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
<<<<<<< HEAD
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-surface-container-lowest text-on-surface">{children}</body>
=======
      <body className="min-h-screen bg-black text-white overflow-x-hidden">
        <Navbar />

        <main>{children}</main>
      </body>
>>>>>>> 169915d7f64aba3f83a70c16b06875c644909b26
    </html>
  );
}