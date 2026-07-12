import { currentUser } from "@clerk/nextjs/server";
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
import { CreditBalance } from "@/components/app/credit-balance";
import { PricingCard } from "@/components/landing/pricing-card";
import {
  CreditCard,
  Crown,
  ArrowUpCircle,
  Clock,
  Receipt,
  Coins,
} from "lucide-react";

export const metadata = {
  title: "Billing & Plan",
};

const purchaseHistory = [
  {
    id: "pur-1",
    product: "Free Trial",
    date: "Jul 12, 2026",
    amount: "€0.00",
    credits: 2,
    status: "completed" as const,
  },
];

const upgradePlans = [
  {
    name: "Basic Monthly",
    price: "€9.99",
    period: "month",
    credits: 20,
    features: [
      "20 paintings / month",
      "All 4 style presets",
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
      "All 4 style presets",
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
      "All 4 style presets",
      "All output sizes",
      "Premium quality",
      "Priority generation",
      "Early access to new styles",
    ],
    ctaLabel: "Upgrade to Studio",
    ctaHref: "/app/billing",
  },
];

export default async function BillingPage() {
  const user = await currentUser();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Billing & Plan
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your subscription, credits, and payments.
            </p>
          </div>
          <CreditBalance balance={0} />
        </div>

        {/* Current Plan */}
        <Card className="mb-8 border-primary/30">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Crown className="size-5 text-primary" />
              <CardTitle>Current Plan</CardTitle>
              <Badge className="ml-2">Active</Badge>
            </div>
            <CardDescription>
              You are currently on the Free Trial plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Plan</span>
              <span className="text-sm font-medium">Free Trial</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm text-muted-foreground">Credits</span>
              <span className="text-sm font-medium">2 total</span>
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
              Buy Credits Pack
            </Button>
          </CardFooter>
        </Card>

        {/* Available Upgrades */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upgradePlans.map((plan) => (
              <PricingCard key={plan.name} {...plan} />
            ))}
          </div>
        </div>

        <Separator className="mb-8" />

        {/* Purchase History */}
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Receipt className="size-5" />
            Purchase History
          </h2>
          {purchaseHistory.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-8 text-center">
                <Clock className="size-8 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  No purchases yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {purchaseHistory.map((purchase) => (
                <Card key={purchase.id}>
                  <CardContent className="py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/10">
                        <Coins className="size-5 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {purchase.product}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {purchase.date} · {purchase.credits} credits
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {purchase.amount}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {purchase.status}
                      </Badge>
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
