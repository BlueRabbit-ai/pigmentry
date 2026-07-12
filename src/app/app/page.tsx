import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreditBalance } from "@/components/app/credit-balance";
import { GenerationCard } from "@/components/app/generation-card";
import { ImagePlaceholder } from "@/components/landing/image-placeholder";
import { Plus, History, CreditCard, Settings, Sparkles } from "lucide-react";

export const metadata = {
  title: "Dashboard",
};

const stats = [
  {
    label: "Total Generations",
    value: "—",
    icon: Sparkles,
    description: "Create your first painting",
  },
  {
    label: "Available Credits",
    value: "—",
    icon: CreditCard,
    description: "Loading...",
  },
];

const quickActions = [
  {
    label: "Create Painting",
    href: "/app/new",
    icon: Plus,
    description: "Upload a photo and generate",
    primary: true,
  },
  {
    label: "View History",
    href: "/app/history",
    icon: History,
    description: "Browse past generations",
  },
  {
    label: "Manage Billing",
    href: "/app/billing",
    icon: CreditCard,
    description: "Plan and credits",
  },
  {
    label: "Settings",
    href: "/app/settings",
    icon: Settings,
    description: "Account preferences",
  },
];

// Recent generations are fetched from Convex in production
const recentGenerations: Array<{
  id: string;
  styleName: string;
  sizeLabel: string;
  status: "completed" | "failed" | "pending" | "processing";
  creditsCharged: number;
  createdAt: string;
}> = [];

export default async function DashboardPage() {
  const user = await currentUser();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome + Credit Balance */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome{user?.firstName ? `, ${user.firstName}` : ""}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your paintings.
          </p>
        </div>
        <CreditBalance balance={0} />
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <stat.icon className="size-3.5" />
                {stat.label}
              </CardDescription>
              <CardTitle className="text-3xl">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <Link key={action.label} href={action.href}>
              <Card
                className={`h-full transition-colors hover:bg-muted/50 ${
                  action.primary ? "border-primary/30 bg-primary/5" : ""
                }`}
              >
                <CardContent className="p-4">
                  <action.icon
                    className={`size-5 mb-2 ${
                      action.primary ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <h3 className="text-sm font-medium">{action.label}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Generations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Generations</h2>
          <Link href="/app/history">
            <Button variant="ghost" size="sm">
              View All →
            </Button>
          </Link>
        </div>

        {recentGenerations.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <ImagePlaceholder
                aspectRatio="16:9"
                className="max-w-xs mx-auto mb-4"
              />
              <h3 className="font-semibold">No generations yet</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Create your first oil painting to see it here.
              </p>
              <Link href="/app/new">
                <Button size="sm">
                  <Plus className="size-4" />
                  Create Painting
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {recentGenerations.map((gen) => (
              <GenerationCard key={gen.id} {...gen} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
