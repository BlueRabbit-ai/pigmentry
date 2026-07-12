import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Monitor, Smartphone, Square, Layout } from "lucide-react";

const SIZE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  phone: Smartphone,
  square: Square,
  laptop: Monitor,
  custom: Layout,
};

interface SizeCardProps {
  slug: string;
  label: string;
  width: number;
  height: number;
  aspectRatio: string;
  description: string;
  creditCost: number;
}

export function SizeCard({
  slug,
  label,
  width,
  height,
  aspectRatio,
  description,
  creditCost,
}: SizeCardProps) {
  const Icon = SIZE_ICONS[slug] ?? Layout;

  return (
    <Card className="group hover:ring-2 hover:ring-primary/20 transition-all">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Icon className="size-5 text-primary" />
          <CardTitle>{label}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 text-sm">
          <span className="font-mono text-muted-foreground">
            {slug === "custom" ? "Up to 2K" : `${width} × ${height}`}
          </span>
          <Badge variant="outline">{aspectRatio}</Badge>
          <Badge variant="secondary">
            {creditCost} credit{creditCost > 1 ? "s" : ""}
          </Badge>
        </div>
        {/* Device mockup placeholder */}
        <div className="mt-4 flex items-center justify-center p-4 bg-muted/30 rounded-lg">
          <div
            className="border-2 border-muted-foreground/20 rounded-lg bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center"
            style={{
              width:
                slug === "phone"
                  ? 60
                  : slug === "square"
                    ? 100
                    : slug === "laptop"
                      ? 140
                      : 120,
              height:
                slug === "phone"
                  ? 120
                  : slug === "square"
                    ? 100
                    : slug === "laptop"
                      ? 90
                      : 90,
              borderStyle: slug === "custom" ? "dashed" : "solid",
            }}
          >
            <Icon className="size-6 text-muted-foreground/30" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
