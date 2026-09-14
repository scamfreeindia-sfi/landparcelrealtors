import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://landparcelrealtors.com"),
  title: {
    template: "%s | LandParcel Realtors",
    default:
      "Property Dealer in Mohali, Chandigarh, New Chandigarh & Kharar | LandParcel Realtors",
  },
  description:
    "Buy flats, villas, plots, and commercial property in Mohali, Chandigarh, New Chandigarh, and Kharar. LandParcel Realtors helps buyers and investors find verified homes, gated plots, and investment-ready properties in the Tricity region.",
  keywords: [
    "property dealer in Mohali",
    "real estate in Chandigarh",
    "property in New Chandigarh",
    "plots in Mohali",
    "flats in Chandigarh",
    "villas in Mohali",
    "plots in Kharar",
    "commercial property in Mohali",
    "new Chandigarh property",
    "Kharar flats",
    "Chandigarh real estate",
    "Mohali property dealer",
    "real estate in Kharar",
    "New Chandigarh villas",
    "RERA verified properties in Tricity",
  ],
  authors: [{ name: "LandParcel Realtors" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://landparcelrealtors.com",
    title:
      "LandParcel Realtors | Property in Mohali, Chandigarh, New Chandigarh & Kharar",
    description:
      "Explore premium residential and commercial property in Mohali, Chandigarh, New Chandigarh, and Kharar with verified listings, investment guidance, and personalized site visits.",
    siteName: "LandParcel Realtors",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        {/* Leaflet CSS for Map rendering */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-emerald-100 selection:text-emerald-900"
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
