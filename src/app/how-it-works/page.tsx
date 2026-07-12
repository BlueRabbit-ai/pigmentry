import type { Metadata } from "next";
import PublicLayout from "@/components/landing/public-layout";
import { PageHeader } from "@/components/landing/page-header";
import { BeforeAfterCard } from "@/components/landing/before-after-card";
import { JsonLd } from "@/components/landing/json-ld";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MAX_UPLOAD_SIZE, ALLOWED_MIME_TYPES, MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT } from "@/lib/constants";
import { Upload, Palette, Download, Shield } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "How It Works — Convert Your Photo Into a Painting",
  description:
    "Three simple steps: upload your photo, choose your style and size, and download your AI-generated oil painting. Learn how Pigmentra works.",
  alternates: { canonical: "/how-it-works" },
  openGraph: {
    title: "How Pigmentra Works",
    description:
      "Three simple steps: upload your photo, choose your style and size, and download your AI-generated oil painting.",
    url: "/how-it-works",
  },
};

const steps = [
  {
    number: "1",
    title: "Upload Your Photo",
    icon: Upload,
    description:
      "Start by uploading a photo in JPEG, PNG, or WebP format. We verify every upload for security and normalize it for the AI model. Your original photo stays private and secure.",
    tips: [
      "Use well-lit photos without heavy filters for best results",
      "Photos with clear subjects work better than busy group shots",
      "Maximum file size is 20MB — most phone photos work perfectly",
    ],
  },
  {
    number: "2",
    title: "Choose Style & Size",
    icon: Palette,
    description:
      "Pick one of three style presets — Classic Oil, Luxury Color, or Selective Color. Then choose your output size: phone, square, laptop, or custom dimensions up to 2K.",
    tips: [
      "Try all three styles on the same photo to find your favorite",
      "Phone size is great for personal wallpapers",
      "Laptop size works for desktop backgrounds too",
    ],
  },
  {
    number: "3",
    title: "Download Your Painting",
    icon: Download,
    description:
      "The AI generates your oil painting in under 30 seconds. Download the result immediately at full resolution. All your paintings stay available in your history for 30 days.",
    tips: [
      "Downloads are available in your history for 30 days",
      "Each painting is a high-resolution file ready to use",
      "You own the rights — use your paintings anywhere",
    ],
  },
];

const howToSchema = {
  "@type": "HowTo",
  name: "How to Convert a Photo Into an Oil Painting",
  description:
    "Three simple steps to transform your photo into a stunning AI-generated oil painting.",
  step: steps.map((step) => ({
    "@type": "HowToStep",
    position: step.number,
    name: step.title,
    text: step.description,
  })),
};

export default function HowItWorksPage() {
  return (
    <PublicLayout>
      <JsonLd data={howToSchema} />

      <PageHeader
        title="How It Works"
        description="Three simple steps to transform your photo into a stunning oil painting wallpaper. No design skills needed."
      />

      {/* Step-by-Step Guide */}
      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-3xl mx-auto space-y-12">
          {steps.map((step) => (
            <div key={step.number} className="flex gap-6">
              {/* Step number */}
              <div className="flex-shrink-0">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground">
                  <step.icon className="size-5" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <span className="text-primary text-sm font-normal">
                    Step {step.number}
                  </span>
                  <span>{step.title}</span>
                </h3>
                <p className="mt-3 text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
                {/* Tips box */}
                <Card className="mt-4 bg-primary/5 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Shield className="size-4 text-primary" />
                      Tips for Best Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1">
                      {step.tips.map((tip) => (
                        <li
                          key={tip}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-primary mt-1">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Supported Formats */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold tracking-tight text-center mb-8">
              Supported Formats
            </h2>
            <Card>
              <CardContent className="space-y-3 pt-6">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm">File Types</span>
                  <span className="text-sm font-medium">
                    {ALLOWED_MIME_TYPES.map((t) => t.replace("image/", "").toUpperCase()).join(", ")}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm">Max File Size</span>
                  <span className="text-sm font-medium">
                    {MAX_UPLOAD_SIZE / (1024 * 1024)}MB
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm">Max Dimensions</span>
                  <span className="text-sm font-medium">
                    {MAX_IMAGE_WIDTH}×{MAX_IMAGE_HEIGHT}px
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm">Generation Time</span>
                  <span className="text-sm font-medium">
                    Under 30 seconds
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Before/After */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto">
          <h2 className="text-2xl font-bold tracking-tight text-center mb-8">
            See It in Action
          </h2>
          <BeforeAfterCard
            styleSlug="classic-oil"
            styleName="Classic Oil"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Start Your First Painting
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            It takes under a minute from upload to download.
          </p>
          <div className="mt-8">
            <Link href="/sign-up">
              <Button size="lg">Start Free Now</Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
