"use client";

import React, { useState, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Briefcase,
  PlusCircle,
  Eye,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  Trash2,
  ExternalLink,
  DollarSign,
  Sparkles,
  Check,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { DataStore } from "@/lib/store";
import { Property, PropertyType, ListingType, FurnishingStatus, PropertyStatus, InquiryStatus } from "@/lib/types";
import { formatCurrency, formatArea } from "@/lib/utils";

function AgentPanelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<"listings" | "new_property" | "leads">(
    (searchParams.get("action") === "new" ? "new_property" : "listings")
  );

  // Agent's properties
  const agentProperties = DataStore.getProperties({ status: "ALL" }).properties;

  // Agent's incoming inquiries
  const [inquiries, setInquiries] = useState(() => DataStore.getInquiries());
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | "ALL">("ALL");

  // New Property Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [propertyType, setPropertyType] = useState<PropertyType>("VILLA");
  const [listingType, setListingType] = useState<ListingType>("SALE");
  const [city, setCity] = useState("Mumbai");
  const [locality, setLocality] = useState("");
  const [address, setAddress] = useState("");
  const [lat, setLat] = useState<number>(19.076);
  const [lng, setLng] = useState<number>(72.8777);
  const [price, setPrice] = useState<number>(25000000);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(3);
  const [areaSqFt, setAreaSqFt] = useState<number>(2500);
  const [carpetArea, setCarpetArea] = useState<number>(2100);
  const [facing, setFacing] = useState("North-East");
  const [parking, setParking] = useState<number>(2);
  const [propertyAge, setPropertyAge] = useState("Ready to Move");
  const [maintenanceFee, setMaintenanceFee] = useState<number>(10000);
  const [furnishingStatus, setFurnishingStatus] = useState<FurnishingStatus>("FURNISHED");
  const [imageUrls, setImageUrls] = useState<string[]>([
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1600&q=85",
  ]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    "Private Swimming Pool",
    "Smart Home Automation",
    "24/7 Security",
    "Clubhouse",
    "EV Charging Stations",
  ]);
  const [createdSuccess, setCreatedSuccess] = useState(false);

  const availableAmenities = [
    "Private Swimming Pool",
    "Sea View Balcony",
    "Smart Home Automation",
    "Private High-Speed Elevator",
    "Valet Concierge 24/7",
    "Clubhouse & Spa",
    "EV Charging Stations",
    "100% DG Power Backup",
    "Landscaped Garden",
    "Gourmet Modular Kitchen",
    "Wine Cellar",
    "Gymnasium & Crossfit",
  ];

  const handleAddImage = () => {
    if (newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setImageUrls(imageUrls.filter((_, idx) => idx !== index));
  };

  const toggleAmenity = (amenity: string) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price || !city || !locality) return;

    DataStore.createProperty({
      title,
      description,
      price: Number(price),
      propertyType,
      listingType,
      city,
      locality,
      address: address || `${locality}, ${city}`,
      lat: Number(lat),
      lng: Number(lng),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      areaSqFt: Number(areaSqFt),
      carpetArea: Number(carpetArea),
      facing,
      parking: Number(parking),
      propertyAge,
      maintenanceFee: Number(maintenanceFee),
      furnishingStatus,
      status: "APPROVED",
      featured: true,
      verified: true,
      images: imageUrls.length > 0 ? imageUrls : ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85"],
      amenities: selectedAmenities,
      ownerId: user?.id || "user-agent-1",
      owner: {
        id: user?.id || "user-agent-1",
        name: user?.name || "Vikram Singhania",
        email: user?.email || "agent@landparcel.com",
        phone: user?.phone || "+91 98200 12345",
        companyName: "Singhania Luxury Estates",
      },
    });

    setCreatedSuccess(true);
    setTimeout(() => {
      setCreatedSuccess(false);
      setActiveTab("listings");
    }, 2000);
  };

  const handleStatusChange = (propertyId: string, newStatus: PropertyStatus) => {
    DataStore.updatePropertyStatus(propertyId, newStatus);
    router.refresh();
  };

  const handleDeleteProperty = (propertyId: string) => {
    if (confirm("Are you sure you want to delete this property listing?")) {
      DataStore.deleteProperty(propertyId);
      router.refresh();
    }
  };

  const handleInquiryStatusChange = (inquiryId: string, newStatus: InquiryStatus) => {
    DataStore.updateInquiryStatus(inquiryId, newStatus);
    setInquiries(DataStore.getInquiries());
  };

  const filteredProperties = agentProperties.filter((p) => {
    if (statusFilter === "ALL") return true;
    return p.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Tab 1: Listings Management */}
        {activeTab === "listings" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-slate-900">Your Listed Real Estate Portfolio</h2>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Filter by status:</span>
                <select
                  value={statusFilter}
                  onChange={(e: any) => setStatusFilter(e.target.value)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-800 font-medium shadow-xs"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="APPROVED">Approved / Active</option>
                  <option value="PENDING">Pending Review</option>
                  <option value="SOLD">Sold</option>
                  <option value="RENTED">Rented</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {filteredProperties.map((property) => (
                <div
                  key={property.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-5 hover:border-slate-300 transition-colors shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-2xl border border-slate-200">
                      <Image
                        src={property.images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80"}
                        alt={property.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            property.status === "APPROVED"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : property.status === "SOLD"
                              ? "bg-blue-50 text-blue-800 border border-blue-200"
                              : property.status === "RENTED"
                              ? "bg-purple-50 text-purple-800 border border-purple-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {property.status}
                        </span>
                        <span className="text-xs text-slate-500 capitalize">
                          {property.propertyType.toLowerCase()} • {property.listingType === "SALE" ? "For Sale" : "For Rent"}
                        </span>
                      </div>

                      <Link href={`/properties/${property.id}`}>
                        <h3 className="text-base font-bold text-slate-900 hover:text-emerald-700 transition-colors">
                          {property.title}
                        </h3>
                      </Link>

                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{property.locality}, {property.city}</span>
                      </p>

                      <div className="text-xs font-bold text-emerald-700 pt-1">
                        {formatCurrency(property.price)}
                        <span className="text-slate-500 font-normal text-[11px] ml-2">
                          ({property.areaSqFt} sq.ft)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Status Dropdown */}
                  <div className="flex items-center gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100 justify-end">
                    <div className="flex flex-col text-right">
                      <span className="text-[10px] text-slate-500 mb-1 font-medium">Update Status</span>
                      <select
                        value={property.status}
                        onChange={(e) => handleStatusChange(property.id, e.target.value as PropertyStatus)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-900 font-semibold"
                      >
                        <option value="APPROVED">Active / Approved</option>
                        <option value="PENDING">Under Review</option>
                        <option value="SOLD">Mark as Sold</option>
                        <option value="RENTED">Mark as Rented</option>
                      </select>
                    </div>

                    <Link
                      href={`/properties/${property.id}`}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-emerald-600 hover:text-white transition-colors"
                      title="View Public Page"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>

                    <button
                      onClick={() => handleDeleteProperty(property.id)}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                      title="Delete Listing"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Add New Property Form Wizard */}
        {activeTab === "new_property" && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-md space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <PlusCircle className="h-5 w-5 text-emerald-600" />
                List a New Luxury Property
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Enter comprehensive specifications and photos for direct publishing to the verified inventory.
              </p>
            </div>

            {createdSuccess && (
              <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-800 font-semibold">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>Property created successfully! It is now live in the verified collection.</span>
              </div>
            )}

            <form onSubmit={handleCreateProperty} className="space-y-6">
              {/* Section 1: Basic Info */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 border-b border-slate-100 pb-2">
                  1. Title & Classification
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Property Title *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. The Imperial Sky Villa at Worli Sea Face"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Property Category
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="VILLA">Luxury Villa</option>
                      <option value="PENTHOUSE">Sky Penthouse</option>
                      <option value="APARTMENT">Modern Apartment</option>
                      <option value="PLOT">Gated Plot / Land</option>
                      <option value="COMMERCIAL">Commercial Office / Retail</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Listing Intent
                    </label>
                    <select
                      value={listingType}
                      onChange={(e) => setListingType(e.target.value as ListingType)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="SALE">For Sale</option>
                      <option value="RENT">For Rent</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Description & Architectural Highlights
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the interior craftsmanship, view orientation, layout specifications..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Location */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 border-b border-slate-100 pb-2">
                  2. Location Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      City *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Hyderabad">Hyderabad</option>
                      <option value="Pune">Pune</option>
                      <option value="Goa">Goa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Locality / Submarket *
                    </label>
                    <input
                      type="text"
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      placeholder="e.g. Worli Sea Face, Indiranagar"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Address
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Tower, Road, Landmark, Postal Code"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Specifications & Pricing */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 border-b border-slate-100 pb-2">
                  3. Pricing & Technical Specs
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Price in INR (₹) *
                    </label>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none font-bold text-emerald-700"
                      required
                    />
                    <span className="text-[10px] text-slate-500 mt-0.5 block">{formatCurrency(price)}</span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Super Built-up Area (sq.ft) *
                    </label>
                    <input
                      type="number"
                      value={areaSqFt}
                      onChange={(e) => setAreaSqFt(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Carpet Area (sq.ft)
                    </label>
                    <input
                      type="number"
                      value={carpetArea}
                      onChange={(e) => setCarpetArea(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Bedrooms (BHK)
                    </label>
                    <input
                      type="number"
                      value={bedrooms}
                      onChange={(e) => setBedrooms(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Bathrooms
                    </label>
                    <input
                      type="number"
                      value={bathrooms}
                      onChange={(e) => setBathrooms(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Furnishing Status
                    </label>
                    <select
                      value={furnishingStatus}
                      onChange={(e) => setFurnishingStatus(e.target.value as FurnishingStatus)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    >
                      <option value="FURNISHED">Fully Furnished</option>
                      <option value="SEMI_FURNISHED">Semi-Furnished</option>
                      <option value="UNFURNISHED">Unfurnished</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Orientation / Facing
                    </label>
                    <input
                      type="text"
                      value={facing}
                      onChange={(e) => setFacing(e.target.value)}
                      placeholder="e.g. North-East, Sea Facing"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Parking Slots
                    </label>
                    <input
                      type="number"
                      value={parking}
                      onChange={(e) => setParking(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Image URLs */}
              {/* <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 border-b border-slate-100 pb-2">
                  4. High-Resolution Imagery
                </h3>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Paste image URL (Unsplash or Cloudinary)..."
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 cursor-pointer"
                  >
                    Add Photo
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className="relative h-24 rounded-2xl overflow-hidden border border-slate-200 group">
                      <Image src={url} alt="Photo" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-2 right-2 rounded-full bg-rose-600 p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div> */}

              {/* Section 5: Amenities */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 border-b border-slate-100 pb-2">
                  5. Amenities & Facilities
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {availableAmenities.map((amenity) => {
                    const isChecked = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        type="button"
                        onClick={() => toggleAmenity(amenity)}
                        className={`flex items-center gap-2 rounded-xl p-2.5 text-xs text-left transition-colors cursor-pointer ${
                          isChecked
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold"
                            : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        <div
                          className={`flex h-4 w-4 items-center justify-center rounded border ${
                            isChecked
                              ? "border-emerald-600 bg-emerald-600 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span className="truncate">{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 px-8 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-500 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Property Listing Live</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Lead & Inquiry Pipeline */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Prospective Buyer Leads & Inquiries</h2>

            <div className="grid grid-cols-1 gap-4">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                            inq.status === "CONFIRMED"
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : inq.status === "COMPLETED"
                              ? "bg-blue-50 text-blue-800 border border-blue-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {inq.status}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {inq.visitType === "VIDEO_CALL" ? "Live Video Tour Request" : "In-Person Walkthrough"}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900">
                        Lead: {inq.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3.5 w-3.5 text-emerald-600" />
                          {inq.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-emerald-600" />
                          {inq.phone}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={inq.status}
                        onChange={(e) => handleInquiryStatusChange(inq.id, e.target.value as InquiryStatus)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-900 font-semibold"
                      >
                        <option value="PENDING">Pending Review</option>
                        <option value="CONFIRMED">Confirm Appointment</option>
                        <option value="COMPLETED">Completed / Visited</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>

                      <a
                        href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hi ${inq.name}, Vikram here from Singhania Estates regarding your inquiry on LandParcel.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 shadow-xs"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200">
                      <span className="text-slate-500 block mb-1 font-semibold">Buyer Note / Message:</span>
                      <p className="text-slate-700 italic">"{inq.message}"</p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3.5 border border-slate-200 flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 block mb-1 font-semibold">Target Property:</span>
                        <Link href={`/properties/${inq.propertyId}`} className="text-emerald-700 font-bold hover:underline">
                          {inq.property?.title || "Property Reference"}
                        </Link>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-500 block mb-1 font-semibold">Appointment Slot:</span>
                        <span className="text-slate-700 font-medium">{inq.visitDate} ({inq.visitTime || "TBD"})</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AgentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <AgentPanelContent />
    </Suspense>
  );
}
