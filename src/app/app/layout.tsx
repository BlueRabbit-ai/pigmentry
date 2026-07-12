"use client";

import { requireAuth } from "@/lib/auth";
import { UserButton } from "@clerk/nextjs";
import { HeaderCredits } from "@/components/app/header-credits";
import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/app/new", label: "Create" },
    { href: "/app/history", label: "History" },
    { href: "/gallery", label: "Gallery" },
    { href: "/app/billing", label: "Billing" },
    { href: "/app/settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* App navigation header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          {/* Left: brand + desktop nav */}
          <div className="flex items-center gap-6">
            <Link
              href="/app"
              className="font-semibold text-sm shrink-0"
            >
              Pigmentra
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: credits + user + hamburger */}
          <div className="flex items-center gap-3">
            <HeaderCredits />
            <UserButton />
            {/* Mobile hamburger */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {mobileOpen && (
          <nav className="md:hidden border-t bg-background px-4 py-3">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* Main app content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
