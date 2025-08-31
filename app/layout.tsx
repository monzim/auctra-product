import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/components/auth-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Auctra - Blockchain Procurement System",
  description:
    "Secure blockchain-based public procurement and tendering system",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${GeistSans.variable} ${GeistMono.variable} `}
      >
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <main className="min-h-screen">{children}</main>
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
