"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Share2,
  Download,
  ShieldCheck,
  Sparkles,
  BedDouble,
  Bath,
  Maximize,
  Compass,
  Car,
  Calendar,
  Layers,
  CheckCircle2,
  Phone,
  Mail,
  MessageCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Building,
  Check,
} from "lucide-react";
import { Property } from "@/lib/types";
import { formatCurrency, formatArea } from "@/lib/utils";
import { useWishlist } from "@/lib/wishlist-context";
import { useAuth } from "@/lib/auth-context";
import { ScheduleVisitModal } from "@/components/schedule-visit-modal";
import { EMICalculator } from "@/components/emi-calculator";
import { MapView } from "@/components/map-view";
import { PropertyCard } from "@/components/property-card";
import { DataStore } from "@/lib/store";

interface PropertyDetailClientProps {
  property: Property;
  similarProperties: Property[];
}

export function PropertyDetailClient({
  property,
  similarProperties,
}: PropertyDetailClientProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const wishlisted = isWishlisted(property.id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [virtualTourOpen, setVirtualTourOpen] = useState(false);

  // Quick inquiry sidebar state
  const [inquiryName, setInquiryName] = useState(user?.name || "");
  const [inquiryEmail, setInquiryEmail] = useState(user?.email || "");
  const [inquiryPhone, setInquiryPhone] = useState(user?.phone || "");
  const [inquiryMessage, setInquiryMessage] = useState(
    `Hello, I am interested in ${property.title} in ${property.locality}. Please provide title documents and arrange a site walkthrough.`
  );
  const [inquirySent, setInquirySent] = useState(false);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail) return;

    DataStore.createInquiry({
      propertyId: property.id,
      userId: user?.id || null,
      name: inquiryName,
      email: inquiryEmail,
      phone: inquiryPhone || "+91 98765 43210",
      message: inquiryMessage,
      visitType: "IN_PERSON",
    });

    setInquirySent(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this luxury property on LandParcel: ${property.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Property link copied to clipboard!");
    }
  };

  const images = property.images && property.images.length > 0
    ? property.images
    : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85"];

  // RealEstate JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SingleFamilyResidence",
    name: property.title,
    description: property.description,
    image: images,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address,
      addressLocality: property.locality,
      addressRegion: property.city,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: property.lat,
      longitude: property.lng,
    },
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    floorSize: {
      "@type": "QuantitativeValue",
      value: property.areaSqFt,
      unitCode: "FTK",
    },
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-slate-50 text-slate-900 py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Breadcrumbs & Header Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Link href="/" className="hover:text-emerald-700">Home</Link>
              <span>/</span>
              <Link href="/properties" className="hover:text-emerald-700">Properties</Link>
              <span>/</span>
              <Link href={`/properties?city=${property.city}`} className="hover:text-emerald-700">{property.city}</Link>
              <span>/</span>
              <span className="text-slate-800 truncate max-w-[200px]">{property.title}</span>
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:text-slate-900 shadow-xs transition-colors cursor-pointer"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Share</span>
              </button>
              
            </div>
          </div>

          {/* Title & Price Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-200 pb-6">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {property.featured && (
                  <span className="flex items-center gap-1 rounded-md bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-950 shadow-xs">
                    <Sparkles className="h-3 w-3" />
                    Featured Exclusive
                  </span>
                )}
                <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  {property.listingType === "SALE" ? "For Sale" : "For Rent"}
                </span>
                {property.verified && (
                  <span className="flex items-center gap-1 rounded-md bg-white border border-slate-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 shadow-xs">
                    <ShieldCheck className="h-3 w-3" />
                    RERA Verified
                  </span>
                )}
               
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {property.title}
              </h1>             
            </div>

            <div className="text-left lg:text-right shrink-0">
              <div className="text-3xl sm:text-4xl font-black text-emerald-700 tracking-tight">
                {formatCurrency(property.price)}
                {property.listingType === "RENT" && (
                  <span className="text-sm font-normal text-slate-500"> / month</span>
                )}
              </div>
              {property.areaSqFt > 0 && (
                <div className="text-xs text-slate-500 mt-1 font-medium">
                  Maintenance: {property.maintenanceFee ? `₹${property.maintenanceFee.toLocaleString()}/mo` : "Included"}
                </div>
              )}
            </div>
          </div>

          {/* High-Res Media Gallery */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-[420px] sm:h-[500px]">
              {/* Main Big Photo (8 cols on lg) */}
              <div
                onClick={() => setLightboxOpen(true)}
                className="lg:col-span-8 relative h-full rounded-3xl overflow-hidden cursor-pointer group border border-slate-200 shadow-sm"
              >
                <Image
                  src={images[activeImageIndex]}
                  alt={property.title}
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-xl bg-white/95 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-slate-900 border border-slate-200 shadow-md">
                    <Eye className="h-3.5 w-3.5 text-emerald-600" />
                    View Gallery ({images.length} Photos)
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVirtualTourOpen(true);
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-600/90 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-600 transition-colors shadow-md"
                  >
                    <span>3D Virtual Tour</span>
                  </button>
                </div>
              </div>

              {/* Thumbnails Stack (4 cols on lg) */}
              <div className="hidden lg:grid grid-rows-3 gap-3 lg:col-span-4 h-full">
                {images.slice(0, 3).map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative rounded-2xl overflow-hidden cursor-pointer border transition-all ${
                      activeImageIndex === idx
                        ? "border-emerald-600 ring-2 ring-emerald-200 shadow-md"
                        : "border-slate-200 hover:border-slate-400 opacity-90 hover:opacity-100"
                    }`}
                  >
                    <Image src={img} alt="Thumbnail" fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Thumbnails horizontal strip */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative h-16 w-24 shrink-0 rounded-xl overflow-hidden border ${
                    activeImageIndex === idx ? "border-emerald-600 ring-2 ring-emerald-200" : "border-slate-200"
                  }`}
                >
                  <Image src={img} alt="Thumb" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Main Content & Sticky Inquiry Sidebar Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Main Details Column (8 cols) */}
            <div className="lg:col-span-8 space-y-10">
              {/* Key Specs Card */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Property Specifications</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
                    <span className="text-slate-500 block mb-1">Super Area</span>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                      <Maximize className="h-4 w-4 text-emerald-600" />
                      <span>{formatArea(property.areaSqFt)}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
                    <span className="text-slate-500 block mb-1">Carpet Area</span>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                      <Layers className="h-4 w-4 text-emerald-600" />
                      <span>{property.carpetArea ? formatArea(property.carpetArea) : "N/A"}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
                    <span className="text-slate-500 block mb-1">Bedrooms</span>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                      <BedDouble className="h-4 w-4 text-emerald-600" />
                      <span>{property.bedrooms > 0 ? `${property.bedrooms} BHK` : "Open Plan"}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
                    <span className="text-slate-500 block mb-1">Bathrooms</span>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                      <Bath className="h-4 w-4 text-emerald-600" />
                      <span>{property.bathrooms} Luxury Baths</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
                    <span className="text-slate-500 block mb-1">Facing / Vastu</span>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                      <Compass className="h-4 w-4 text-emerald-600" />
                      <span>{property.facing || "North-East"}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
                    <span className="text-slate-500 block mb-1">Parking Slots</span>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                      <Car className="h-4 w-4 text-emerald-600" />
                      <span>{property.parking} Dedicated</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
                    <span className="text-slate-500 block mb-1">Property Age / Status</span>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                      <Calendar className="h-4 w-4 text-emerald-600" />
                      <span>{property.propertyAge || "Ready to Move"}</span>
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200/80">
                    <span className="text-slate-500 block mb-1">Floor Level</span>
                    <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900">
                      <Building className="h-4 w-4 text-emerald-600" />
                      <span>
                        {property.floor ? `${property.floor} of ${property.totalFloors}` : "Independent"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Architectural Description */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900">About this Residence</h2>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Comprehensive Amenities Checklist */}
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Amenities & Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {property.amenities.map((amenity, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-3 text-xs text-slate-800 border border-slate-200/80"
                    >
                      <div className="flex h-5 w-5 items-center justify-center rounded-md bg-emerald-100 text-emerald-700 shrink-0">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-medium">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
        
            </div>

        
          </div>

          {/* Similar Recommended Properties */}
          {similarProperties.length > 0 && (
            <div className="pt-12 border-t border-slate-200 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                    Recommendations
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-0.5">
                    Similar Properties in {property.city}
                  </h2>
                </div>
                <Link
                  href={`/properties?city=${property.city}`}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  View All in {property.city} &rarr;
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similarProperties.map((p) => (
                  <PropertyCard key={p.id} property={p} layout="grid" />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 animate-in fade-in">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 z-10 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 cursor-pointer"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center">
            <Image
              src={images[activeImageIndex]}
              alt="Lightbox"
              fill
              className="object-contain"
            />
          </div>

          <button
            onClick={() => setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white hover:bg-emerald-600 transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={() => setActiveImageIndex((prev) => (prev + 1) % images.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white hover:bg-emerald-600 transition-colors cursor-pointer"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* 3D Virtual Tour Modal */}
      {virtualTourOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-4xl rounded-3xl overflow-hidden border border-slate-200 bg-white p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600" />
                3D Interactive Walkthrough Simulator
              </h3>
              <button
                onClick={() => setVirtualTourOpen(false)}
                className="rounded-full p-1.5 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative h-[420px] w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
              <Image
                src={images[0]}
                alt="3D View"
                fill
                className="object-cover filter brightness-75"
              />
              <div className="relative z-10 text-center space-y-3 p-6 bg-white/95 rounded-2xl border border-slate-200 max-w-md backdrop-blur-md shadow-xl">
                <h4 className="text-base font-bold text-slate-900">Interactive 360° Panorama Live</h4>
                <p className="text-xs text-slate-600">
                  Rotate your viewport to inspect the living room, sky deck, and designer Italian master suite.
                </p>
                <button
                  onClick={() => setScheduleModalOpen(true)}
                  className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 cursor-pointer shadow-md"
                >
                  Book Live Video Walkthrough
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Visit Modal */}
      <ScheduleVisitModal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        property={property}
      />
    </>
  );
}
