import { cn } from "@/lib/utils";
import { ImageIcon, Camera, Palette } from "lucide-react";

interface ImagePlaceholderProps {
  aspectRatio?: string;
  label?: string;
  variant?: "before" | "after" | "generic";
  className?: string;
}

export function ImagePlaceholder({
  aspectRatio = "16:9",
  label,
  variant = "generic",
  className,
}: ImagePlaceholderProps) {
  const Icon =
    variant === "before"
      ? Camera
      : variant === "after"
        ? Palette
        : ImageIcon;

  const variantLabel =
    label ??
    (variant === "before"
      ? "Original"
      : variant === "after"
        ? "Oil Painting"
        : undefined);

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-lg bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center",
        className
      )}
      style={{ aspectRatio }}
    >
      <Icon className="size-12 text-muted-foreground/40" />
      {variantLabel && (
        <span
          className={cn(
            "absolute top-2 left-2 px-2 py-0.5 rounded-md text-xs font-medium",
            variant === "before"
              ? "bg-background/80 text-foreground"
              : "bg-primary/80 text-primary-foreground"
          )}
        >
          {variantLabel}
        </span>
      )}
    </div>
  );
}
