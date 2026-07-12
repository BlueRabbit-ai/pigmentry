import type { Metadata } from "next";
import PublicLayout from "@/components/landing/public-layout";
import { PageHeader } from "@/components/landing/page-header";
import { BeforeAfterCard } from "@/components/landing/before-after-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JsonLd } from "@/components/landing/json-ld";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { STYLE_PRESETS } from "@/lib/prompts";

export const metadata: Metadata = {
  title: "Examples — Photo to Oil Painting Transformations",
  description:
    "See real before-and-after examples of photos transformed into stunning oil paintings with Pigmentra's AI generator.",
  alternates: { canonical: "/examples" },
  openGraph: {
    title: "Pigmentra Examples Gallery",
    description:
      "See real before-and-after examples of photos transformed into stunning oil paintings.",
    url: "/examples",
  },
};

// Generate 2 placeholder examples per style (8 total)
const examples = STYLE_PRESETS.flatMap((style) => [
  { id: `${style.slug}-1`, styleSlug: style.slug, styleName: style.name },
  { id: `${style.slug}-2`, styleSlug: style.slug, styleName: style.name },
]);

const gallerySchema = {
  "@type": "CollectionPage",
  name: "Pigmentra Examples Gallery",
  description:
    "Before and after examples of AI-generated oil paintings from photos.",
  hasPart: examples.map((ex) => ({
    "@type": "VisualArtwork",
    name: `${ex.styleName} Example`,
    artform: "Oil Painting",
    about: ex.styleName,
  })),
};

export default function ExamplesPage() {
  return (
    <PublicLayout>
      <JsonLd data={gallerySchema} />

      <PageHeader
        title="See the Transformation"
        description="Browse before-and-after examples across all four style presets. Every photo becomes a unique oil painting."
      />

      {/* Style Filter Tabs + Gallery */}
      <section className="container mx-auto px-4 pb-20">
        <Tabs defaultValue="all" className="max-w-5xl mx-auto">
          <div className="flex justify-center mb-10">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              {STYLE_PRESETS.map((style) => (
                <TabsTrigger key={style.slug} value={style.slug}>
                  {style.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {examples.map((ex) => (
                <BeforeAfterCard
                  key={ex.id}
                  styleSlug={ex.styleSlug}
                  styleName={ex.styleName}
                />
              ))}
            </div>
          </TabsContent>

          {STYLE_PRESETS.map((style) => (
            <TabsContent key={style.slug} value={style.slug}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {examples
                  .filter((ex) => ex.styleSlug === style.slug)
                  .map((ex) => (
                    <BeforeAfterCard
                      key={ex.id}
                      styleSlug={ex.styleSlug}
                      styleName={ex.styleName}
                    />
                  ))}
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {style.description}
                </p>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Want to Create Your Own?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Upload a photo and see the transformation yourself.
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
