import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Caveat } from 'next/font/google';
import { Dancing_Script } from 'next/font/google';
import { Italianno } from 'next/font/google';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const caveat = Caveat({ subsets: ['latin'] });
const dancingScript = Dancing_Script({ subsets: ['latin'] });
const italianno = Italianno({ 
  weight: ['400'],
  subsets: ['latin'] 
});

export const metadata: Metadata = {
  title: "Urban Translate",
  description: "From the streets, to the screens",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={caveat.className}>
      <body>{children}</body>
    </html>
  )
}
