import { requireAuth } from "@/lib/auth";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* App navigation header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/app" className="font-semibold text-sm">
              Pigmentra
            </Link>
            <nav className="hidden md:flex items-center gap-4 text-sm text-muted-foreground">
              <Link
                href="/app/new"
                className="hover:text-foreground transition-colors"
              >
                Create
              </Link>
              <Link
                href="/app/history"
                className="hover:text-foreground transition-colors"
              >
                History
              </Link>
              <Link
                href="/app/billing"
                className="hover:text-foreground transition-colors"
              >
                Billing
              </Link>
              <Link
                href="/app/settings"
                className="hover:text-foreground transition-colors"
              >
                Settings
              </Link>
            </nav>
          </div>
          <UserButton />
        </div>
      </header>

      {/* Main app content */}
      <main className="flex-1">{children}</main>
    </div>
  );
}
