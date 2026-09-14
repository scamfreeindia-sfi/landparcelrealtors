"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  Building2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Home,
  Trees,
  Briefcase,
} from "lucide-react";
import { Property } from "@/lib/types";
import { PropertyCard } from "@/components/property-card";

export type SearchTab = "BUY" | "RENT" | "COMMERCIAL" | "PLOT";

interface HomeHeroProps {
  activeSearchTab: SearchTab;
  searchCity: string;
  searchType: string;
  searchBudget: string;
  searchBHK: string;
  onSearchTabChange: (tab: SearchTab) => void;
  onCityChange: (value: string) => void;
  onTypeChange: (value: string) => void;
  onBudgetChange: (value: string) => void;
  onBHKChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

const searchTabs: { id: SearchTab; label: string; icon: React.ElementType }[] = [
  { id: "BUY", label: "Buy Property", icon: Home },
  // { id: "RENT", label: "Rent Luxury", icon: Building2 },
  // { id: "PLOT", label: "Gated Plots", icon: Trees },
  // { id: "COMMERCIAL", label: "Commercial Assets", icon: Briefcase },
];

function SearchSelect({
  label,
  icon: Icon,
  value,
  onChange,
  children,
}: {
  label: string;
  icon: React.ElementType;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-2.5 text-left">
      <label className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
        <Icon className="h-3 w-3 text-emerald-600" />
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 cursor-pointer bg-transparent text-xs font-semibold text-slate-800 outline-none"
      >
        {children}
      </select>
    </div>
  );
}

export function HomeHero({
  activeSearchTab,
  searchCity,
  searchType,
  searchBudget,
  searchBHK,
  onSearchTabChange,
  onCityChange,
  onTypeChange,
  onBudgetChange,
  onBHKChange,
  onSubmit,
}: HomeHeroProps) {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden px-4 pt-12 pb-20">
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=90"
          alt="Luxury Architecture"
          fill
          priority
          className="scale-105 object-cover object-center animate-in fade-in duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/60 to-slate-950/40" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl space-y-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-white/90 px-4 py-1.5 text-xs font-bold text-emerald-800 shadow-lg backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
           <span>Tricity Premium Luxury Real Estate</span>
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
          <span className="text-slate-600">RERA Verified</span>
        </div>

        <div className="mx-auto max-w-4xl space-y-4">
          <h1 className="text-4xl font-black leading-[1.1] tracking-tight text-white drop-shadow-md sm:text-6xl lg:text-7xl">
            Find Your Exclusive <br />
            <span className="gradient-text-emerald">Architectural Sanctuary</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-100 drop-shadow sm:text-lg">
            Create a portfolio of premium residences, luxury apartments, and top-notch commercial and industrial spaces.
          </p>
        </div>

        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200/80 bg-white/95 p-3 text-slate-900 shadow-2xl backdrop-blur-2xl sm:p-5">
          <div className="flex flex-wrap items-center gap-1 border-b border-slate-100 pb-4 sm:gap-2">
            {searchTabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => onSearchTabChange(id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all sm:text-sm ${activeSearchTab === id ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit} className="grid grid-cols-1 items-center gap-3 pt-4 sm:grid-cols-2 lg:grid-cols-5">
            <SearchSelect label="Area" icon={MapPin} value={searchCity} onChange={onCityChange}>
              <option value="All Cities">All Area</option>
              <option value="Chandigarh">Chandigarh</option>
              <option value="New Chandigarh">New Chandigarh</option>
              <option value="Mohali">Mohali</option>
              <option value="Kharar">Kharar</option>
            </SearchSelect>
            <SearchSelect label="Property Type" icon={Building2} value={searchType} onChange={onTypeChange}>
              <option value="ALL">All Types</option>
              <option value="PLOT">Plots</option>
              <option value="VILLA">Kothi</option>
              <option value="APARTMENT">Floor/Flats</option>              
            </SearchSelect>
            <SearchSelect label="Budget Range" icon={TrendingUp} value={searchBudget} onChange={onBudgetChange}>
              <option value="ALL">Any Budget</option>
              <option value="under_1cr">Under ₹1 Cr</option>
              <option value="1cr_3cr">₹1 Cr - ₹3 Cr</option>
              <option value="3cr_5cr">₹3 Cr - ₹5 Cr</option>
              <option value="5cr_plus">₹5 Cr - Above</option>
            </SearchSelect>
            <SearchSelect label="BHK" icon={Home} value={searchBHK} onChange={onBHKChange}>
              <option value="ALL">Any BHK</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4 BHK</option>
            </SearchSelect>
            <button type="submit" className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02] hover:from-emerald-500 hover:to-teal-500">
              <Search className="h-4 w-4" />
              <span>Search Estates</span>
            </button>
          </form>
        </div>

        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-4 pt-6 text-center md:grid-cols-4">
          {[['₹500+', 'Client & Investor', 'text-slate-900'], ['1000+', 'Verified Residences', 'text-emerald-700'], ['100%', 'RERA & Title Clear', 'text-slate-900'], ['99.4%', 'Client Trust Index', 'text-amber-700']].map(([value, label, color]) => (
            <div key={label} className="rounded-2xl border border-white/40 bg-white/90 p-3 shadow-md backdrop-blur-md">
              <div className={`text-xl font-black sm:text-2xl ${color}`}>{value}</div>
              <div className="text-[11px] font-semibold text-slate-600">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeaturedPropertiesProps {
  properties: Property[];
  category: string;
  onCategoryChange: (category: string) => void;
}

const propertyFilters = [
  ["ALL", "All Properties"],
  ["VILLA", "Luxury Villas"],
  ["PENTHOUSE", "Penthouses"],
  ["APARTMENT", "Apartments"],
  ["PLOT", "Land Parcels"],
  ["COMMERCIAL", "Commercial"],
] as const;

export function FeaturedProperties({ properties, category, onCategoryChange }: FeaturedPropertiesProps) {
  return (
    <section className="border-t border-slate-200 bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Handpicked Exclusives</span>
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900">Trending Luxury Residences & Estates</h2>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {propertyFilters.map(([id, label]) => (
              <button key={id} onClick={() => onCategoryChange(id)} className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${category === id ? "bg-emerald-600 font-bold text-white shadow-md shadow-emerald-600/20" : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"}`}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.slice(0, 6).map((property) => <PropertyCard key={property.id} property={property} />)}
        </div>
        <div className="mt-12 text-center">
          <Link href="/properties" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-8 py-3.5 text-sm font-bold text-slate-900 shadow-md transition-all hover:scale-105 hover:border-emerald-500 hover:bg-white">
            <span>Explore All Verified Properties</span><ArrowRight className="h-4 w-4 text-emerald-600" />
          </Link>
        </div>
      </div>
    </section>
  );
}


export function TrustSection() {
  const benefits = [
    [ShieldCheck, "100% Verified Legal & Title Due Diligence", "Every asset is vetted by premier real estate law counsels for clear RERA titles, encumbrances, and municipal sanctions.", "emerald"],
    [Award, "0% Brokerage on Builder Launch Collections", "Direct developer inventory access with price-lock guarantees and exclusive launch priority allocations.", "amber"],
    [Users, "White-Glove Private Walkthrough Concierge", "Chauffeured site inspections, high-resolution virtual 3D walkthroughs, and end-to-end registry management.", "teal"],
  ] as const;
  return (
    <section className="border-t border-slate-200 bg-slate-50 py-20">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-8">
        <div className="space-y-6 lg:col-span-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">The LandParcel Advantage</span>
          <h2 className="text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl">Setting New Standards in <br /><span className="gradient-text-emerald">High-End Real Estate</span></h2>
          <p className="text-sm leading-relaxed text-slate-600">Whether you're acquiring a trophy penthouse in Worli, a Portuguese heritage villa in North Goa, or a prime commercial parcel, our team provides discreet institutional-grade representation.</p>
          <div className="space-y-4 pt-2">
            {benefits.map(([Icon, title, description, color]) => <div key={title} className="flex items-start gap-3"><div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-${color}-200 bg-${color}-50 text-${color}-600 shadow-xs`}><Icon className="h-5 w-5" /></div><div><h4 className="text-sm font-bold text-slate-900">{title}</h4><p className="mt-0.5 text-xs text-slate-500">{description}</p></div></div>)}
          </div>
        </div>
        <div className="relative lg:col-span-6"><div className="relative h-[480px] w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl"><Image src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85" alt="Luxury Living Interior" fill className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" /><div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-xl backdrop-blur-xl"><div className="flex items-center gap-3"><Image src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Homebuyer" width={48} height={48} className="rounded-full border-2 border-emerald-500 object-cover" /><div><h4 className="text-xs font-bold text-slate-900">Aarav & Meera Sharma</h4><p className="text-[11px] font-semibold text-emerald-700">Worli Waterfront Penthouse Buyers</p></div></div><p className="mt-3 text-xs italic text-slate-600">"LandParcel arranged a private dusk walkthrough and finalized our sea-facing penthouse in Worli within 2 weeks."</p></div></div></div>
      </div>
    </section>
  );
}

export function DeveloperPartners() {
  return <section className="border-t border-slate-200 bg-white py-12"><div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8"><p className="mb-6 text-xs font-bold uppercase tracking-wider text-slate-400">Authorized Channel Partner for Premier Developers</p><div className="flex flex-wrap items-center justify-center gap-8 opacity-80 sm:gap-12">{["Hillco", "Jubilee Group", "Nobel", "Marbella",].map((partner) => <span key={partner} className="text-sm font-bold tracking-wider text-slate-700 transition-colors hover:text-emerald-700">{partner}</span>)}</div></div></section>;
}
