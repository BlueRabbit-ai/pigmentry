"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/lib/convex-api";
import PublicLayout from "@/components/landing/public-layout";
import { PageHeader } from "@/components/landing/page-header";
import { GalleryCard } from "@/components/gallery/gallery-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImagePlaceholder } from "@/components/landing/image-placeholder";
import { Search, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { STYLE_PRESETS } from "@/lib/prompts";

// ---------------------------------------------------------------------------
// Static filter options
// ---------------------------------------------------------------------------

const STYLE_FILTERS = [
  { slug: "all", name: "All Styles" },
  ...STYLE_PRESETS.map((s) => ({ slug: s.slug, name: s.name })),
];

const SIZE_FILTERS = [
  { slug: "all", label: "All Sizes" },
  { slug: "phone", label: "Phone" },
  { slug: "square", label: "Square" },
  { slug: "laptop", label: "Laptop" },
  { slug: "custom", label: "Custom" },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function GalleryPage() {
  const [activeStyle, setActiveStyle] = useState("all");
  const [activeSize, setActiveSize] = useState("all");
  const [searchTag, setSearchTag] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadMessage, setDownloadMessage] = useState("");

  // Fetch gallery items via Convex
  const items = useQuery(
    api.gallery.getPublicItems,
    activeStyle !== "all" || activeSize !== "all" || searchTag
      ? {
          styleSlug: activeStyle !== "all" ? activeStyle : undefined,
          sizeSlug: activeSize !== "all" ? activeSize : undefined,
          tag: searchTag || undefined,
          limit: 30,
          sort: "newest" as const,
        }
      : { limit: 30, sort: "newest" as const }
  );

  // Download tracking mutation
  const recordDownload = useMutation(api.gallery.recordDownload);

  const handleDownload = useCallback(
    async (id: string, r2Key: string) => {
      setDownloadingId(id);
      setDownloadMessage("");

      try {
        // Track the download in Convex (awards +1 credit to uploader at 10-download milestones)
        const result = await recordDownload({ galleryItemId: id as any });
        const rewardMsg = result.rewardEarned
          ? " 🎉 +1 credit to the artist!"
          : "";

        // Open the download via API route (redirects to R2)
        window.open(
          `/api/gallery/download?key=${encodeURIComponent(r2Key)}&dl=1`,
          "_blank"
        );

        setDownloadMessage(`Download started!${rewardMsg}`);
        setTimeout(() => setDownloadMessage(""), 5000);
      } catch (err) {
        console.error("Download failed:", err);
        setDownloadMessage("Download failed. Please try again.");
      } finally {
        setDownloadingId(null);
      }
    },
    [recordDownload]
  );

  const clearFilters = () => {
    setActiveStyle("all");
    setActiveSize("all");
    setSearchTag("");
  };

  const hasActiveFilters =
    activeStyle !== "all" || activeSize !== "all" || searchTag !== "";

  return (
    <PublicLayout>
      <PageHeader
        title="Community Gallery"
        description="Browse oil paintings shared by the community. Download any image for 1 credit — cheaper than generating new. Publish your own and earn credits with every 10 downloads."
      />

      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Filters */}
          <div className="mb-8 space-y-4">
            {/* Style tabs */}
            <Tabs
              value={activeStyle}
              onValueChange={(v) => setActiveStyle(v.value as string)}
            >
              <TabsList className="flex-wrap">
                {STYLE_FILTERS.map((s) => (
                  <TabsTrigger
                    key={s.slug}
                    value={s.slug}
                    className="text-xs sm:text-sm"
                  >
                    {s.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Size + Tag filters row */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="flex gap-1.5 flex-wrap">
                {SIZE_FILTERS.map((s) => (
                  <Badge
                    key={s.slug}
                    variant={activeSize === s.slug ? "default" : "outline"}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setActiveSize(s.slug)}
                  >
                    {s.label}
                  </Badge>
                ))}
              </div>

              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search hashtags..."
                  value={searchTag}
                  onChange={(e) => setSearchTag(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
                {searchTag && (
                  <button
                    onClick={() => setSearchTag("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    <X className="size-3 text-muted-foreground" />
                  </button>
                )}
              </div>

              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-xs"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Results */}
          {items === undefined ? (
            /* Loading state */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-3/4 rounded-xl bg-muted animate-pulse"
                />
              ))}
            </div>
          ) : items.length === 0 ? (
            /* Empty state */
            <div className="text-center py-20">
              <ImagePlaceholder
                aspectRatio="16:9"
                variant="after"
                className="max-w-sm mx-auto mb-6"
              />
              <h2 className="text-2xl font-bold tracking-tight mb-2">
                {hasActiveFilters
                  ? "No Matching Paintings"
                  : "The Gallery Awaits"}
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {hasActiveFilters
                  ? "Try adjusting your filters or clearing them to see all paintings."
                  : "No paintings have been shared yet. Be one of the first to publish your creation and earn credits!"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {hasActiveFilters ? (
                  <Button variant="outline" onClick={clearFilters}>
                    Clear All Filters
                  </Button>
                ) : (
                  <Link href="/sign-up">
                    <Button size="lg">
                      <Sparkles className="size-4" />
                      Create & Publish Yours
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            /* Gallery grid */
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {items.length} painting{items.length !== 1 ? "s" : ""}
                {hasActiveFilters ? " matching filters" : " in the gallery"}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item: any) => (
                  <GalleryCard
                    key={item.id}
                    id={item.id}
                    r2Key={item.r2Key}
                    styleName={item.styleName}
                    styleSlug={item.styleSlug}
                    sizeLabel={item.sizeLabel}
                    tags={item.tags}
                    downloadCount={item.downloadCount}
                    creditCost={item.creditCost}
                    onDownload={handleDownload}
                  />
                ))}
              </div>

              {downloadMessage && (
                <div className="mt-4 p-3 rounded-lg bg-primary/10 text-sm text-center text-primary">
                  {downloadMessage}
                </div>
              )}

              {/* Credit info */}
              <div className="mt-12 p-6 rounded-xl border bg-muted/30 text-center">
                <h3 className="font-semibold mb-2">
                  How Gallery Credits Work
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground max-w-2xl mx-auto">
                  <div>
                    <span className="font-medium text-foreground">
                      +1 credit
                    </span>{" "}
                    when you publish a painting
                  </div>
                  <div>
                    <span className="font-medium text-foreground">
                      +1 credit
                    </span>{" "}
                    every 10 downloads of your painting
                  </div>
                  <div>
                    <span className="font-medium text-foreground">
                      -1 credit
                    </span>{" "}
                    to download a full-res painting from the gallery
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
