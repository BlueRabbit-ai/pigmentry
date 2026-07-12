"use client";

import { STYLE_PRESETS } from "@/lib/prompts";
import { cn } from "@/lib/utils";
import { Palette } from "lucide-react";

interface StyleSelectorProps {
  selected: string;
  onSelect: (slug: string) => void;
}

export function StyleSelector({ selected, onSelect }: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {STYLE_PRESETS.map((style) => (
        <button
          key={style.slug}
          type="button"
          onClick={() => onSelect(style.slug)}
          className={cn(
            "text-left p-4 rounded-xl border-2 transition-all",
            selected === style.slug
              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
              : "border-border hover:border-muted-foreground/30 hover:bg-muted/30"
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <Palette
              className={cn(
                "size-4",
                selected === style.slug ? "text-primary" : "text-muted-foreground"
              )}
            />
            <span className="font-medium text-sm">{style.name}</span>
          </div>
          <p className="text-xs text-muted-foreground">{style.description}</p>
        </button>
      ))}
    </div>
  );
}
