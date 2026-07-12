"use client";

import { SIZE_PRESETS, CREDIT_COSTS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Monitor, Smartphone, Square, Layout } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const SIZE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  phone: Smartphone,
  square: Square,
  laptop: Monitor,
  custom: Layout,
};

interface SizeSelectorProps {
  selected: string;
  onSelect: (slug: string) => void;
}

export function SizeSelector({ selected, onSelect }: SizeSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {SIZE_PRESETS.map((size) => {
        const Icon = SIZE_ICONS[size.slug] ?? Layout;
        const credits = CREDIT_COSTS[size.slug as keyof typeof CREDIT_COSTS];

        return (
          <button
            key={size.slug}
            type="button"
            onClick={() => onSelect(size.slug)}
            className={cn(
              "text-left p-4 rounded-xl border-2 transition-all",
              selected === size.slug
                ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
            )}
          >
            <div className="flex items-center gap-2 mb-1">
              <Icon
                className={cn(
                  "size-4",
                  selected === size.slug
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              />
              <span className="font-medium text-sm">{size.label}</span>
              <Badge variant="secondary" className="ml-auto text-xs">
                {credits} credit{credits > 1 ? "s" : ""}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {size.slug === "custom"
                ? "Up to 2K resolution"
                : `${size.width} × ${size.height}`}{" "}
              · {size.aspectRatio}
            </p>
          </button>
        );
      })}
    </div>
  );
}
