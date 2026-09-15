"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) {
    return null;
  }
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600">
      {/* Top Banner with Trust Badges */}
      <div className="border-b border-slate-200 bg-slate-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 shrink-0 shadow-xs">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">100% RERA Verified Listings</h4>
                <p className="text-xs text-slate-500">Every title and project undergoes strict legal scrutiny</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shrink-0 shadow-xs">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Direct Builder & Verified Agent Network</h4>
                <p className="text-xs text-slate-500">Zero duplicate spam listings with transparent pricing</p>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-600 border border-teal-200 shrink-0 shadow-xs">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Dedicated Relationship Manager</h4>
                <p className="text-xs text-slate-500">Private walkthroughs and end-to-end registry assistance</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 p-2 text-white shadow-md shadow-emerald-600/20">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Land<span className="text-emerald-600">Parcel</span>
              </span>
            </Link>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Mohali's premier modern real estate marketplace for high-end luxury houses and appartments, top-notch commercial spaces, plots, and grade-A industrial assets.
            </p>

            <div className="pt-2 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Sco 363 cp square, South Ex II, TDI sector 117 Mohali</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>+91 7508964612</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>landparcelrealtors@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Quick Properties */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Explore Property Types
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/properties?propertyType=VILLA" className="text-slate-600 hover:text-emerald-600 transition-colors">
                  Luxury Sea & Hill Villas
                </Link>
              </li>
              <li>
                <Link href="/properties?propertyType=PENTHOUSE" className="text-slate-600 hover:text-emerald-600 transition-colors">
                  Sky Penthouses & Duplexes
                </Link>
              </li>
              <li>
                <Link href="/properties?propertyType=APARTMENT" className="text-slate-600 hover:text-emerald-600 transition-colors">
                  Gated High-Rise Apartments
                </Link>
              </li>
              <li>
                <Link href="/properties?propertyType=PLOT" className="text-slate-600 hover:text-emerald-600 transition-colors">
                  Residential & Gated Plots
                </Link>
              </li>
              <li>
                <Link href="/properties?propertyType=COMMERCIAL" className="text-slate-600 hover:text-emerald-600 transition-colors">
                  Commercial Offices & Retail
                </Link>
              </li>
            </ul>
          </div>

          {/* Top Cities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Premier Cities
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/properties?city=Mumbai" className="text-slate-600 hover:text-emerald-600 transition-colors">
                  Mumbai Real Estate
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Bangalore" className="text-slate-600 hover:text-emerald-600 transition-colors">
                  Bangalore Tech Corridors
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Delhi+NCR" className="text-slate-600 hover:text-emerald-600 transition-colors">
                  Delhi NCR & Golf Estates
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Hyderabad" className="text-slate-600 hover:text-emerald-600 transition-colors">
                  Hyderabad HITEC City & Villas
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Pune" className="text-slate-600 hover:text-emerald-600 transition-colors">
                  Pune Serene Residences
                </Link>
              </li>
              <li>
                <Link href="/properties?city=Goa" className="text-slate-600 hover:text-emerald-600 transition-colors">
                  Goa Portuguese Estates
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools & Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Portals & Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dashboard" className="text-slate-600 hover:text-emerald-600 transition-colors">
                  Buyer Dashboard & Saved
                </Link>
              </li>
              <li>
                <Link href="/agent" className="text-slate-600 hover:text-emerald-600 transition-colors">
                  Agent & Builder Portal
                </Link>
              </li>
              <li>
                <Link href="/#emi-calculator" className="text-slate-600 hover:text-emerald-600 transition-colors">
                  Mortgage & EMI Estimator
                </Link>
              </li>
              <li>
                <Link href="/agent?action=new" className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors">
                  + List Your Property
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <div className="mt-10 border-t border-slate-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-slate-500 text-center md:text-left">
            <p>© {new Date().getFullYear()} LandParcel Realtors All rights reserved.</p>
            
          </div>

          <div className="flex items-center gap-6 text-slate-500">
            <Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            <Link href="/rera" className="hover:text-slate-900 transition-colors">RERA Disclosures</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
