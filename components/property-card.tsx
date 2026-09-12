"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Calendar,
} from "lucide-react";
import { Property } from "@/lib/types";
import { formatCurrency, formatArea } from "@/lib/utils";
import { useWishlist } from "@/lib/wishlist-context";
import { ScheduleVisitModal } from "./schedule-visit-modal";

interface PropertyCardProps {
  property: Property;
  layout?: "grid" | "list";
}

export function PropertyCard({ property, layout = "grid" }: PropertyCardProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(property.id);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const images = property.images && property.images.length > 0
    ? property.images
    : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(property);
  };

  const handleScheduleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setScheduleModalOpen(true);
  };

  if (layout === "list") {
    return (
      <>
        <div className="group relative flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-slate-200 bg-white hover:border-emerald-500/50 transition-all hover:shadow-xl hover:shadow-slate-200/60 shadow-xs">
          {/* Left Media Column */}
          <div className="relative h-64 sm:h-auto sm:w-72 md:w-80 shrink-0 overflow-hidden">
            <Image
              src={images[currentImageIndex]}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 320px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs ${property.listingType === "SALE" ? "bg-emerald-600" : "bg-blue-600"}`}>
                {property.listingType === "SALE" ? "For Sale" : "For Rent"}
              </span>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlistClick}
              className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700 backdrop-blur-md hover:scale-110 hover:text-rose-600 shadow-md transition-all"
            >
              <Heart
                className={`h-4 w-4 ${wishlisted ? "fill-rose-500 text-rose-500" : ""}`}
              />
            </button>

            {/* Image Slider Controls if multiple */}
            {images.length > 1 && (
              <div className="absolute inset-x-0 bottom-3 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={prevImage}
                  className="rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="flex gap-1">
                  {images.map((_, idx) => (
                    <span
                      key={idx}
                      className={`h-1.5 rounded-full transition-all ${
                        idx === currentImageIndex ? "w-4 bg-emerald-400" : "w-1.5 bg-white/60"
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextImage}
                  className="rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Right Details Column */}
          <div className="flex flex-1 flex-col justify-between p-5">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                    <span>
                      {property.locality}, {property.city}
                    </span>
                    {property.verified && (
                      <span className="flex items-center gap-0.5 text-emerald-600 font-medium ml-1">
                        <ShieldCheck className="h-3 w-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  <Link href={`/properties/${property.id}`}>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      {property.title}
                    </h3>
                  </Link>
                </div>

                <div className="text-right">
                  <div className="text-xl font-black text-emerald-600">
                    {formatCurrency(property.price)}
                    {property.listingType === "RENT" && (
                      <span className="text-xs font-normal text-slate-500"> /mo</span>
                    )}
                  </div>
                  {property.areaSqFt > 0 && (
                    <div className="text-[11px] text-slate-500">
                      ₹{Math.round(property.price / property.areaSqFt).toLocaleString()}/sq.ft
                    </div>
                  )}
                </div>
              </div>

              <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {property.description}
              </p>

              {/* Specs Icons */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-700 border-t border-slate-100 pt-3">
                {property.bedrooms > 0 && (
                  <div className="flex items-center gap-1.5">
                    <BedDouble className="h-4 w-4 text-slate-400" />
                    <span>{property.bedrooms} BHK</span>
                  </div>
                )}
                {property.bathrooms > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Bath className="h-4 w-4 text-slate-400" />
                    <span>{property.bathrooms} Baths</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Maximize className="h-4 w-4 text-slate-400" />
                  <span>{formatArea(property.areaSqFt)}</span>
                </div>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 capitalize">
                  {property.furnishingStatus.replace("_", " ").toLowerCase()}
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-[11px] font-medium text-slate-500">
                Type: <strong className="text-slate-700 capitalize">{property.propertyType.toLowerCase()}</strong>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleScheduleClick}
                  className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                  Visit
                </button>
                <Link
                  href={`/properties/${property.id}`}
                  className="flex items-center gap-1 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors shadow-xs"
                >
                  <span>Details</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <ScheduleVisitModal
          isOpen={scheduleModalOpen}
          onClose={() => setScheduleModalOpen(false)}
          property={property}
        />
      </>
    );
  }

  // Grid layout
  return (
    <>
      <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/70 hover:-translate-y-1 shadow-xs">
        {/* Card Media Section */}
        <div className="relative h-56 w-full overflow-hidden">
          <Image
            src={images[currentImageIndex]}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
            <span className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-xs ${property.listingType === "SALE" ? "bg-emerald-600" : "bg-blue-600"}`}>
              {property.listingType === "SALE" ? "For Sale" : "For Rent"}
            </span>
          </div>

          {/* Wishlist Button */}
          {/* <button
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-700 backdrop-blur-md hover:scale-110 hover:text-rose-600 shadow-md transition-all"
            title={wishlisted ? "Remove from Saved" : "Save Property"}
          > */}
            {/* <Heart
              className={`h-4 w-4 ${wishlisted ? "fill-rose-500 text-rose-500" : ""}`}
            /> */}
          {/* </button> */}

          {/* Price Overlay on image bottom */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between z-10">
            <div>
              <div className="text-xl font-black text-white drop-shadow-md">
                {formatCurrency(property.price)}
                {property.listingType === "RENT" && (
                  <span className="text-xs font-medium text-slate-200"> /mo</span>
                )}
              </div>
              {property.areaSqFt > 0 && property.listingType === "SALE" && (
                <div className="text-[10px] text-emerald-300 drop-shadow">
                  ₹{Math.round(property.price / property.areaSqFt).toLocaleString()}/sq.ft
                </div>
              )}
            </div>
            <span className="rounded-md bg-white/90 backdrop-blur-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-800 border border-slate-200">
              {property.propertyType}
            </span>
          </div>

          {/* Image Slider Controls if multiple */}
          {images.length > 1 && (
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <button
                onClick={prevImage}
                className="rounded-full bg-black/60 p-1.5 text-white hover:bg-emerald-600 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={nextImage}
                className="rounded-full bg-black/60 p-1.5 text-white hover:bg-emerald-600 transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col justify-between p-4">
          <div>            
            {/* Title */}
            <Link href={`/properties/${property.id}`}>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                {property.title}
              </h3>
            </Link>
          </div>

          {/* Specs Matrix */}
          <div className="mt-4 border-t border-slate-100 pt-3">
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              {property.bedrooms > 0 ? (
                <div className="rounded-lg bg-slate-50 p-1.5 border border-slate-200/60">
                  <div className="flex items-center justify-center gap-1 text-slate-500 mb-0.5">
                    <BedDouble className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="font-semibold text-slate-800">{property.bedrooms}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Beds</span>
                </div>
              ) : (
                <div className="rounded-lg bg-slate-50 p-1.5 border border-slate-200/60">
                  <span className="text-[10px] text-slate-600 font-medium">Open Plan</span>
                  <div className="text-[10px] text-slate-400">Layout</div>
                </div>
              )}

              {property.bathrooms > 0 ? (
                <div className="rounded-lg bg-slate-50 p-1.5 border border-slate-200/60">
                  <div className="flex items-center justify-center gap-1 text-slate-500 mb-0.5">
                    <Bath className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="font-semibold text-slate-800">{property.bathrooms}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Baths</span>
                </div>
              ) : (
                <div className="rounded-lg bg-slate-50 p-1.5 border border-slate-200/60">
                  <span className="text-[10px] text-slate-600 font-medium">Prime</span>
                  <div className="text-[10px] text-slate-400">Location</div>
                </div>
              )}

              <div className="rounded-lg bg-slate-50 p-1.5 border border-slate-200/60">
                <div className="flex items-center justify-center gap-1 text-slate-500 mb-0.5">
                  <Maximize className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="font-semibold text-slate-800 text-[11px] truncate">
                    {property.areaSqFt}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500">sq.ft</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={handleScheduleClick}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                <span>Visit</span>
              </button>
              <Link
                href={`/properties/${property.id}`}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 py-2 text-xs font-semibold text-white shadow-xs hover:from-emerald-500 hover:to-teal-500 transition-all"
              >
                <span>View</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ScheduleVisitModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        property={property}
      />
    </>
  );
}
