"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Navigation, School, Hospital, ShoppingBag, Train, ExternalLink } from "lucide-react";
import { Property } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface MapViewProps {
  properties: Property[];
  selectedPropertyId?: string;
  center?: [number, number];
  zoom?: number;
  height?: string;
  showNearbyAmenities?: boolean;
}

export function MapView({
  properties,
  selectedPropertyId,
  center,
  zoom = 12,
  height = "600px",
  showNearbyAmenities = true,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [activeAmenity, setActiveAmenity] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Determine initial center
  const defaultCenter: [number, number] = center || (
    properties.length > 0
      ? [properties[0].lat, properties[0].lng]
      : [19.076, 72.8777] // Mumbai center default
  );

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      const L = (await import("leaflet")).default;

      // Clean up previous instance if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      if (!isMounted || !mapContainerRef.current) return;

      // Initialize map
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: zoom,
        zoomControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      // Add CartoDB Voyager Light Tiles
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>, OpenStreetMap',
        maxZoom: 19,
        subdomains: "abcd",
      }).addTo(map);

      mapInstanceRef.current = map;
      markersRef.current = [];

      // Create Custom DivIcon for Light Theme
      properties.forEach((prop) => {
        const isSelected = selectedPropertyId === prop.id;
        const iconHtml = `
          <div class="relative flex items-center justify-center cursor-pointer transition-transform hover:scale-110">
            <div class="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold shadow-lg ${
              isSelected
                ? "bg-emerald-600 text-white ring-4 ring-emerald-200"
                : "bg-white border-2 border-emerald-600 text-emerald-700"
            }">
              <span>${formatCurrency(prop.price)}</span>
            </div>
            <div class="absolute -bottom-1 h-2 w-2 rotate-45 ${
              isSelected ? "bg-emerald-600" : "bg-white border-r-2 border-b-2 border-emerald-600"
            }"></div>
          </div>
        `;

        const customIcon = L.divIcon({
          html: iconHtml,
          className: "custom-property-pin",
          iconSize: [80, 30],
          iconAnchor: [40, 30],
          popupAnchor: [0, -32],
        });

        const popupContent = `
          <div style="width: 240px; border-radius: 12px; overflow: hidden; background: #ffffff; color: #0f172a;">
            <div style="position: relative; width: 100%; height: 120px; overflow: hidden;">
              <img src="${prop.images[0]}" alt="${prop.title}" style="width: 100%; height: 100%; object-fit: cover;" />
              <div style="position: absolute; top: 8px; left: 8px; background: #006a4e; color: #ffffff; font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 4px;">
                ${prop.listingType === "SALE" ? "FOR SALE" : "FOR RENT"}
              </div>
            </div>
            <div style="padding: 10px 12px;">
              <div style="font-size: 11px; color: #64748b; margin-bottom: 2px;">📍 ${prop.locality}, ${prop.city}</div>
              <h4 style="font-size: 13px; font-weight: 700; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-bottom: 4px;">
                ${prop.title}
              </h4>
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; border-top: 1px solid #e2e8f0; padding-top: 6px;">
                <span style="font-size: 14px; font-weight: 800; color: #006a4e;">${formatCurrency(prop.price)}</span>
                <a href="/properties/${prop.id}" style="font-size: 11px; font-weight: 600; color: #ffffff; background: #006a4e; padding: 4px 10px; border-radius: 6px; text-decoration: none;">
                  View &rarr;
                </a>
              </div>
            </div>
          </div>
        `;

        const marker = L.marker([prop.lat, prop.lng], { icon: customIcon })
          .bindPopup(popupContent, { maxWidth: 260 })
          .addTo(map);

        if (isSelected) {
          marker.openPopup();
        }

        markersRef.current.push(marker);
      });

      // Fit bounds if multiple properties
      if (properties.length > 1) {
        const group = L.featureGroup(markersRef.current);
        map.fitBounds(group.getBounds().pad(0.15));
      }

      setMapLoaded(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [properties, selectedPropertyId, zoom]);

  const nearbyAmenities = [
    { type: "transit", label: "Metro & Transit", icon: Train, distance: "0.8 km" },
    { type: "school", label: "Top Schools", icon: School, distance: "1.2 km" },
    { type: "hospital", label: "Multi-Speciality Hospital", icon: Hospital, distance: "1.5 km" },
    { type: "mall", label: "Shopping Mall & Dining", icon: ShoppingBag, distance: "2.1 km" },
  ];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-md">
      {/* Map Element */}
      <div ref={mapContainerRef} style={{ height }} className="w-full relative z-0" />

      {/* Floating Amenities Overlay if requested */}
      {showNearbyAmenities && (
        <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2 max-w-md">
          {nearbyAmenities.map((item) => {
            const Icon = item.icon;
            const isActive = activeAmenity === item.type;
            return (
              <button
                key={item.type}
                onClick={() => setActiveAmenity(isActive ? null : item.type)}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold backdrop-blur-md transition-all shadow-md ${
                  isActive
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-slate-200 bg-white/95 text-slate-700 hover:border-slate-300 hover:text-slate-900"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.label}</span>
                <span className="text-[10px] opacity-75 font-normal">({item.distance})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Map Control Help */}
      <div className="absolute bottom-3 left-3 z-10 hidden sm:flex items-center gap-1.5 rounded-lg bg-white/95 border border-slate-200 px-2.5 py-1 text-[10px] text-slate-600 backdrop-blur-md shadow-xs">
        <Navigation className="h-3 w-3 text-emerald-600" />
        <span>Click pins for price, specifications & photo previews</span>
      </div>
    </div>
  );
}
