import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { Ubuntu_Sans } from "next/font/google";
import "./globals.css";

const ubuntu = Ubuntu_Sans({
  weight: ["400", "500", "600", "700", "100", "200", "300"],
  style: ["normal"],
  subsets: ["latin", "latin-ext"],
});

const OG_IMAGE = "https://storage-auctra.monzim.com/auctra-thumbnail.webp";
const BASE_URL = "https://auctra.monzim.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Auctra - Blockchain-Powered Government Procurement Platform",
    template: "%s | Auctra",
  },
  description:
    "Transform government tendering with Auctra's blockchain-based procurement platform. Ensure transparency, security, and efficiency in public tenders through cutting-edge technology.",
  keywords: [
    "government procurement",
    "blockchain procurement",
    "public tenders",
    "transparent bidding",
    "procurement platform",
    "secure tendering",
    "digital procurement",
    "government contracts",
    "procurement management",
    "blockchain technology",
    "tender management",
    "public sector procurement",
    "e-procurement",
    "smart contracts",
    "procurement transparency",
  ],
  authors: [{ name: "Auctra" }],
  creator: "Auctra",
  publisher: "Auctra",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    title: "Auctra - Revolutionizing Government Procurement with Blockchain",
    description:
      "Secure, transparent, and efficient public procurement platform powered by blockchain technology. Transform your government tendering process with real-time tracking and immutable records.",
    siteName: "Auctra",
    images: [
      {
        url: OG_IMAGE,
        alt: "Auctra - Blockchain-Based Public Procurement Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Auctra - Blockchain-Powered Government Procurement",
    description:
      "Transform public procurement with blockchain technology. Secure, transparent, and efficient tendering for government agencies.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
  category: "Technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="" suppressHydrationWarning>
      <body className={ubuntu.className}>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          <main className="container mx-auto px-4 py-24 min-h-screen">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
