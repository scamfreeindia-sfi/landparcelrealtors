"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Building2,
  Heart,
  User,
  PlusCircle,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  Briefcase,
  SlidersHorizontal,
  LogOut,
  MapPin,
  Sparkles,
  Phone,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useWishlist } from "@/lib/wishlist-context";
import { AuthModal } from "./auth-modal";
import { ProfileModal } from "./profile-modal";
import Image from "next/image";

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5" fill="currentColor">
      <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.3c0-.9.3-1.5 1.7-1.5H17V2.8c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H8v3.2h2.3v8h3.2Z" />
    </svg>
  );
}

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-3.5 w-3.5" fill="currentColor">
      <path d="M21.6 8.2a2.9 2.9 0 0 0-2.1-2.1C17.7 5.7 12 5.7 12 5.7s-5.7 0-7.5.4A2.9 2.9 0 0 0 2.4 8.2 30.8 30.8 0 0 0 2 12a30.8 30.8 0 0 0 .4 3.8 2.9 2.9 0 0 0 2.1 2.1c1.8.4 7.5.4 7.5.4s5.7 0 7.5-.4a2.9 2.9 0 0 0 2.1-2.1A30.8 30.8 0 0 0 22 12a30.8 30.8 0 0 0-.4-3.8ZM10 15.5v-7l6 3.5-6 3.5Z" />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname?.startsWith("/admin")) {
    return null;
  }
  const { user, role, loginAs, logout, isAuthenticated } = useAuth();
  const { count: wishlistCount } = useWishlist();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState("All Area");

  

  const cities = ["All", "Chandigarh", "New Chandigarh", "Mohali", "Kharar"];

  

  return (
    <>
      <div className="border-b border-slate-200 bg-slate-50/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-1.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-600">
            <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
              Follow us
            </span>
            <div className="flex items-center gap-2">
              <Link
                href="https://www.instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
              >
                <InstagramIcon />
              </Link>
              <Link
                href="https://www.facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
              >
                <FacebookIcon />
              </Link>
              <Link
                href="https://www.youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700"
              >
                <YoutubeIcon />
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px] font-semibold text-slate-700">
            <a href="tel:+919876543210" className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700">
              <Phone className="h-3.5 w-3.5" />
              <span>+91 98765 43210</span>
            </a>
            <a href="tel:+919812345678" className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-slate-700 transition-colors hover:border-emerald-300 hover:text-emerald-700">
              <Phone className="h-3.5 w-3.5" />
              <span>+91 98123 45678</span>
            </a>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 shadow-xs backdrop-blur-xl transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">

          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="group flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="LandParcel Logo"
                width={150}
                height={50}
                priority
                className="h-10 w-auto object-contain rounded-lg transition-transform group-hover:scale-105"
              />

              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Land<span className="text-emerald-600">Parcel</span>
                </span>

                <span className="block text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                  Real Estate
                </span>
              </div>
            </Link>

            {/* City Selector */}
          </div>
          {/* Desktop Navigation Links */}
         

          {/* Right Action Icons & Role Switcher */}
          <div className="hidden sm:flex items-center gap-3">
            
            {/* Post Property CTA Button */}
            <Link
              href="/agent?action=new"
              className="hidden lg:flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-500 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="h-4 w-4" />
              <span>List Property</span>
              <span className="rounded bg-emerald-800/40 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-100">
                Free
              </span>
            </Link>

         
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/dashboard?tab=wishlist"
              className="relative p-2 text-slate-700 hover:text-slate-900"
            >



              
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute 1 top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-[9px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3">
            <div className="pb-3 border-b border-slate-100">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">
                Select City
              </label>
              <select
                value={selectedCity}
                onChange={(e) => {
                  setMobileMenuOpen(false);
                }}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800"
              >
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          
            <div className="pt-3 border-t border-slate-100 space-y-2">
                        
              <Link
                href="/agent?action=new"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-semibold text-white"
              >
                <PlusCircle className="h-4 w-4" />
                List Property For Free
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />

      {/* Profile Settings Modal */}
      <ProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
    </>
  );
}
