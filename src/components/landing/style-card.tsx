import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Palette } from "lucide-react";

const STYLE_COLORS: Record<string, string[]> = {
  "classic-oil": ["#8B6914", "#C49A3C", "#D4A76A", "#E8D5B7", "#2C1810"],
  "luxury-color": ["#1A3A5C", "#C41E3A", "#DAA520", "#2E8B57", "#4B0082"],
  "selective-color": ["#8B8682", "#B8B0A8", "#C41E3A", "#2C5F8A", "#D4C5B0"],
  "desktop-wallpaper": ["#4A7C96", "#8FBFB0", "#C4A882", "#E8D5B7", "#3D5A80"],
};

const STYLE_USE_CASES: Record<string, string[]> = {
  "classic-oil": ["Portraits", "Landscapes", "Family photos", "Pet portraits"],
  "luxury-color": [
    "Travel photos",
    "Nature scenes",
    "Cityscapes",
    "Special occasions",
  ],
  "selective-color": [
    "Product photos",
    "Fashion shots",
    "Food photography",
    "Artistic portraits",
  ],
  "desktop-wallpaper": [
    "Desktop backgrounds",
    "Wide landscapes",
    "Group photos",
    "Architecture",
  ],
};

interface StyleCardProps {
  slug: string;
  name: string;
  description: string;
}

export function StyleCard({ slug, name, description }: StyleCardProps) {
  const colors = STYLE_COLORS[slug] ?? STYLE_COLORS["classic-oil"];
  const useCases = STYLE_USE_CASES[slug] ?? STYLE_USE_CASES["classic-oil"];

  return (
    <Card id={slug} className="group hover:ring-2 hover:ring-primary/20 transition-all">
      {/* Color palette bar */}
      <div className="flex h-3 -mt-(--card-spacing) rounded-t-xl overflow-hidden">
        {colors.map((color, i) => (
          <div
            key={i}
            className="flex-1"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Palette className="size-5 text-primary" />
          <CardTitle>{name}</CardTitle>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-1.5">
          {useCases.map((useCase) => (
            <Badge key={useCase} variant="secondary">
              {useCase}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
