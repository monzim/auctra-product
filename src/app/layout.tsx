import Navbar from "@/components/Navbar";
import { Ubuntu_Sans } from "next/font/google";
import "./globals.css";

const inter = Ubuntu_Sans({
  weight: ["400", "500", "600", "700", "100", "200", "300"],
  style: ["normal"],
  subsets: ["latin", "latin-ext"],
});

export const metadata = {
  title: "Auctra - Blockchain-Based Public Procurement",
  description:
    "Transforming Government Tendering Through Transparent Auction Trajectories",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="" suppressHydrationWarning>
      <body className={inter.className}>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
