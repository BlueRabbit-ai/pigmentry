"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Eye, TrendingUp } from "lucide-react";
import { R2_PUBLIC_URL } from "@/lib/r2-public";

interface GalleryCardProps {
  id: string;
  r2Key: string;
  styleName: string;
  styleSlug: string;
  sizeLabel: string;
  tags: string[];
  downloadCount: number;
  creditCost: number;
  onDownload: (id: string, r2Key: string) => void;
}

export function GalleryCard({
  id,
  r2Key,
  styleName,
  styleSlug,
  sizeLabel,
  tags,
  downloadCount,
  creditCost,
  onDownload,
}: GalleryCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const previewUrl = `${R2_PUBLIC_URL}/${r2Key}`;
  const downloadCost = 1; // 1 credit to download full-res from gallery

  return (
    <div className="group relative rounded-xl overflow-hidden border bg-card transition-shadow hover:shadow-lg">
      {/* Image */}
      <div className="relative aspect-3/4 overflow-hidden bg-muted">
        {!imageLoaded && (
          <div className="absolute inset-0 animate-pulse bg-muted" />
        )}
        <img
          src={previewUrl}
          alt={`${styleName} oil painting`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Watermark overlay */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          <span className="absolute bottom-2 left-2 text-[10px] text-white/60 font-mono select-none">
            Pigmentra Gallery
          </span>
        </div>

        {/* Hover overlay with download button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Button
            size="sm"
            onClick={() => onDownload(id, r2Key)}
            className="gap-1.5"
          >
            <Download className="size-4" />
            Download ({downloadCost} credit)
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{styleName}</span>
          <span className="text-xs text-muted-foreground">{sizeLabel}</span>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 4).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0">
                #{tag}
              </Badge>
            ))}
            {tags.length > 4 && (
              <span className="text-[10px] text-muted-foreground">
                +{tags.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Download className="size-3" />
            {downloadCount}
          </span>
          <span className="flex items-center gap-1">
            <TrendingUp className="size-3" />
            {Math.floor(downloadCount / 10)} rewards
          </span>
        </div>
      </div>
    </div>
  );
}
