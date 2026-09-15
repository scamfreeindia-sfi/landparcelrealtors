"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Filter,
  Search,
  MapPin,
  Building2,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Map as MapIcon,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Check,
  X,
  BedDouble,
  ChevronDown,
} from "lucide-react";
import { DataStore } from "@/lib/store";
import { Property, PropertyType, ListingType, FurnishingStatus } from "@/lib/types";
import { PropertyCard } from "@/components/property-card";
import { MapView } from "@/components/map-view";
import { formatCurrency } from "@/lib/utils";

function PropertiesExplorerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Filter States initialized from URL params
  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "ALL");
  const [listingType, setListingType] = useState<ListingType | "ALL">(
    (searchParams.get("listingType") as ListingType) || "ALL"
  );
  const [propertyType, setPropertyType] = useState<PropertyType | "ALL">(
    (searchParams.get("propertyType") as PropertyType) || "ALL"
  );
  const [commercialType, setCommercialType] = useState(searchParams.get("commercialType") || "ALL");
  const [selectedBHK, setSelectedBHK] = useState<string>(searchParams.get("bedrooms") || "ALL");
  const [minArea, setMinArea] = useState<number>(searchParams.get("minArea") ? Number(searchParams.get("minArea")) : 0);
  const [maxArea, setMaxArea] = useState<number>(searchParams.get("maxArea") ? Number(searchParams.get("maxArea")) : 0);
  const [minPrice, setMinPrice] = useState<number>(
    searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0
  );
  const [maxPrice, setMaxPrice] = useState<number>(
    searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : 350000000
  );
  const [furnishing, setFurnishing] = useState<FurnishingStatus | "ALL">("ALL");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc" | "area_desc">("newest");

  // View Layout: "grid" | "list" | "map"
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync from URL changes
  useEffect(() => {
    const cityParam = searchParams.get("city");
    if (cityParam) setSelectedCity(cityParam);

    const typeParam = searchParams.get("propertyType") as PropertyType;
    if (typeParam) setPropertyType(typeParam);

    const listParam = searchParams.get("listingType") as ListingType;
    if (listParam) setListingType(listParam);
  }, [searchParams]);

  const allAmenitiesList = [
    "Swimming Pool",
    "Gym",
    "Security",
    "EV Charging",
    "Garden",
    "Power Backup",
    "Sea View",
    "Clubhouse",
    "Balcony",
  ];

  // Fetch properties from DataStore
  const { properties, total } = useMemo(() => {
    return DataStore.getProperties({
      query: searchQuery,
      city: selectedCity,
      propertyType,
      commercialType: commercialType === "ALL" ? undefined : commercialType as "SHOP" | "SHOWROOM" | "INDUSTRIAL_SITE",
      listingType,
      bedrooms: selectedBHK,
      minArea: minArea || undefined,
      maxArea: maxArea || undefined,
      minPrice: minPrice > 0 ? minPrice : undefined,
      maxPrice: maxPrice < 350000000 ? maxPrice : undefined,
      furnishingStatus: furnishing,
      verifiedOnly,
      featuredOnly,
      amenities: selectedAmenities.length > 0 ? selectedAmenities : undefined,
      sortBy,
    });
  }, [
    searchQuery,
    selectedCity,
    propertyType,
    commercialType,
    listingType,
    selectedBHK,
    minArea,
    maxArea,
    minPrice,
    maxPrice,
    furnishing,
    verifiedOnly,
    featuredOnly,
    selectedAmenities,
    sortBy,
  ]);

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCity("ALL");
    setListingType("ALL");
    setPropertyType("ALL");
    setCommercialType("ALL");
    setSelectedBHK("ALL");
    setMinArea(0);
    setMaxArea(0);
    setMinPrice(0);
    setMaxPrice(350000000);
    setFurnishing("ALL");
    setVerifiedOnly(false);
    setFeaturedOnly(false);
    setSelectedAmenities([]);
    setSortBy("newest");
    router.push("/properties");
  };

  const activeFiltersCount = useMemo(() => {
    let c = 0;
    if (searchQuery) c++;
    if (selectedCity !== "ALL") c++;
    if (listingType !== "ALL") c++;
    if (propertyType !== "ALL") c++;
    if (selectedBHK !== "ALL") c++;
    if (minPrice > 0 || maxPrice < 350000000) c++;
    if (furnishing !== "ALL") c++;
    if (verifiedOnly) c++;
    if (featuredOnly) c++;
    c += selectedAmenities.length;
    return c;
  }, [
    searchQuery,
    selectedCity,
    listingType,
    propertyType,
    selectedBHK,
    minPrice,
    maxPrice,
    furnishing,
    verifiedOnly,
    featuredOnly,
    selectedAmenities,
  ]);

  return (
    <div className="min-h-screen bg-slate-50 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Curated Luxury Properties & Estates
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Showing <strong className="text-emerald-700 font-bold">{total} verified</strong> available listings across premier locations
            </p>
          </div>

          {/* View Toggles & Sort Menu */}
          <div className="flex flex-wrap items-center gap-3">
            {/* View Mode Buttons */}
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              <button
                onClick={() => setViewMode("grid")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-white text-emerald-700 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Grid View"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === "list"
                    ? "bg-white text-emerald-700 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="List View"
              >
                <List className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  viewMode === "map"
                    ? "bg-white text-emerald-700 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                title="Interactive Map"
              >
                <MapIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center rounded-xl bg-white border border-slate-200 px-3 py-1.5 text-xs text-slate-700 shadow-xs">
              <span className="text-slate-400 mr-2 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-800 outline-none cursor-pointer"
              >
                <option value="newest">Newest Added</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="area_desc">Area: Largest First</option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-xs"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 text-emerald-600" />
              <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 py-4">
            <span className="text-xs font-semibold text-slate-500">Active Filters:</span>
            {selectedCity !== "ALL" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-2.5 py-0.5 text-xs text-slate-800 shadow-xs">
                City: {selectedCity}
                <X className="h-3 w-3 cursor-pointer text-slate-400 hover:text-slate-700" onClick={() => setSelectedCity("ALL")} />
              </span>
            )}
            {propertyType !== "ALL" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-2.5 py-0.5 text-xs text-slate-800 shadow-xs">
                Type: {propertyType}
                <X className="h-3 w-3 cursor-pointer text-slate-400 hover:text-slate-700" onClick={() => setPropertyType("ALL")} />
              </span>
            )}
            {listingType !== "ALL" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-2.5 py-0.5 text-xs text-slate-800 shadow-xs">
                Listing: {listingType}
                <X className="h-3 w-3 cursor-pointer text-slate-400 hover:text-slate-700" onClick={() => setListingType("ALL")} />
              </span>
            )}
            {selectedBHK !== "ALL" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white border border-slate-200 px-2.5 py-0.5 text-xs text-slate-800 shadow-xs">
                BHK: {selectedBHK}
                <X className="h-3 w-3 cursor-pointer text-slate-400 hover:text-slate-700" onClick={() => setSelectedBHK("ALL")} />
              </span>
            )}
            {selectedAmenities.map((a) => (
              <span key={a} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs text-emerald-800 font-medium">
                {a}
                <X className="h-3 w-3 cursor-pointer text-emerald-600 hover:text-emerald-900" onClick={() => toggleAmenity(a)} />
              </span>
            ))}
            <button
              onClick={resetAllFilters}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold ml-2 cursor-pointer"
            >
              <RotateCcw className="h-3 w-3" />
              Reset All
            </button>
          </div>
        )}

        {/* Main Content Layout */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Filter Sidebar (4 cols on lg) */}
          <div
            className={`lg:col-span-4 space-y-6 ${
              mobileFilterOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">Search Filters</h3>
                </div>
                <button
                  onClick={resetAllFilters}
                  className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              </div>

              {/* Keyword Search */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Search Keyword / Locality
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Worli, Assagao, Golf Course..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Listing Intent
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { id: "ALL", label: "Any" },
                    { id: "SALE", label: "Buy" },
                    { id: "RENT", label: "Rent" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setListingType(tab.id as any)}
                      className={`rounded-lg py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                        listingType === tab.id
                          ? "bg-emerald-600 text-white font-bold shadow-xs"
                          : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Property Category
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                >
                  <option value="ALL">All Categories</option>
                  <option value="VILLA">Plot</option>
                  <option value="PENTHOUSE">Kothi</option>
                  <option value="APARTMENT">Floor/Flat</option>                  
                </select>
              </div>

              {/* Bedrooms (BHK) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Bedrooms (BHK)
                </label>
                <div className="grid grid-cols-6 gap-1">
                  {["ALL", "1", "2", "3", "4", "5+"].map((bhk) => (
                    <button
                      key={bhk}
                      type="button"
                      onClick={() => setSelectedBHK(bhk)}
                      className={`rounded-lg py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                        selectedBHK === bhk
                          ? "bg-emerald-600 text-white font-bold shadow-xs"
                          : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                    >
                      {bhk}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-slate-700">Max Budget</label>
                  <span className="font-bold text-emerald-700">
                    {maxPrice >= 350000000 ? "Any Budget" : formatCurrency(maxPrice)}
                  </span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={350000000}
                  step={2000000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-slate-200 accent-emerald-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>₹5 Lakh</span>
                  <span>₹15 Cr</span>
                  <span>₹35 Cr+</span>
                </div>
              </div>

              {/* Furnishing Status */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Furnishing Status
                </label>
                <select
                  value={furnishing}
                  onChange={(e) => setFurnishing(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                >
                  <option value="ALL">Any Furnishing</option>
                  <option value="FURNISHED">Fully Furnished</option>
                  <option value="SEMI_FURNISHED">Semi-Furnished</option>
                  <option value="UNFURNISHED">Unfurnished</option>
                </select>
              </div>

              {/* Amenities Checklist */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Key Amenities
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {allAmenitiesList.map((amenity) => {
                    const isChecked = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`flex items-center gap-2 rounded-lg p-2 text-xs text-left transition-colors cursor-pointer ${
                          isChecked
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold"
                            : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                        }`}
                      >
                        <div
                          className={`flex h-3.5 w-3.5 items-center justify-center rounded border ${
                            isChecked
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isChecked && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                        </div>
                        <span className="truncate">{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Trust Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="rounded bg-slate-50 border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>RERA Verified Only</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featuredOnly}
                    onChange={(e) => setFeaturedOnly(e.target.checked)}
                    className="rounded bg-slate-50 border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Featured Luxury Exclusives</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Results Column (8 cols on lg) */}
          <div className="lg:col-span-8">
            {viewMode === "map" ? (
              <div className="space-y-4">
                <MapView properties={properties} height="700px" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {properties.slice(0, 4).map((p) => (
                    <PropertyCard key={p.id} property={p} layout="grid" />
                  ))}
                </div>
              </div>
            ) : viewMode === "list" ? (
              <div className="space-y-4">
                {properties.length > 0 ? (
                  properties.map((p) => (
                    <PropertyCard key={p.id} property={p} layout="list" />
                  ))
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-4 shadow-sm">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <Search className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No Properties Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      Try relaxing your search filters or price limits to find matching luxury properties.
                    </p>
                    <button
                      onClick={resetAllFilters}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {properties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {properties.map((p) => (
                      <PropertyCard key={p.id} property={p} layout="grid" />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center space-y-4 shadow-sm">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                      <Search className="h-8 w-8" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">No Matching Properties Found</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">
                      No estates matched your current criteria. Broaden your location or price range.
                    </p>
                    <button
                      onClick={resetAllFilters}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 cursor-pointer"
                    >
                      Reset All Filters
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 p-8 text-center text-slate-500">Loading Properties...</div>}>
      <PropertiesExplorerContent />
    </Suspense>
  );
}
