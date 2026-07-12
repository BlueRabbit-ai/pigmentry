import type { Metadata } from "next";
import PublicLayout from "@/components/landing/public-layout";
import { PageHeader } from "@/components/landing/page-header";
import { StyleCard } from "@/components/landing/style-card";
import { JsonLd } from "@/components/landing/json-ld";
import { STYLE_PRESETS } from "@/lib/prompts";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Style Presets — Oil Painting Effects & Filters",
  description:
    "Choose from Classic Oil, Luxury Color, Selective Color, and Desktop Wallpaper styles for your AI-generated painting.",
  alternates: { canonical: "/styles" },
  openGraph: {
    title: "Pigmentra Style Presets",
    description:
      "Choose from Classic Oil, Luxury Color, Selective Color, and Desktop Wallpaper styles for your AI-generated painting.",
    url: "/styles",
  },
};

const webPageSchema = {
  "@type": "WebPage",
  name: "Pigmentra Style Presets",
  description:
    "Four distinct oil painting styles — Classic Oil, Luxury Color, Selective Color, and Desktop Wallpaper.",
};

export default function StylesPage() {
  return (
    <PublicLayout>
      <JsonLd data={webPageSchema} />

      <PageHeader
        title="Style Presets"
        description="Every style uses the same master oil-painting quality but differs in color treatment and emphasis. Choose the one that matches your vision."
      />

      {/* Style Cards Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {STYLE_PRESETS.map((style) => (
            <StyleCard
              key={style.slug}
              slug={style.slug}
              name={style.name}
              description={style.description}
            />
          ))}
        </div>
      </section>

      {/* Style Comparison Note */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold tracking-tight">
              Not Sure Which Style to Choose?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Try all four styles on the same photo to find your favorite. Each
              generation uses the same credit cost regardless of which style you
              pick. See our{" "}
              <Link
                href="/examples"
                className="text-primary hover:underline font-medium"
              >
                examples gallery
              </Link>{" "}
              to compare styles side by side.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-3xl font-bold tracking-tight">
          Try All Four Styles
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Experiment with different looks on the same photo to find your
          favorite.
        </p>
        <div className="mt-8">
          <Link href="/sign-up">
            <Button size="lg">Start Free</Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
