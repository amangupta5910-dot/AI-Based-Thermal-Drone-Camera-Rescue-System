import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import "leaflet/dist/leaflet.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Starfleet Disaster Response - AI-Powered Emergency Management",
  description: "Comprehensive AI-powered disaster response platform with real-time monitoring, predictive analytics, and emergency coordination tools.",
  keywords: ["disaster response", "emergency management", "AI", "predictive analytics", "real-time monitoring", "emergency coordination"],
  authors: [{ name: "Starfleet Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Starfleet DR",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "Starfleet Disaster Response",
    description: "AI-powered emergency management system for disaster response and coordination",
    url: "https://starfleet-disaster.com",
    siteName: "Starfleet Disaster Response",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Starfleet Disaster Response",
    description: "AI-powered emergency management system",
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Starfleet DR",
    "msapplication-TileColor": "#0f172a",
    "msapplication-config": "/browserconfig.xml",
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
        <meta name="theme-color" content="#0f172a" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
