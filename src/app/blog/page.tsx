import type { Metadata } from "next";
import PublicLayout from "@/components/landing/public-layout";
import { PageHeader } from "@/components/landing/page-header";
import { BlogCard } from "@/components/landing/blog-card";
import { JsonLd } from "@/components/landing/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — AI Oil Painting Tips & Inspiration",
  description:
    "Tips, inspiration, and guides for creating beautiful AI-generated oil paintings. Learn about styles, sizes, and creative techniques.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Pigmentra Blog",
    description:
      "Tips, inspiration, and guides for creating beautiful AI-generated oil paintings.",
    url: "/blog",
  },
};

interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  slug: string;
  category: string;
  readTime: string;
}

const blogPosts: BlogPost[] = [
  {
    title: "5 Tips for the Perfect AI Oil Painting",
    excerpt:
      "Learn how to choose the right photo, pick the best style, and get consistently great results from your AI painting generator.",
    date: "2026-07-01",
    slug: "5-tips-perfect-ai-oil-painting",
    category: "Guides",
    readTime: "5 min read",
  },
  {
    title: "Classic Oil vs. Luxury Color: Which Style Is Right for You?",
    excerpt:
      "A detailed comparison of our two most popular style presets, with examples and recommendations for different photo types.",
    date: "2026-06-28",
    slug: "classic-oil-vs-luxury-color",
    category: "Styles",
    readTime: "6 min read",
  },
  {
    title: "The Best Photo Types for AI Painting Conversion",
    excerpt:
      "Not all photos convert equally well. Discover which types of photos produce the most stunning oil painting results.",
    date: "2026-06-25",
    slug: "best-photo-types-for-ai-painting",
    category: "Tips",
    readTime: "4 min read",
  },
  {
    title: "How to Choose the Right Wallpaper Size for Your Device",
    excerpt:
      "A quick guide to matching output sizes with your devices — phone, laptop, tablet, or desktop — for the perfect fit.",
    date: "2026-06-20",
    slug: "choose-right-wallpaper-size",
    category: "Guides",
    readTime: "4 min read",
  },
  {
    title: "Behind the Scenes: How AI Creates Oil Paintings",
    excerpt:
      "Curious about the technology? We explain in simple terms how AI models transform photographs into painterly artworks.",
    date: "2026-06-15",
    slug: "how-ai-creates-oil-paintings",
    category: "Technology",
    readTime: "7 min read",
  },
  {
    title: "Creative Ways to Use Your AI-Generated Paintings",
    excerpt:
      "Beyond wallpapers: print them, gift them, use them in design projects — 10 creative ideas for your AI-generated art.",
    date: "2026-06-10",
    slug: "creative-ways-to-use-paintings",
    category: "Inspiration",
    readTime: "5 min read",
  },
];

const categories = ["All", "Guides", "Styles", "Tips", "Technology", "Inspiration"];

const blogSchema = {
  "@type": "Blog",
  name: "Pigmentra Blog",
  description: "Tips, inspiration, and guides for AI oil painting generation.",
  blogPost: blogPosts.map((post) => ({
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    url: `https://pigmentra.com/blog/${post.slug}`,
    author: {
      "@type": "Organization",
      name: "Pigmentra",
    },
  })),
};

export default function BlogPage() {
  return (
    <PublicLayout>
      <JsonLd data={blogSchema} />

      <PageHeader
        title="Blog"
        description="Tips, inspiration, and guides for creating beautiful AI-generated oil paintings. Learn about styles, sizes, and creative techniques."
      />

      <section className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Blog post grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {blogPosts.map((post) => (
                  <BlogCard key={post.slug} {...post} />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="sticky top-20 space-y-6">
                {/* Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Categories</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {categories.map((cat) => (
                        <Badge key={cat} variant="secondary" className="cursor-pointer">
                          {cat}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Posts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Recent Posts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {blogPosts.slice(0, 4).map((post) => (
                        <li key={post.slug}>
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-sm hover:text-primary transition-colors line-clamp-2"
                          >
                            {post.title}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {post.date}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Newsletter placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Newsletter</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Get tips and inspiration delivered to your inbox.
                    </p>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      className="w-full px-3 py-1.5 text-sm rounded-md border bg-background"
                    />
                    <Button size="sm" className="w-full">
                      Subscribe
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
