"use client";

import { useQuery } from "convex/react";
import { api } from "@/lib/convex-api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PricingCard } from "@/components/landing/pricing-card";
import {
  CreditCard,
  Crown,
  ArrowUpCircle,
  Clock,
  Receipt,
  Coins,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

const upgradePlans = [
  {
    name: "Basic Monthly",
    price: "€9.99",
    period: "month",
    credits: 20,
    features: [
      "20 paintings / month",
      "All 3 style presets",
      "All output sizes",
      "Standard quality",
    ],
    ctaLabel: "Upgrade to Basic",
    ctaHref: "/app/billing",
  },
  {
    name: "Pro Monthly",
    price: "€19.99",
    period: "month",
    credits: 60,
    highlighted: true,
    badge: "Most Popular",
    features: [
      "60 paintings / month",
      "All 3 style presets",
      "All output sizes",
      "Premium quality",
      "Priority generation",
    ],
    ctaLabel: "Upgrade to Pro",
    ctaHref: "/app/billing",
  },
  {
    name: "Studio Monthly",
    price: "€39.99",
    period: "month",
    credits: 180,
    features: [
      "180 paintings / month",
      "All 3 style presets",
      "All output sizes",
      "Premium quality",
      "Priority generation",
      "Early access to new styles",
    ],
    ctaLabel: "Upgrade to Studio",
    ctaHref: "/app/billing",
  },
];

export default function BillingPage() {
  const balanceData = useQuery(api.credits.getBalance, {});
  const transactions = useQuery(api.credits.getTransactionHistory, { limit: 20 });

  const balance = (balanceData as any)?.balance ?? 0;
  const lifetimeEarned = (balanceData as any)?.lifetimeEarned ?? 0;
  const lifetimeSpent = (balanceData as any)?.lifetimeSpent ?? 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight">
            Billing & Credits
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your credits, plan, and view transaction history.
          </p>
        </div>

        {/* Credit Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <Coins className="size-3.5 text-primary" />
                Credit Balance
              </CardDescription>
              <CardTitle className="text-3xl tabular-nums">{balance}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Available for generation & downloads
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <TrendingUp className="size-3.5 text-green-500" />
                Total Earned
              </CardDescription>
              <CardTitle className="text-3xl tabular-nums">{lifetimeEarned}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                From trials, purchases & gallery rewards
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-1.5">
                <TrendingDown className="size-3.5 text-destructive" />
                Total Spent
              </CardDescription>
              <CardTitle className="text-3xl tabular-nums">{lifetimeSpent}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                On generations & gallery downloads
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Current Plan */}
        <Card className="mb-8 border-primary/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Crown className="size-5 text-primary" />
              <CardTitle>Current Plan</CardTitle>
              <Badge className="ml-2">Free Trial</Badge>
            </div>
            <CardDescription>
              You are on the Free Trial with 2 initial credits.
              Upgrade for more credits and premium features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Plan</span>
              <span className="text-sm font-medium">Free Trial</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Credits Available</span>
              <span className="text-sm font-medium tabular-nums">{balance} remaining</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Billing</span>
              <span className="text-sm font-medium">Free — no charge</span>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button className="w-full sm:w-auto" disabled>
              <ArrowUpCircle className="size-4" />
              Upgrade Plan
            </Button>
            <Button variant="outline" className="w-full sm:w-auto" disabled>
              <CreditCard className="size-4" />
              Buy Credit Pack
            </Button>
            <p className="text-xs text-muted-foreground">
              Plans and credit packs are managed through Clerk Billing.
              They will become available once payment plans are configured.
            </p>
          </CardFooter>
        </Card>

        {/* Available Upgrades (for reference) */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
          <p className="text-sm text-muted-foreground mb-4">
            These plans will be purchasable once Clerk Billing is configured.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upgradePlans.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Credit Transaction History */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Receipt className="size-5" />
            Credit History
          </h2>
          {!transactions || transactions.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center">
                <Clock className="size-8 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No transactions yet. Generate your first painting or publish to the gallery to see activity here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {((transactions as any[]) ?? []).map((tx: any, i: number) => (
                <Card key={tx._id ?? i}>
                  <CardContent className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          tx.amount > 0
                            ? "bg-green-500/10 text-green-500"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {tx.amount > 0 ? (
                          <TrendingUp className="size-4" />
                        ) : (
                          <TrendingDown className="size-4" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium capitalize">
                          {(tx.reason ?? "").replace(/[:._]/g, " ")}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {tx._creationTime
                            ? new Date(tx._creationTime).toLocaleDateString()
                            : ""}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`text-sm font-medium tabular-nums ${
                          tx.amount > 0 ? "text-green-500" : "text-destructive"
                        }`}
                      >
                        {tx.amount > 0 ? "+" : ""}
                        {tx.amount}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Balance: {tx.balanceAfter}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
