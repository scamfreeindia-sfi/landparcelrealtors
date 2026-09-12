import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DataStore } from "@/lib/store";
import { PropertyDetailClient } from "./property-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const property = DataStore.getPropertyById(id);

  if (!property) {
    return {
      title: "Property Not Found | LandParcel Realtors",
      description: "The requested luxury property listing is no longer available or has been moved.",
    };
  }

  const priceFormatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(property.price);

  return {
    title: property.title,
    description: `${property.bedrooms > 0 ? `${property.bedrooms} BHK ` : ""}${property.propertyType}. Priced at ${priceFormatted}. ${property.description.slice(0, 150)}...`,
    keywords: [
      property.title,
      property.propertyType,
      "Luxury Real Estate",
      "RERA Verified",
    ],
    openGraph: {
      title: `${property.title} | LandParcel Luxury Estates`,
      description: property.description.slice(0, 160),
      images: property.images.length > 0 ? [{ url: property.images[0] }] : [],
      type: "website",
    },
  };
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = DataStore.getPropertyById(id);

  if (!property) {
    notFound();
  }

  // Fetch similar properties in same city or category
  const { properties: similarProperties } = DataStore.getProperties({
    city: property.city,
    limit: 3,
  });

  return (
    <PropertyDetailClient
      property={property}
      similarProperties={similarProperties.filter((p) => p.id !== property.id).slice(0, 3)}
    />
  );
}
