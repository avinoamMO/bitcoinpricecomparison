"use client";

import Link from "next/link";
import { Bitcoin, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/10 group-hover:bg-gold/20 transition-colors">
              <Bitcoin className="h-5 w-5 text-gold" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Crypto<span className="text-gold">ROI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Compare
            </Link>
            <Link
              href="/exchanges/binance"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Exchanges
            </Link>
            <Link
              href="/learn/how-exchange-fees-work"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Learn
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-muted-foreground hover:text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t border-border py-4 animate-slide-up">
            <div className="flex flex-col gap-3">
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Compare
              </Link>
              <Link
                href="/exchanges/binance"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Exchanges
              </Link>
              <Link
                href="/learn/how-exchange-fees-work"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors px-2 py-1"
                onClick={() => setMobileMenuOpen(false)}
              >
                Learn
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
