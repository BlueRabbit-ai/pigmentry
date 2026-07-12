import type { Metadata } from "next";
import PublicLayout from "@/components/landing/public-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TrustBadges } from "@/components/landing/trust-badges";
import { BeforeAfterCard } from "@/components/landing/before-after-card";
import { JsonLd } from "@/components/landing/json-ld";
import {
  Shield,
  Zap,
  Image,
  Lock,
  Upload,
  Palette,
  Download,
} from "lucide-react";

export const metadata: Metadata = {
  title:
    "AI Oil Painting Generator — Turn Photos Into Stunning Art",
  description:
    "Upload any photo and get a premium, hand-painted-style oil painting wallpaper for your phone, laptop, or desktop in seconds — powered by AI.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Pigmentra — AI Oil Painting Generator",
    description:
      "Transform your photos into stunning oil painting wallpapers with AI.",
    url: "/",
  },
};

const websiteSchema = {
  "@type": "WebSite",
  name: "Pigmentra",
  url: "https://pigmentra.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://pigmentra.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const organizationSchema = {
  "@type": "Organization",
  name: "Pigmentra",
  url: "https://pigmentra.com",
};

const faqItems = [
  {
    q: "What photo formats are supported?",
    a: "We support JPEG, PNG, and WebP uploads. Maximum file size is 20MB.",
  },
  {
    q: "How long does generation take?",
    a: "Most paintings are generated in under 30 seconds.",
  },
  {
    q: "Can I use the images commercially?",
    a: "Yes! All paintings you generate belong to you. Use them however you like.",
  },
  {
    q: "What sizes can I download?",
    a: "We support phone, square, laptop, and custom sizes up to 2K resolution.",
  },
  {
    q: "Do I need an account to use Pigmentra?",
    a: "Yes — sign-up is free and takes under a minute. Your account lets you manage your paintings, credits, and downloads in one place.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards through our secure payment processor.",
  },
];

const faqSchema = {
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

const STYLE_PRESETS = [
  { slug: "classic-oil", name: "Classic Oil" },
  { slug: "luxury-color", name: "Luxury Color" },
  { slug: "selective-color", name: "Selective Color" },
  { slug: "desktop-wallpaper", name: "Desktop Wallpaper" },
] as const;

const stats = [
  { value: "10,000+", label: "Paintings Generated" },
  { value: "4", label: "Style Presets" },
  { value: "4", label: "Output Sizes" },
  { value: "Under 30s", label: "Average Generation" },
];

export default function HomePage() {
  return (
    <PublicLayout>
      <JsonLd data={websiteSchema} />
      <JsonLd data={organizationSchema} />
      <JsonLd data={faqSchema} />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-24 sm:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
            Turn Your Photos Into{" "}
            <span className="text-primary">Stunning Oil Paintings</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload any photo and get a premium, hand-painted-style oil painting
            wallpaper for your phone, laptop, or desktop in seconds — powered by
            AI.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="w-full sm:w-auto text-base">
                Start Free
              </Button>
            </Link>
            <Link href="/examples">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base"
              >
                See Examples
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="ghost"
                size="lg"
                className="w-full sm:w-auto text-base"
              >
                View Pricing
              </Button>
            </Link>
          </div>
          <div className="mt-8">
            <TrustBadges
              badges={[
                { icon: Shield, label: "Secure uploads" },
                { icon: Zap, label: "Under 30 seconds" },
                { icon: Image, label: "Up to 2K resolution" },
                { icon: Lock, label: "You own the rights" },
              ]}
            />
          </div>
        </div>
      </section>

      {/* How It Works Teaser */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Three simple steps to transform your photo
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: "1",
                title: "Upload",
                icon: Upload,
                description:
                  "Upload any photo in JPEG, PNG, or WebP format. We verify and secure every upload.",
              },
              {
                step: "2",
                title: "Choose Style & Size",
                icon: Palette,
                description:
                  "Pick a preset style like Classic Oil or Luxury Color, and choose your output size.",
              },
              {
                step: "3",
                title: "Download Painting",
                icon: Download,
                description:
                  "Get a beautiful oil painting wallpaper optimized for your screen in seconds.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground mb-4">
                  <item.icon className="size-5" />
                </div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Gallery Strip */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight">
            See the Transformation
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every photo becomes a unique oil painting
          </p>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
          {STYLE_PRESETS.map((style) => (
            <BeforeAfterCard
              key={style.slug}
              styleSlug={style.slug}
              styleName={style.name}
            />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/examples">
            <Button variant="outline">See All Transformations →</Button>
          </Link>
        </div>
      </section>

      {/* Trust Stats */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Start with a free trial. Choose a subscription or grab a one-off
            pack — whatever fits your needs.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/pricing">
              <Button variant="outline" size="lg">
                View Full Pricing
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="lg">Start Free</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-2xl mx-auto">
            <Accordion>
              {faqItems.map((faq, index) => (
                <AccordionItem key={index} value={String(index)}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{faq.a}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Have more questions?{" "}
              <Link
                href="mailto:hello@pigmentra.com"
                className="text-primary hover:underline"
              >
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Ready to Turn Your Photos Into Art?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Start free — no credit card required.
        </p>
        <div className="mt-8">
          <Link href="/sign-up">
            <Button size="lg" className="text-base">
              Start Free Now
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
