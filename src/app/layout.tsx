import type { Metadata } from "next";
import { Figtree, Barlow_Condensed, Geist_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-sans-var",
  subsets: ["latin"],
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-display-var",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono-var",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://usepremise.app"),
  title: "Premise — AI Technical Scoping for Agencies",
  description:
    "Turn a client brief into a technical scope in minutes. Stack recommendations, phase breakdowns, and risk analysis — ready to paste into your proposal.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Premise — AI Technical Scoping for Agencies",
    description:
      "Turn a client brief into a technical scope in minutes. Stack recommendations, phase breakdowns, and risk analysis — ready to paste into your proposal.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${figtree.variable} ${barlowCondensed.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <a href="#main" className="skip-nav">
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
