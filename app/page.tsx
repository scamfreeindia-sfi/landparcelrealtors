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

  const handleHeroSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();

    if (activeSearchTab === "BUY") params.set("listingType", "SALE");
    if (activeSearchTab === "RENT") params.set("listingType", "RENT");
    if (activeSearchTab === "COMMERCIAL") params.set("propertyType", "COMMERCIAL");
    if (activeSearchTab === "PLOT") params.set("propertyType", "PLOT");
    if (searchCity !== "All Cities") params.set("city", searchCity);
    if (searchType !== "ALL") params.set("propertyType", searchType);
    if (searchBHK !== "ALL") params.set("bedrooms", searchBHK);

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
  );
}
