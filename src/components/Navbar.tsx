import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center p-4">
        <Link href="/" className="text-2xl font-bold text-primary">
          Auctra
        </Link>
        <div className="flex items-center space-x-6 ml-auto">
          <Link
            href="/catalog"
            className="text-foreground/60 hover:text-foreground"
          >
            Catalog
          </Link>
          <Link
            href="/bids"
            className="text-foreground/60 hover:text-foreground"
          >
            Bids
          </Link>
          <Link
            href="/company"
            className="text-foreground/60 hover:text-foreground"
          >
            Company
          </Link>
        </div>
      </div>
    </nav>
  );
}
