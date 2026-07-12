import type { Metadata } from "next";
import PublicLayout from "@/components/landing/public-layout";
import { PageHeader } from "@/components/landing/page-header";
import { SizeCard } from "@/components/landing/size-card";
import { JsonLd } from "@/components/landing/json-ld";
import { SIZE_PRESETS, CREDIT_COSTS } from "@/lib/constants";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Output Sizes — Phone, Laptop & Custom Wallpapers",
  description:
    "Generate AI oil paintings in phone, square, laptop, and custom sizes. Perfect wallpapers optimized for every screen type.",
  alternates: { canonical: "/sizes" },
  openGraph: {
    title: "Pigmentra Output Sizes",
    description:
      "Generate AI oil paintings in phone, square, laptop, and custom sizes. Perfect for every screen.",
    url: "/sizes",
  },
};

const deviceContext: Record<string, string> = {
  phone:
    "Perfect for iPhone and Android lock and home screens. The tall aspect ratio fits modern smartphones without cropping.",
  square:
    "Ideal for Instagram posts, profile pictures, and social media. The balanced 1:1 format works everywhere.",
  laptop:
    "Optimized for MacBook and Windows laptop wallpapers. The 16:10 ratio fits most laptop screens perfectly.",
  custom:
    "Set your own dimensions for tablets, desktops, or print-ready files. Flexibility when you need a specific size.",
};

const webPageSchema = {
  "@type": "WebPage",
  name: "Pigmentra Output Sizes",
  description:
    "Supported output sizes for AI oil painting generation — phone, square, laptop, and custom wallpapers.",
};

export default function SizesPage() {
  return (
    <PublicLayout>
      <JsonLd data={webPageSchema} />

      <PageHeader
        title="Output Sizes"
        description="Perfect wallpapers for every screen. Choose from phone, square, laptop, or custom dimensions up to 2K."
      />

      {/* Size Comparison Bar */}
      <section className="container mx-auto px-4 pb-12">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-semibold text-center mb-6">
            Relative Size Comparison
          </h2>
          <div className="flex items-end justify-center gap-4 h-40">
            {SIZE_PRESETS.map((preset) => {
              const heights: Record<string, number> = {
                phone: 140,
                square: 100,
                laptop: 90,
                custom: 80,
              };
              const widths: Record<string, number> = {
                phone: 55,
                square: 100,
                laptop: 160,
                custom: 110,
              };
              return (
                <div
                  key={preset.slug}
                  className="flex flex-col items-center gap-2"
                >
                  <div
                    className="rounded-lg bg-gradient-to-t from-primary/30 to-primary/10 border border-primary/20 flex items-center justify-center"
                    style={{
                      width: widths[preset.slug] ?? 100,
                      height: heights[preset.slug] ?? 100,
                      borderStyle:
                        preset.slug === "custom" ? "dashed" : "solid",
                    }}
                  >
                    <span className="text-xs font-mono text-primary/60">
                      {preset.aspectRatio}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {preset.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Size Cards Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {SIZE_PRESETS.map((preset) => (
            <div key={preset.slug}>
              <SizeCard
                slug={preset.slug}
                label={preset.label}
                width={preset.width}
                height={preset.height}
                aspectRatio={preset.aspectRatio}
                description={preset.description}
                creditCost={
                  CREDIT_COSTS[preset.slug as keyof typeof CREDIT_COSTS]
                }
              />
              <p className="mt-3 text-sm text-muted-foreground text-center px-4">
                {deviceContext[preset.slug]}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Ready to Create Your Wallpaper?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose your size and turn your photo into art.
          </p>
          <div className="mt-8">
            <Link href="/sign-up">
              <Button size="lg">Start Free</Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
