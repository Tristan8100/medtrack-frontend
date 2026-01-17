import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryWrapper from '@/lib/query';
import AuthProviderWrapper from "./authwrapper";
import { Toaster } from "@/components/ui/sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Medtrack",
  description: "Medtrack - Rural Health Unit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <QueryWrapper>
      <AuthProviderWrapper>
      {children}
      <Toaster position="top-right"/>
      </AuthProviderWrapper>
      </QueryWrapper>
      </body>
    </html>
  );
}
