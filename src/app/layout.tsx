import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";

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
    default: "Pixify",
    template: "%s | Pixify",
  },
  description:
    "Create stunning YouTube thumbnails with AI. Pixify helps creators make viral thumbnails in seconds.",
  keywords: [
    "YouTube thumbnails",
    "AI thumbnail generator",
    "thumbnail maker",
    "Pixify",
    "content creation",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Pixify",
    title: "Pixify",
    description:
      "Create stunning YouTube thumbnails with AI. Pixify helps creators make viral thumbnails in seconds.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixify",
    description:
      "Create stunning YouTube thumbnails with AI. Pixify helps creators make viral thumbnails in seconds.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// JSON-LD structured data for SEO
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pixify",
  description: "AI-powered YouTube thumbnail generation platform",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen relative overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
