import { AuthProvider } from "@/components/auth-provider";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import type React from "react";
import { Suspense } from "react";

import "./globals.css";

const quicksand = Quicksand({ subsets: ["latin"] });

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
      <body className={`font-sans ${quicksand.className}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <main className="min-h-screen">{children}</main>
          </AuthProvider>
        </Suspense>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
