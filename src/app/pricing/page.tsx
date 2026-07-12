import type { Metadata } from "next";
import PublicLayout from "@/components/landing/public-layout";
import { PageHeader } from "@/components/landing/page-header";
import { PricingCard } from "@/components/landing/pricing-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/landing/json-ld";
import { CREDIT_COSTS } from "@/lib/constants";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing — AI Oil Painting Generator",
  description:
    "Simple, transparent pricing for AI oil painting generation. Choose a subscription or grab a one-off pack — whatever fits your needs.",
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: "Pigmentra Pricing",
    description:
      "Simple, transparent pricing for AI oil painting generation. Subscriptions and one-off packs available.",
    url: "/pricing",
  },
};

const monthlyPlans = [
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
    ctaLabel: "Start Free Trial",
    ctaHref: "/sign-up",
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
    ctaLabel: "Start Free Trial",
    ctaHref: "/sign-up",
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
    ctaLabel: "Start Free Trial",
    ctaHref: "/sign-up",
  },
];

const oneOffPacks = [
  {
    name: "Starter Pack",
    price: "€4.99",
    credits: 3,
    features: ["3 paintings", "All 4 style presets", "All output sizes", "Credits never expire"],
    ctaLabel: "Buy Starter Pack",
    ctaHref: "/sign-up",
  },
  {
    name: "Standard Pack",
    price: "€9.99",
    credits: 10,
    highlighted: true,
    badge: "Popular",
    features: ["10 paintings", "All 4 style presets", "All output sizes", "Credits never expire"],
    ctaLabel: "Buy Standard Pack",
    ctaHref: "/sign-up",
  },
  {
    name: "Value Pack",
    price: "€19.99",
    credits: 25,
    badge: "Best Value",
    features: ["25 paintings", "All 4 style presets", "All output sizes", "Credits never expire", "Best value per painting"],
    ctaLabel: "Buy Value Pack",
    ctaHref: "/sign-up",
  },
];

const pricingFaqItems = [
  {
    q: "Can I switch plans anytime?",
    a: "Yes. Upgrades take effect immediately; downgrades apply at the end of your billing cycle.",
  },
  {
    q: "Do unused credits roll over?",
    a: "Credits reset each billing cycle for subscriptions. Pack credits never expire.",
  },
  {
    q: "Can I get a refund?",
    a: "If you're not satisfied, contact us within 7 days of purchase for a full refund.",
  },
  {
    q: "How do credits work?",
    a: "Each generation costs credits based on the output size you choose. Phone and Square sizes cost 1 credit, while Laptop and Custom sizes cost 2 credits.",
  },
];

const productSchema = {
  "@type": "Product",
  name: "Pigmentra",
  description:
    "AI oil painting generator — transform photos into stunning oil painting wallpapers.",
  offers: [
    ...monthlyPlans.map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: p.price.replace("€", ""),
      priceCurrency: "EUR",
      description: `${p.credits} credits per month`,
    })),
    ...oneOffPacks.map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: p.price.replace("€", ""),
      priceCurrency: "EUR",
      description: `${p.credits} credits (one-time)`,
    })),
  ],
};

export default function PricingPage() {
  return (
    <PublicLayout>
      <JsonLd data={productSchema} />

      <PageHeader
        title="Simple, Transparent Pricing"
        description="Start with a free trial. Choose a subscription or grab a one-off pack — whatever fits your needs. No hidden fees."
      />

      {/* Billing Tabs */}
      <section className="container mx-auto px-4 pb-20">
        <Tabs defaultValue="monthly" className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-10">
            <TabsList>
              <TabsTrigger value="monthly">Monthly Plans</TabsTrigger>
              <TabsTrigger value="one-off">One-Off Packs</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="monthly">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {monthlyPlans.map((plan) => (
                <PricingCard key={plan.name} {...plan} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="one-off">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {oneOffPacks.map((pack) => (
                <PricingCard key={pack.name} {...pack} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Credit Logic */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              How Credits Work
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Credits are deducted per generation based on your chosen output
              size. Simple and predictable.
            </p>
          </div>
          <Card className="max-w-lg mx-auto mt-8">
            <CardHeader>
              <CardTitle className="text-center">Credit Costs</CardTitle>
              <CardDescription className="text-center">
                Per output size
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Phone Wallpaper</span>
                  <Badge variant="secondary">1 credit</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Square</span>
                  <Badge variant="secondary">1 credit</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span>Laptop Wallpaper</span>
                  <Badge variant="secondary">2 credits</Badge>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>Custom Size (up to 2K)</span>
                  <Badge variant="secondary">2 credits</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing FAQ */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-center mb-10">
            Pricing FAQ
          </h2>
          <Accordion>
            {pricingFaqItems.map((faq, index) => (
              <AccordionItem key={index} value={String(index)}>
                <AccordionTrigger>{faq.q}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-muted-foreground">{faq.a}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Try it free and see your first painting today.
          </p>
          <div className="mt-8 max-w-sm mx-auto">
            <PricingCard
              name="Free Trial"
              price="€0"
              credits={2}
              features={[
                "2 free paintings",
                "All 4 style presets",
                "All output sizes",
                "No credit card required",
              ]}
              ctaLabel="Start Free"
              ctaHref="/sign-up"
            />
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
