import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImagePlaceholder } from "./image-placeholder";
import { Calendar } from "lucide-react";
import Link from "next/link";

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  category?: string;
  readTime?: string;
}

export function BlogCard({
  title,
  excerpt,
  date,
  slug,
  category,
  readTime,
}: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`}>
      <Card className="group hover:ring-2 hover:ring-primary/20 transition-all h-full">
        <ImagePlaceholder aspectRatio="16:9" />
        <CardHeader>
          <div className="flex items-center gap-2">
            {category && <Badge variant="secondary">{category}</Badge>}
          </div>
          <CardTitle className="group-hover:text-primary transition-colors">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">{excerpt}</p>
          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              {date}
            </span>
            {readTime && <span>{readTime}</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
