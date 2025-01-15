import Link from "next/link";
import { Facebook, Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <img
                src="https://storage-auctra.monzim.com/auctra-logo.webp"
                alt="Auctra Logo"
                className="w-10 h-10"
              />
              <span className="text-xl font-bold text-primary">Auctra</span>
            </Link>
            <p className="text-sm text-foreground/70">
              Revolutionizing government procurement with blockchain technology.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/catalog"
                  className="text-foreground/60 hover:text-foreground"
                >
                  Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/bids"
                  className="text-foreground/60 hover:text-foreground"
                >
                  Bids
                </Link>
              </li>
              <li>
                <Link
                  href="/company"
                  className="text-foreground/60 hover:text-foreground"
                >
                  Company
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/blog"
                  className="text-foreground/60 hover:text-foreground"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-foreground/60 hover:text-foreground"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-foreground/60 hover:text-foreground"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground/60 hover:text-foreground">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-foreground">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-foreground">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-foreground">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-foreground/10 text-center text-sm text-foreground/60">
          <p>&copy; {new Date().getFullYear()} Auctra. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
