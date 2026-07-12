import type { Metadata } from "next";
import PublicLayout from "@/components/landing/public-layout";
import { PageHeader } from "@/components/landing/page-header";
import { JsonLd } from "@/components/landing/json-ld";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ImagePlaceholder } from "@/components/landing/image-placeholder";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Gallery — Community Oil Paintings",
  description:
    "Browse oil paintings created by the Pigmentra community. Get inspired by real photo-to-painting transformations.",
  alternates: { canonical: "/gallery" },
  openGraph: {
    title: "Pigmentra Community Gallery",
    description:
      "Browse oil paintings created by the Pigmentra community.",
    url: "/gallery",
  },
};

// Gallery items will be fetched from Convex in production.
// For now, the page shows an invite to be among the first to publish.
const galleryItems: Array<{
  id: string;
  imageDataUrl: string;
  styleName: string;
  sizeLabel: string;
  creditCost: number;
}> = [];

export default function GalleryPage() {
  return (
    <PublicLayout>
      <PageHeader
        title="Community Gallery"
        description="Browse oil paintings shared by the Pigmentra community. Publish your own creations and earn 1 credit per submission."
      />

      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-5xl mx-auto">
          {galleryItems.length === 0 ? (
            <div className="text-center py-20">
              <ImagePlaceholder
                aspectRatio="16:9"
                variant="after"
                className="max-w-sm mx-auto mb-6"
              />
              <h2 className="text-2xl font-bold tracking-tight mb-2">
                The Gallery Awaits
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                No paintings have been shared yet. Be one of the first to
                publish your creation and earn a 1-credit reward!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/sign-up">
                  <Button size="lg">Create & Publish Yours</Button>
                </Link>
                <Link href="/examples">
                  <Button variant="outline" size="lg">
                    See Examples
                  </Button>
                </Link>
              </div>

              {/* Info card about publishing */}
              <div className="mt-12 max-w-lg mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="rounded-lg border p-4">
                  <div className="text-2xl font-bold text-primary mb-1">
                    1
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Generate a painting
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-2xl font-bold text-primary mb-1">
                    2
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Publish to gallery
                  </p>
                </div>
                <div className="rounded-lg border p-4">
                  <div className="text-2xl font-bold text-primary mb-1">
                    +1
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Earn 1 free credit
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-4">
                Only successfully completed generations (where credits were
                deducted) can be published. Failed conversions are not eligible.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl overflow-hidden border bg-card"
                >
                  <img
                    src={item.imageDataUrl}
                    alt={`${item.styleName} oil painting`}
                    className="w-full aspect-[3:4] object-cover"
                  />
                  <div className="p-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{item.styleName}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.sizeLabel}
                      </p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {item.creditCost} credit{item.creditCost > 1 ? "s" : ""}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
