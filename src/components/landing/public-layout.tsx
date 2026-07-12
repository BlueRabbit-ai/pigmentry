import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Public marketing header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="text-lg font-bold tracking-tight">
            Pigmentra
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/examples" className="hover:text-foreground transition-colors">
              Examples
            </Link>
            <Link href="/how-it-works" className="hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Link href="/styles" className="hover:text-foreground transition-colors">
              Styles
            </Link>
            <Link href="/sizes" className="hover:text-foreground transition-colors">
              Sizes
            </Link>
            <Link href="/pricing" className="hover:text-foreground transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Start Free</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1">{children}</main>

      {/* Public footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-sm mb-3">Product</h3>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <Link href="/examples" className="hover:text-foreground">Examples</Link>
                <Link href="/styles" className="hover:text-foreground">Styles</Link>
                <Link href="/sizes" className="hover:text-foreground">Sizes</Link>
                <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-3">Learn</h3>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <Link href="/how-it-works" className="hover:text-foreground">How It Works</Link>
                <Link href="/blog" className="hover:text-foreground">Blog</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-3">Company</h3>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <Link href="/pricing" className="hover:text-foreground">Pricing</Link>
                <Link href="mailto:hello@pigmentra.com" className="hover:text-foreground">Contact</Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-3">Legal</h3>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
                <Link href="/terms" className="hover:text-foreground">Terms</Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Pigmentra. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
