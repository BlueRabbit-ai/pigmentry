"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImagePlaceholder } from "@/components/landing/image-placeholder";
import {
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type GenerationStatus = "pending" | "processing" | "completed" | "failed";

interface GenerationCardProps {
  id: string;
  styleName: string;
  sizeLabel: string;
  status: GenerationStatus;
  creditsCharged: number;
  createdAt: string;
  previewUrl?: string;
  downloadUrl?: string;
}

const statusConfig: Record<GenerationStatus, {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  icon: React.ComponentType<{ className?: string }>;
}> = {
  pending: {
    label: "Pending",
    variant: "secondary",
    icon: Clock,
  },
  processing: {
    label: "Processing",
    variant: "default",
    icon: Loader2,
  },
  completed: {
    label: "Completed",
    variant: "default",
    icon: CheckCircle2,
  },
  failed: {
    label: "Failed",
    variant: "destructive",
    icon: XCircle,
  },
};

export function GenerationCard({
  styleName,
  sizeLabel,
  status,
  creditsCharged,
  createdAt,
  previewUrl,
  downloadUrl,
}: GenerationCardProps) {
  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <Card className="flex flex-row overflow-hidden">
      {/* Preview thumbnail */}
      <div className="w-24 sm:w-32 flex-shrink-0 bg-muted">
        {previewUrl ? (
          <img
            src={previewUrl}
            alt={styleName}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImagePlaceholder
            aspectRatio="1:1"
            variant="after"
            className="rounded-none h-full"
          />
        )}
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <CardHeader className="pb-1">
          <div className="flex items-center gap-2">
            <CardTitle className="text-sm">{styleName}</CardTitle>
            <Badge
              variant={config.variant}
              className="text-xs shrink-0"
            >
              <StatusIcon
                className={cn(
                  "size-3 mr-1",
                  status === "processing" && "animate-spin"
                )}
              />
              {config.label}
            </Badge>
          </div>
          <CardDescription>
            {sizeLabel} · {creditsCharged} credit{creditsCharged > 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-between mt-auto">
          <span className="text-xs text-muted-foreground">{createdAt}</span>
          {status === "completed" && (
            <a
              href={downloadUrl ?? "#"}
              download
              className="inline-flex items-center gap-1 h-6 rounded-[min(var(--radius-md),10px)] px-2 text-xs font-medium border border-border bg-background hover:bg-muted transition-colors"
            >
              <Download className="size-3" />
              Download
            </a>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
