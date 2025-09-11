// app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Wagabond Pets - Digital Health Records for Your Pets",
  description: "Securely store and manage your pet's health records with AI-powered insights",
  keywords: "pet health records, veterinary records, pet care, digital pet records",
  authors: [{ name: "Wagabond Pets" }],
  openGraph: {
    title: "Wagabond Pets - Digital Health Records",
    description: "Securely store and manage your pet's health records",
    type: "website",
    locale: "en_US",
    siteName: "Wagabond Pets",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body className="font-sans antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}