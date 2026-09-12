export type UserRole = "BUYER" | "AGENT" | "ADMIN";

export type PropertyType = "VILLA" | "APARTMENT" | "PLOT" | "COMMERCIAL" | "PENTHOUSE";

export type ListingType = "SALE" | "RENT";

export type FurnishingStatus = "FURNISHED" | "SEMI_FURNISHED" | "UNFURNISHED";

export type PropertyStatus = "PENDING" | "APPROVED" | "SOLD" | "RENTED" | "REJECTED";

export type InquiryStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  password?: string;
  passwordHash?: string;
  avatar?: string | null;
  companyName?: string | null;
  licenseNumber?: string | null;
  bio?: string | null;
  isVerified?: boolean;
  isBlocked?: boolean;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  propertyType: PropertyType;
  listingType: ListingType;
  city?: string;
  locality?: string;
  address: string;
  lat: number;
  lng: number;
  bedrooms: number;
  bathrooms: number;
  areaSqFt: number;
  carpetArea?: number | null;
  facing?: string | null;
  parking: number;
  propertyAge?: string | null;
  maintenanceFee?: number | null;
  floor?: number | null;
  totalFloors?: number | null;
  furnishingStatus: FurnishingStatus;
  status: PropertyStatus;
  featured: boolean;
  verified: boolean;
  images: string[];
  amenities: string[];
  ownerId: string;
  owner?: Partial<User>;
  createdAt: string | Date;
  updatedAt?: string | Date;
  isWishlisted?: boolean;
}

export interface Inquiry {
  id: string;
  propertyId: string;
  property?: Partial<Property>;
  userId?: string | null;
  user?: Partial<User>;
  name: string;
  email: string;
  phone: string;
  message: string;
  visitDate?: string | null;
  visitTime?: string | null;
  visitType?: string | null; // "IN_PERSON" | "VIDEO_CALL"
  status: InquiryStatus;
  adminNotes?: string | null;
  createdAt: string | Date;
  updatedAt?: string | Date;
}

export interface Wishlist {
  id: string;
  userId: string;
  propertyId: string;
  property?: Property;
  createdAt: string | Date;
}

export interface SavedSearch {
  id: string;
  userId: string;
  title: string;
  filters: PropertyFilters;
  createdAt: string | Date;
}

export interface AuditLog {
  id: string;
  action: "APPROVE_PROPERTY" | "REJECT_PROPERTY" | "UPDATE_PROPERTY" | "DELETE_PROPERTY" | "CREATE_PROPERTY" | "UPDATE_USER_ROLE" | "BLOCK_USER" | "UNBLOCK_USER" | "VERIFY_USER" | "UPDATE_SETTINGS" | "UPDATE_INQUIRY" | "DELETE_INQUIRY";
  details: string;
  targetType: "PROPERTY" | "USER" | "INQUIRY" | "SETTINGS";
  targetId?: string;
  adminName: string;
  adminEmail: string;
  createdAt: string;
}

export interface PlatformSettings {
  commissionRate: number; // e.g. 1.5%
  autoApproveVerifiedAgents: boolean;
  strictReraCompliance: boolean;
  maxFeaturedListings: number;
  maintenanceMode: boolean;
  contactEmail: string;
  contactPhone: string;
}

export interface PropertyFilters {
  query?: string;
  city?: string;
  locality?: string;
  propertyType?: PropertyType | "ALL";
  listingType?: ListingType | "ALL";
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number | string; // e.g. "1", "2", "3", "4", "5+"
  bathrooms?: number;
  furnishingStatus?: FurnishingStatus | "ALL";
  status?: PropertyStatus | "ALL";
  minArea?: number;
  maxArea?: number;
  amenities?: string[];
  featuredOnly?: boolean;
  verifiedOnly?: boolean;
  sortBy?: "price_asc" | "price_desc" | "newest" | "area_desc" | "featured";
  page?: number;
  limit?: number;
}

export interface EMICalculationResult {
  loanAmount: number;
  interestRate: number;
  tenureYears: number;
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  principalPercentage: number;
  interestPercentage: number;
}
