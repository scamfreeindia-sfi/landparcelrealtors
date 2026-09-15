import {
  Property,
  User,
  Inquiry,
  PropertyFilters,
  PropertyStatus,
  InquiryStatus,
  UserRole,
  AuditLog,
  PlatformSettings,
} from "./types";
import {
  SAMPLE_PROPERTIES,
  SAMPLE_USERS,
  SAMPLE_INQUIRIES,
  SAMPLE_AUDIT_LOGS,
  DEFAULT_PLATFORM_SETTINGS,
} from "./sample-data";

// In-memory persistent store across hot reloads
declare global {
  // eslint-disable-next-line no-var
  var __globalRealEstateStore:
    | {
        properties: Property[];
        users: User[];
        inquiries: Inquiry[];
        wishlists: { userId: string; propertyId: string }[];
        auditLogs: AuditLog[];
        settings: PlatformSettings;
      }
    | undefined;
}

function initializeStore() {
  if (!globalThis.__globalRealEstateStore) {
    globalThis.__globalRealEstateStore = {
      properties: [...SAMPLE_PROPERTIES],
      users: [...SAMPLE_USERS],
      inquiries: [...SAMPLE_INQUIRIES],
      wishlists: [
        { userId: "user-buyer-1", propertyId: "prop-1" },
        { userId: "user-buyer-1", propertyId: "prop-2" },
      ],
      auditLogs: [...SAMPLE_AUDIT_LOGS],
      settings: { ...DEFAULT_PLATFORM_SETTINGS },
    };
  }
  return globalThis.__globalRealEstateStore;
}

