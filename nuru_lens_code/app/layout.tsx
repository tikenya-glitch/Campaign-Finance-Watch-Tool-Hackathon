import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NuruLens - Kenya's Campaign Finance Transparency Platform",
  description: "Track campaign funding, monitor compliance, and strengthen public trust in Kenya's electoral process.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100`}
      >
        <Sidebar />
        <div className="lg:pl-64 min-h-screen flex flex-col">
          <main className="flex-1 pt-16 lg:pt-0 pl-4 pr-4 sm:px-6 lg:px-8 pb-8">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
