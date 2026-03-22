import { Link, useLocation } from "wouter";
import { Disc, Menu, X, Instagram, Youtube, Twitter, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { href: "/", label: "Home" },
    { href: "/mixtapes", label: "Mixtapes" },
    { href: "/admin", label: "Admin" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary/30">
      
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
              <Disc className="w-6 h-6 text-white animate-[spin_8s_linear_infinite]" />
            </div>
            <span className="font-display font-black text-lg tracking-tighter leading-tight">
              DJ <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">HARRY</span>
              <span className="block text-xs font-semibold tracking-widest text-muted-foreground uppercase">Mr Street Sensation</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`text-sm font-semibold uppercase tracking-wider transition-colors hover:text-primary ${location === link.href ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-card border-b border-white/5 p-4 flex flex-col gap-4 shadow-xl">
            {links.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-lg font-bold p-3 rounded-lg ${location === link.href ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-white/5'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-white/5 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start justify-between gap-10">
            {/* Brand */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Disc className="w-6 h-6 text-primary" />
                <span className="font-display font-black text-lg tracking-tighter leading-tight">
                  DJ <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">HARRY</span>
                  <span className="block text-xs font-semibold tracking-widest text-muted-foreground uppercase">Mr Street Sensation</span>
                </span>
              </div>
              <p className="text-muted-foreground text-sm max-w-xs">
                Premium mixtapes. Hip Hop, Afrobeats, Dancehall & more.
              </p>
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Contact</h4>
              <a
                href="https://wa.me/254708654493"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4 shrink-0" />
                +254 708 654 493 (WhatsApp)
              </a>
              <a
                href="mailto:harrisonreycaspian@gmail.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4 shrink-0" />
                harrisonreycaspian@gmail.com
              </a>
            </div>

            {/* Socials */}
            <div className="flex flex-col gap-3">
              <h4 className="text-sm font-bold uppercase tracking-widest text-primary">Follow</h4>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20 hover:text-primary">
                  <Instagram className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20 hover:text-primary">
                  <Youtube className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20 hover:text-primary">
                  <Twitter className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <p className="text-muted-foreground text-xs">
              © {new Date().getFullYear()} DJ Harry Mr Street Sensation. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
