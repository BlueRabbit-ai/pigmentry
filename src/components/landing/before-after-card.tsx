import { ImagePlaceholder } from "./image-placeholder";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface BeforeAfterCardProps {
  styleSlug: string;
  styleName: string;
}

export function BeforeAfterCard({
  styleSlug,
  styleName,
}: BeforeAfterCardProps) {
  return (
    <div className="min-w-[300px] flex-shrink-0 snap-start">
      <div className="flex gap-1">
        {/* Before */}
        <div className="flex-1">
          <ImagePlaceholder
            variant="before"
            aspectRatio="3:4"
            className="rounded-r-none"
          />
        </div>
        {/* After */}
        <div className="flex-1">
          <ImagePlaceholder
            variant="after"
            aspectRatio="3:4"
            className="rounded-l-none"
          />
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <Link
          href={`/styles#${styleSlug}`}
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          {styleName}
        </Link>
        <Badge variant="outline" className="text-xs">
          Before → After
        </Badge>
      </div>
    </div>
  );
}
