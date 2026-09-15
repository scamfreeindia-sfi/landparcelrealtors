"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SAMPLE_PROPERTIES, POPULAR_CITIES } from "@/lib/sample-data";
import {  
  DeveloperPartners,
  FeaturedProperties,
  HomeHero,
  SearchTab,
  TrustSection,
} from "@/components/home-sections";

export default function HomePage() {
  const router = useRouter();
  const [activeSearchTab, setActiveSearchTab] = useState<SearchTab>("BUY");
  const [searchCity, setSearchCity] = useState("All Cities");
  const [searchType, setSearchType] = useState("ALL");
  const [searchBudget, setSearchBudget] = useState("ALL");
  const [searchBHK, setSearchBHK] = useState("ALL");
  const [featuredCategory, setFeaturedCategory] = useState("ALL");

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "LandParcel Realtors",
    url: "https://landparcelrealtors.com",
    areaServed: ["Mohali", "Chandigarh", "New Chandigarh", "Kharar", "Punjab"],
    description:
      "Property dealer and real estate consultant for residential plots, apartments, villas, and commercial investments in Mohali, Chandigarh, New Chandigarh, and Kharar.",
    knowsAbout: [
      "flats in Mohali",
      "plots in Chandigarh",
      "villas in New Chandigarh",
      "commercial property in Kharar",
      "real estate investment in Tricity",
    ],
    address: {
      "@type": "PostalAddress",
      addressRegion: "Punjab",
      addressCountry: "IN",
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Where can I buy property in Mohali, Chandigarh, and New Chandigarh?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "LandParcel Realtors helps buyers find residential plots, flats, villas, and commercial properties in Mohali, Chandigarh, New Chandigarh, and Kharar with verified documentation and local market guidance.",
        },
      },
      {
        "@type": "Question",
        name: "Is Kharar a good place to invest in property?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Kharar is a growing real estate market with strong residential demand, better entry pricing, and connectivity to Mohali, Chandigarh, and the airport corridor, making it attractive for buyers and investors.",
        },
      },
      {
        "@type": "Question",
        name: "Do you help with flats, villas, and plots in the Tricity region?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, LandParcel Realtors supports buyers for flats, villas, plots, and commercial spaces across Mohali, Chandigarh, New Chandigarh, and Kharar.",
        },
      },
    ],
  };

  const handleHeroSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();

    if (activeSearchTab === "BUY") params.set("listingType", "SALE");
    if (activeSearchTab === "RENT") params.set("listingType", "RENT");
    if (activeSearchTab === "COMMERCIAL/INDUSTRIAL") {
      params.set("propertyType", "COMMERCIAL");
      if (searchType !== "ALL") params.set("commercialType", searchType);
    } else if (searchType !== "ALL") {
      params.set("propertyType", searchType);
    }
    if (searchCity !== "All Cities") params.set("city", searchCity);
    if (activeSearchTab !== "COMMERCIAL/INDUSTRIAL" && searchBHK !== "ALL") {
      params.set("bedrooms", searchBHK);
    }

    const areaRanges: Record<string, [string?, string?]> = {
      under_200: [undefined, "200"],
      "200_500": ["200", "500"],
      "500_1000": ["500", "1000"],
      "1000_3000": ["1000", "3000"],
      "3000_5000": ["3000", "5000"],
      "5000_plus": ["5000", undefined],
    };
    if (activeSearchTab === "COMMERCIAL/INDUSTRIAL" && searchBHK !== "ALL") {
      const [minArea, maxArea] = areaRanges[searchBHK] ?? [];
      if (minArea) params.set("minArea", minArea);
      if (maxArea) params.set("maxArea", maxArea);
    }

    const budgets: Record<string, [string, string?]> = {
      under_1cr: ["maxPrice", "10000000"],
      "1cr_3cr": ["minPrice", "10000000"],
      "3cr_10cr": ["minPrice", "30000000"],
      "10cr_plus": ["minPrice", "100000000"],
    };
    const budget = budgets[searchBudget];
    if (budget) params.set(budget[0], budget[1] ?? "");
    if (searchBudget === "1cr_3cr") params.set("maxPrice", "30000000");
    if (searchBudget === "3cr_10cr") params.set("maxPrice", "100000000");

    router.push(`/properties?${params.toString()}`);
  };

  const filteredFeaturedProperties = SAMPLE_PROPERTIES.filter(
    (property) =>
      property.status === "APPROVED" &&
      (featuredCategory === "ALL" || property.propertyType === featuredCategory)
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <HomeHero
          activeSearchTab={activeSearchTab}
          searchCity={searchCity}
          searchType={searchType}
          searchBudget={searchBudget}
          searchBHK={searchBHK}
          onSearchTabChange={setActiveSearchTab}
          onCityChange={setSearchCity}
          onTypeChange={setSearchType}
          onBudgetChange={setSearchBudget}
          onBHKChange={setSearchBHK}
          onSubmit={handleHeroSearch}
        />
        <FeaturedProperties
          properties={filteredFeaturedProperties}
          category={featuredCategory}
          onCategoryChange={setFeaturedCategory}
        />
        <TrustSection />
        <DeveloperPartners />
      </div>
    </>
  );
}