export const DataStore = {
  // Properties
  getProperties(filters: PropertyFilters = {}): { properties: Property[]; total: number } {
    const store = initializeStore();
    let result = [...store.properties];

    // Status filter - by default return only APPROVED properties unless specified
    if (filters.status && filters.status !== "ALL") {
      result = result.filter((p) => p.status === filters.status);
    } else if (!filters.status) {
      result = result.filter((p) => p.status === "APPROVED");
    }

    // Search query (title, locality, city, description)
    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.locality?.toLowerCase().includes(q) ||
          p.city?.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // City filter
    if (filters.city && filters.city !== "ALL") {
      result = result.filter((p) => p.city?.toLowerCase() === filters.city!.toLowerCase());
    }

    // Locality filter
    if (filters.locality) {
      result = result.filter((p) =>
        p.locality?.toLowerCase().includes(filters.locality!.toLowerCase())
      );
    }

    // Property Type
    if (filters.propertyType && filters.propertyType !== "ALL") {
      result = result.filter((p) => p.propertyType === filters.propertyType);
    }

    if (filters.commercialType) {
      const subtypeTerms = {
        SHOP: ["shop", "retail"],
        SHOWROOM: ["showroom"],
        INDUSTRIAL_SITE: ["industrial", "warehouse", "factory"],
      }[filters.commercialType];
      result = result.filter((p) => {
        const searchableText = [p.title, p.description, p.locality, ...p.amenities]
          .join(" ")
          .toLowerCase();
        return p.propertyType === "COMMERCIAL" && subtypeTerms.some((term) => searchableText.includes(term));
      });
    }

    // Listing Type (SALE / RENT)
    if (filters.listingType && filters.listingType !== "ALL") {
      result = result.filter((p) => p.listingType === filters.listingType);
    }

    // Min Price
    if (filters.minPrice !== undefined && filters.minPrice > 0) {
      result = result.filter((p) => p.price >= filters.minPrice!);
    }

    // Max Price
    if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
      result = result.filter((p) => p.price <= filters.maxPrice!);
    }

    if (filters.minArea !== undefined) {
      result = result.filter((p) => p.areaSqFt >= filters.minArea!);
    }

    if (filters.maxArea !== undefined) {
      result = result.filter((p) => p.areaSqFt <= filters.maxArea!);
    }

    // Bedrooms
    if (filters.bedrooms && filters.bedrooms !== "ALL") {
      if (filters.bedrooms === "5+" || filters.bedrooms === "5") {
        result = result.filter((p) => p.bedrooms >= 5);
      } else {
        const num = parseInt(filters.bedrooms.toString(), 10);
        if (!isNaN(num)) {
          result = result.filter((p) => p.bedrooms === num);
        }
      }
    }

    // Furnishing Status
    if (filters.furnishingStatus && filters.furnishingStatus !== "ALL") {
      result = result.filter((p) => p.furnishingStatus === filters.furnishingStatus);
    }

    // Featured only
    if (filters.featuredOnly) {
      result = result.filter((p) => p.featured);
    }

    // Verified only
    if (filters.verifiedOnly) {
      result = result.filter((p) => p.verified);
    }

    // Amenities
    if (filters.amenities && filters.amenities.length > 0) {
      result = result.filter((p) =>
        filters.amenities!.every((a) =>
          p.amenities.some((pa) => pa.toLowerCase().includes(a.toLowerCase()))
        )
      );
    }

    // Sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price_asc":
          result.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          result.sort((a, b) => b.price - a.price);
          break;
        case "area_desc":
          result.sort((a, b) => b.areaSqFt - a.areaSqFt);
          break;
        case "featured":
          result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
          break;
        case "newest":
        default:
          result.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          break;
      }
    }

    const total = result.length;
    return { properties: result, total };
  },

  getPropertyById(id: string): Property | null {
    const store = initializeStore();
    return store.properties.find((p) => p.id === id) || null;
  },

  createProperty(
    propertyData: Omit<Property, "id" | "createdAt" | "updatedAt">,
    adminContext?: { name: string; email: string }
  ): Property {
    const store = initializeStore();
    const newProperty: Property = {
      ...propertyData,
      id: `prop-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.properties.unshift(newProperty);

    if (adminContext) {
      this.addAuditLog(
        "CREATE_PROPERTY",
        `Created new listing '${newProperty.title}' in ${newProperty.city}`,
        "PROPERTY",
        newProperty.id,
        adminContext.name,
        adminContext.email
      );
    }

    return newProperty;
  },

  updateProperty(
    id: string,
    updates: Partial<Property>,
    adminContext?: { name: string; email: string }
  ): Property | null {
    const store = initializeStore();
    const index = store.properties.findIndex((p) => p.id === id);
    if (index === -1) return null;

    store.properties[index] = {
      ...store.properties[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (adminContext) {
      this.addAuditLog(
        "UPDATE_PROPERTY",
        `Updated details for property '${store.properties[index].title}'`,
        "PROPERTY",
        id,
        adminContext.name,
        adminContext.email
      );
    }

    return store.properties[index];
  },

  deleteProperty(id: string, adminContext?: { name: string; email: string }): boolean {
    const store = initializeStore();
    const target = store.properties.find((p) => p.id === id);
    const initialLen = store.properties.length;
    store.properties = store.properties.filter((p) => p.id !== id);

    if (store.properties.length < initialLen && adminContext && target) {
      this.addAuditLog(
        "DELETE_PROPERTY",
        `Deleted property '${target.title}' (${target.id})`,
        "PROPERTY",
        id,
        adminContext.name,
        adminContext.email
      );
      return true;
    }
    return store.properties.length < initialLen;
  },

  updatePropertyStatus(
    id: string,
    status: PropertyStatus,
    adminContext?: { name: string; email: string }
  ): Property | null {
    const res = this.updateProperty(id, { status });
    if (res && adminContext) {
      const actionType = status === "APPROVED" ? "APPROVE_PROPERTY" : status === "REJECTED" ? "REJECTED_PROPERTY" : "UPDATE_PROPERTY";
      this.addAuditLog(
        actionType === "REJECTED_PROPERTY" ? "REJECT_PROPERTY" : actionType as any,
        `Changed status of '${res.title}' to ${status}`,
        "PROPERTY",
        id,
        adminContext.name,
        adminContext.email
      );
    }
    return res;
  },

  bulkUpdatePropertyStatus(
    ids: string[],
    status: PropertyStatus,
    adminContext?: { name: string; email: string }
  ): number {
    const store = initializeStore();
    let count = 0;
    ids.forEach((id) => {
      const index = store.properties.findIndex((p) => p.id === id);
      if (index !== -1) {
        store.properties[index] = {
          ...store.properties[index],
          status,
          updatedAt: new Date().toISOString(),
        };
        count++;
      }
    });

    if (count > 0 && adminContext) {
      this.addAuditLog(
        status === "APPROVED" ? "APPROVE_PROPERTY" : "REJECT_PROPERTY",
        `Bulk updated ${count} properties to ${status}`,
        "PROPERTY",
        undefined,
        adminContext.name,
        adminContext.email
      );
    }
    return count;
  },

  bulkDeleteProperties(ids: string[], adminContext?: { name: string; email: string }): number {
    const store = initializeStore();
    const initialLen = store.properties.length;
    store.properties = store.properties.filter((p) => !ids.includes(p.id));
    const deletedCount = initialLen - store.properties.length;

    if (deletedCount > 0 && adminContext) {
      this.addAuditLog(
        "DELETE_PROPERTY",
        `Bulk deleted ${deletedCount} properties from catalog`,
        "PROPERTY",
        undefined,
        adminContext.name,
        adminContext.email
      );
    }
    return deletedCount;
  },

  // Inquiries
  getInquiries(propertyId?: string, userId?: string, ownerId?: string): Inquiry[] {
    const store = initializeStore();
    let list = [...store.inquiries];

    if (propertyId) {
      list = list.filter((i) => i.propertyId === propertyId);
    }
    if (userId) {
      list = list.filter((i) => i.userId === userId);
    }
    if (ownerId) {
      const ownedPropertyIds = new Set(
        store.properties.filter((p) => p.ownerId === ownerId).map((p) => p.id)
      );
      list = list.filter((i) => ownedPropertyIds.has(i.propertyId));
    }

    return list.map((inq) => ({
      ...inq,
      property: store.properties.find((p) => p.id === inq.propertyId),
      user: store.users.find((u) => u.id === inq.userId),
    }));
  },

  createInquiry(inquiryData: Omit<Inquiry, "id" | "createdAt" | "status">): Inquiry {
    const store = initializeStore();
    const newInquiry: Inquiry = {
      ...inquiryData,
      id: `inq-${Date.now()}`,
      status: "PENDING",
      createdAt: new Date().toISOString(),
    };
    store.inquiries.unshift(newInquiry);
    return newInquiry;
  },

  updateInquiryStatus(
    id: string,
    status: InquiryStatus,
    adminContext?: { name: string; email: string }
  ): Inquiry | null {
    const store = initializeStore();
    const index = store.inquiries.findIndex((i) => i.id === id);
    if (index === -1) return null;
    store.inquiries[index] = {
      ...store.inquiries[index],
      status,
      updatedAt: new Date().toISOString(),
    };

    if (adminContext) {
      this.addAuditLog(
        "UPDATE_INQUIRY",
        `Changed lead #${id} status to ${status}`,
        "INQUIRY",
        id,
        adminContext.name,
        adminContext.email
      );
    }
    return store.inquiries[index];
  },

  updateInquiryNotes(
    id: string,
    adminNotes: string,
    adminContext?: { name: string; email: string }
  ): Inquiry | null {
    const store = initializeStore();
    const index = store.inquiries.findIndex((i) => i.id === id);
    if (index === -1) return null;
    store.inquiries[index] = {
      ...store.inquiries[index],
      adminNotes,
      updatedAt: new Date().toISOString(),
    };

    if (adminContext) {
      this.addAuditLog(
        "UPDATE_INQUIRY",
        `Updated internal notes for lead #${id}`,
        "INQUIRY",
        id,
        adminContext.name,
        adminContext.email
      );
    }
    return store.inquiries[index];
  },

  deleteInquiry(id: string, adminContext?: { name: string; email: string }): boolean {
    const store = initializeStore();
    const initialLen = store.inquiries.length;
    store.inquiries = store.inquiries.filter((i) => i.id !== id);

    if (store.inquiries.length < initialLen && adminContext) {
      this.addAuditLog(
        "DELETE_INQUIRY",
        `Deleted lead record #${id}`,
        "INQUIRY",
        id,
        adminContext.name,
        adminContext.email
      );
      return true;
    }
    return store.inquiries.length < initialLen;
  },

  // Wishlist
  getWishlist(userId: string): Property[] {
    const store = initializeStore();
    const propertyIds = store.wishlists
      .filter((w) => w.userId === userId)
      .map((w) => w.propertyId);
    return store.properties.filter((p) => propertyIds.includes(p.id));
  },

  isWishlisted(userId: string, propertyId: string): boolean {
    const store = initializeStore();
    return store.wishlists.some((w) => w.userId === userId && w.propertyId === propertyId);
  },

  toggleWishlist(userId: string, propertyId: string): boolean {
    const store = initializeStore();
    const index = store.wishlists.findIndex(
      (w) => w.userId === userId && w.propertyId === propertyId
    );
    if (index >= 0) {
      store.wishlists.splice(index, 1);
      return false; // removed
    } else {
      store.wishlists.push({ userId, propertyId });
      return true; // added
    }
  },

  // Users & Moderation
  getUsers(): User[] {
    const store = initializeStore();
    return store.users;
  },

  getUserById(id: string): User | null {
    const store = initializeStore();
    return store.users.find((u) => u.id === id) || null;
  },

  getUserByEmail(email: string): User | null {
    const store = initializeStore();
    return store.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim()) || null;
  },

  createUser(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">,
    adminContext?: { name: string; email: string }
  ): User {
    const store = initializeStore();
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    store.users.unshift(newUser);

    if (adminContext) {
      this.addAuditLog(
        "CREATE_PROPERTY" as any,
        `Created new user account '${newUser.name}' (${newUser.email}) with role ${newUser.role}`,
        "USER",
        newUser.id,
        adminContext.name,
        adminContext.email
      );
    }
    return newUser;
  },

  updateUser(
    id: string,
    updates: Partial<User>,
    adminContext?: { name: string; email: string }
  ): User | null {
    const store = initializeStore();
    const index = store.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    store.users[index] = {
      ...store.users[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (adminContext) {
      this.addAuditLog(
        "UPDATE_USER_ROLE",
        `Updated profile details for '${store.users[index].name}' (${store.users[index].email})`,
        "USER",
        id,
        adminContext.name,
        adminContext.email
      );
    }
    return store.users[index];
  },

  deleteUser(id: string, adminContext?: { name: string; email: string }): boolean {
    const store = initializeStore();
    const target = store.users.find((u) => u.id === id);
    const initialLen = store.users.length;
    store.users = store.users.filter((u) => u.id !== id);

    if (store.users.length < initialLen && adminContext && target) {
      this.addAuditLog(
        "BLOCK_USER",
        `Deleted user account '${target.name}' (${target.email})`,
        "USER",
        id,
        adminContext.name,
        adminContext.email
      );
      return true;
    }
    return store.users.length < initialLen;
  },

  updateUserRole(
    userId: string,
    role: UserRole,
    adminContext?: { name: string; email: string }
  ): User | null {
    const store = initializeStore();
    const user = store.users.find((u) => u.id === userId);
    if (!user) return null;
    const oldRole = user.role;
    user.role = role;
    user.updatedAt = new Date().toISOString();

    if (adminContext) {
      this.addAuditLog(
        "UPDATE_USER_ROLE",
        `Changed role of '${user.name}' from ${oldRole} to ${role}`,
        "USER",
        userId,
        adminContext.name,
        adminContext.email
      );
    }
    return user;
  },

  toggleUserVerification(
    userId: string,
    adminContext?: { name: string; email: string }
  ): boolean {
    const store = initializeStore();
    const user = store.users.find((u) => u.id === userId);
    if (!user) return false;
    user.isVerified = !user.isVerified;
    user.updatedAt = new Date().toISOString();

    if (adminContext) {
      this.addAuditLog(
        "VERIFY_USER",
        `${user.isVerified ? "Verified" : "Unverified"} user credentials for '${user.name}'`,
        "USER",
        userId,
        adminContext.name,
        adminContext.email
      );
    }
    return user.isVerified;
  },

  toggleUserBlock(userId: string, adminContext?: { name: string; email: string }): boolean {
    const store = initializeStore();
    const user = store.users.find((u) => u.id === userId);
    if (!user) return false;
    user.isBlocked = !user.isBlocked;
    user.updatedAt = new Date().toISOString();

    if (adminContext) {
      this.addAuditLog(
        user.isBlocked ? "BLOCK_USER" : "UNBLOCK_USER",
        `${user.isBlocked ? "Blocked" : "Unblocked"} access for '${user.name}' (${user.email})`,
        "USER",
        userId,
        adminContext.name,
        adminContext.email
      );
    }
    return user.isBlocked;
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    const store = initializeStore();
    return store.auditLogs;
  },

  addAuditLog(
    action: AuditLog["action"],
    details: string,
    targetType: AuditLog["targetType"],
    targetId?: string,
    adminName: string = "Admin",
    adminEmail: string = "admin@landparcel.com"
  ): AuditLog {
    const store = initializeStore();
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      details,
      targetType,
      targetId,
      adminName,
      adminEmail,
      createdAt: new Date().toISOString(),
    };
    store.auditLogs.unshift(newLog);
    // Keep max 100 logs in memory
    if (store.auditLogs.length > 100) {
      store.auditLogs.pop();
    }
    return newLog;
  },

  // Settings
  getPlatformSettings(): PlatformSettings {
    const store = initializeStore();
    return store.settings;
  },

  updatePlatformSettings(
    newSettings: Partial<PlatformSettings>,
    adminContext?: { name: string; email: string }
  ): PlatformSettings {
    const store = initializeStore();
    store.settings = { ...store.settings, ...newSettings };

    if (adminContext) {
      this.addAuditLog(
        "UPDATE_SETTINGS",
        "Updated global platform parameters and compliance settings",
        "SETTINGS",
        undefined,
        adminContext.name,
        adminContext.email
      );
    }
    return store.settings;
  },

  // Platform Analytics Stats
  getPlatformStats() {
    const store = initializeStore();
    const totalProperties = store.properties.length;
    const approvedProperties = store.properties.filter((p) => p.status === "APPROVED").length;
    const pendingProperties = store.properties.filter((p) => p.status === "PENDING").length;
    const rejectedProperties = store.properties.filter((p) => p.status === "REJECTED").length;
    const soldOrRented = store.properties.filter(
      (p) => p.status === "SOLD" || p.status === "RENTED"
    ).length;
    const totalInquiries = store.inquiries.length;
    const pendingInquiries = store.inquiries.filter((i) => i.status === "PENDING").length;
    const confirmedInquiries = store.inquiries.filter((i) => i.status === "CONFIRMED").length;
    const totalUsers = store.users.length;
    const totalAgents = store.users.filter((u) => u.role === "AGENT").length;
    const verifiedUsers = store.users.filter((u) => u.isVerified).length;
    const blockedUsers = store.users.filter((u) => u.isBlocked).length;

    // Total Portfolio Value (GMV in ₹)
    const totalPortfolioValue = store.properties.reduce((sum, p) => sum + (p.price || 0), 0);

    // City distribution
    const cityCounts: Record<string, number> = {};
    store.properties.forEach((p) => {
      if (p.city) cityCounts[p.city] = (cityCounts[p.city] || 0) + 1;
    });

    // Property Type distribution
    const typeCounts: Record<string, number> = {};
    store.properties.forEach((p) => {
      typeCounts[p.propertyType] = (typeCounts[p.propertyType] || 0) + 1;
    });

    return {
      totalProperties,
      approvedProperties,
      pendingProperties,
      rejectedProperties,
      soldOrRented,
      totalInquiries,
      pendingInquiries,
      confirmedInquiries,
      totalUsers,
      totalAgents,
      verifiedUsers,
      blockedUsers,
      totalPortfolioValue,
      cityCounts,
      typeCounts,
    };
  },
};
