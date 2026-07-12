import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  borderTop?: boolean;
  mutedBg?: boolean;
}

export function SectionWrapper({
  children,
  id,
  className,
  borderTop,
  mutedBg,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={cn(
        "container mx-auto px-4 py-20",
        borderTop && "border-t",
        mutedBg && "bg-muted/30",
        className
      )}
    >
      {children}
    </section>
  );
}
