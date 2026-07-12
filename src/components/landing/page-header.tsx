interface PageHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
  return (
    <section className="container mx-auto px-4 py-16 sm:py-24">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
          {title}
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">{description}</p>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
