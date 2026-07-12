import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/providers/convex-client-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Pigmentra — AI Oil Painting Generator",
    template: "%s | Pigmentra",
  },
  description:
    "Transform your photos into stunning oil painting wallpapers with AI. Upload a photo and get a premium oil painting for your phone, laptop, or desktop in seconds.",
  keywords: [
    "ai oil painting generator",
    "photo to oil painting",
    "turn photo into painting",
    "ai painting wallpaper",
    "custom wallpaper generator",
    "phone wallpaper from photo",
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    siteName: "Pigmentra",
    title: "Pigmentra — AI Oil Painting Generator",
    description:
      "Transform your photos into stunning oil painting wallpapers with AI.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      afterSignInUrl="/app"
      afterSignUpUrl="/app"
      afterSignOutUrl="/"
    >
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
        suppressHydrationWarning
      >
        <body className="min-h-full flex flex-col">
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
