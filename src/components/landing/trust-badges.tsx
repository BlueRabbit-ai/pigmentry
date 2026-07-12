import { type LucideIcon } from "lucide-react";

interface TrustBadge {
  icon: LucideIcon;
  label: string;
}

interface TrustBadgesProps {
  badges: TrustBadge[];
}

export function TrustBadges({ badges }: TrustBadgesProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-sm text-muted-foreground">
      {badges.map((badge) => (
        <div
          key={badge.label}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50"
        >
          <badge.icon className="size-4 text-primary shrink-0" />
          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  );
}
