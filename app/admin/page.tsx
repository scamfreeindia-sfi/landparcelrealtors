"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { DataStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import {
  Property,
  User,
  UserRole,
  Inquiry,
  InquiryStatus,
  PlatformSettings,
} from "@/lib/types";
import { ProfileModal } from "@/components/profile-modal";
import { AdminGatekeeper } from "@/components/admin/admin-gatekeeper";
import { AdminHeader, AdminTab } from "@/components/admin/admin-header";
import { AdminOverviewTab } from "@/components/admin/admin-overview-tab";
import { AdminListingsTab } from "@/components/admin/admin-listings-tab";
import { AdminUsersTab } from "@/components/admin/admin-users-tab";
import { AdminLeadsTab } from "@/components/admin/admin-leads-tab";
import { AdminSettingsTab } from "@/components/admin/admin-settings-tab";
import { InspectPropertyModal } from "@/components/admin/modals/inspect-property-modal";
import { EditPropertyModal } from "@/components/admin/modals/edit-property-modal";
import { NewPropertyModal } from "@/components/admin/modals/new-property-modal";
import { DeletePropertyModal } from "@/components/admin/modals/delete-property-modal";
import { LeadNotesModal } from "@/components/admin/modals/lead-notes-modal";

export default function AdminPage() {
  const router = useRouter();
  const { user, role, logout } = useAuth();

  useEffect(() => {
    router.replace("/");
  }, [router]);

  // Navigation
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");

  // Refresh trigger for DataStore synchronization
  const [refreshTick, setRefreshTick] = useState(0);
  const triggerRefresh = () => setRefreshTick((prev) => prev + 1);

  // Modals state
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [inspectingProperty, setInspectingProperty] = useState<Property | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [showNewPropertyModal, setShowNewPropertyModal] = useState(false);
  const [deletingPropertyId, setDeletingPropertyId] = useState<string | null>(null);
  const [editingLeadNotes, setEditingLeadNotes] = useState<Inquiry | null>(null);

  // Data Store bindings
  const properties = useMemo(
    () => DataStore.getProperties({ status: "ALL" }).properties,
    [refreshTick]
  );
  const usersList = useMemo(() => DataStore.getUsers(), [refreshTick]);
  const inquiriesList = useMemo(() => DataStore.getInquiries(), [refreshTick]);
  const auditLogs = useMemo(() => DataStore.getAuditLogs(), [refreshTick]);
  const platformSettings = useMemo(() => DataStore.getPlatformSettings(), [refreshTick]);
  const stats = useMemo(() => DataStore.getPlatformStats(), [refreshTick, properties, usersList]);

  const adminCtx = useMemo(
    () => ({
      name: user?.name || "Administrator",
      email: user?.email || "admin@landparcel.com",
    }),
    [user]
  );

  const isAdmin = user && role === "ADMIN";

  if (!isAdmin) {
    return <AdminGatekeeper onSuccess={() => triggerRefresh()} />;
  }

  // -------------------------------------------------------------------
  // PROPERTY ACTIONS
  // -------------------------------------------------------------------
  const handleApproveProperty = (id: string) => {
    DataStore.updatePropertyStatus(id, "APPROVED", adminCtx);
    triggerRefresh();
  };

  const handleRejectProperty = (id: string) => {
    DataStore.updatePropertyStatus(id, "REJECTED", adminCtx);
    triggerRefresh();
  };

  const handleToggleFeatured = (property: Property) => {
    DataStore.updateProperty(property.id, { featured: !property.featured }, adminCtx);
    triggerRefresh();
  };

  const handleToggleVerified = (property: Property) => {
    DataStore.updateProperty(property.id, { verified: !property.verified }, adminCtx);
    triggerRefresh();
  };

  const handleSaveProperty = (updated: Property) => {
    DataStore.updateProperty(updated.id, updated, adminCtx);
    triggerRefresh();
  };

  const handleCreateProperty = (
    newProp: Omit<Property, "id" | "createdAt" | "updatedAt">
  ) => {
    DataStore.createProperty(newProp, adminCtx);
    triggerRefresh();
  };

  const handleDeletePropertyConfirm = (id: string) => {
    DataStore.deleteProperty(id, adminCtx);
    setDeletingPropertyId(null);
    if (inspectingProperty?.id === id) setInspectingProperty(null);
    triggerRefresh();
  };

  const handleBulkApprove = (ids: string[]) => {
    DataStore.bulkUpdatePropertyStatus(ids, "APPROVED", adminCtx);
    triggerRefresh();
  };

  const handleBulkReject = (ids: string[]) => {
    DataStore.bulkUpdatePropertyStatus(ids, "REJECTED", adminCtx);
    triggerRefresh();
  };

  const handleBulkDelete = (ids: string[]) => {
    DataStore.bulkDeleteProperties(ids, adminCtx);
    triggerRefresh();
  };

  // -------------------------------------------------------------------
  // USER ACTIONS
  // -------------------------------------------------------------------
  const handleUserRoleChange = (userId: string, newRole: UserRole) => {
    DataStore.updateUserRole(userId, newRole, adminCtx);
    triggerRefresh();
  };

  const handleToggleUserBlock = (userId: string) => {
    DataStore.toggleUserBlock(userId, adminCtx);
    triggerRefresh();
  };

  const handleToggleUserVerification = (userId: string) => {
    DataStore.toggleUserVerification(userId, adminCtx);
    triggerRefresh();
  };

  const handleDeleteUser = (userId: string) => {
    DataStore.deleteUser(userId, adminCtx);
    triggerRefresh();
  };

  // -------------------------------------------------------------------
  // INQUIRY ACTIONS
  // -------------------------------------------------------------------
  const handleLeadStatusChange = (leadId: string, newStatus: InquiryStatus) => {
    DataStore.updateInquiryStatus(leadId, newStatus, adminCtx);
    triggerRefresh();
  };

  const handleSaveLeadNotes = (leadId: string, notes: string) => {
    DataStore.updateInquiryNotes(leadId, notes, adminCtx);
    triggerRefresh();
  };

  const handleDeleteLead = (id: string) => {
    DataStore.deleteInquiry(id, adminCtx);
    triggerRefresh();
  };

  // -------------------------------------------------------------------
  // SETTINGS ACTIONS
  // -------------------------------------------------------------------
  const handleSaveSettings = (settings: PlatformSettings) => {
    DataStore.updatePlatformSettings(settings, adminCtx);
    triggerRefresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1. Header */}
      <AdminHeader
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingPropertiesCount={stats.pendingProperties}
        pendingInquiriesCount={stats.pendingInquiries}
        onOpenProfile={() => setProfileModalOpen(true)}
        onLogout={() => logout()}
      />

      {/* 2. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {activeTab === "overview" && (
          <AdminOverviewTab
            stats={stats}
            properties={properties}
            auditLogs={auditLogs}
            onNewListing={() => setShowNewPropertyModal(true)}
            onViewAllLogs={() => setActiveTab("settings")}
          />
        )}

        {activeTab === "moderation" && (
          <AdminListingsTab
            properties={properties}
            pendingPropertiesCount={stats.pendingProperties}
            approvedPropertiesCount={stats.approvedProperties}
            rejectedPropertiesCount={stats.rejectedProperties}
            onAddProperty={() => setShowNewPropertyModal(true)}
            onInspect={(p) => setInspectingProperty(p)}
            onEdit={(p) => setEditingProperty(p)}
            onApprove={handleApproveProperty}
            onReject={handleRejectProperty}
            onDelete={(id) => setDeletingPropertyId(id)}
            onBulkApprove={handleBulkApprove}
            onBulkReject={handleBulkReject}
            onBulkDelete={handleBulkDelete}
          />
        )}

        {activeTab === "users" && (
          <AdminUsersTab
            users={usersList}
            onRoleChange={handleUserRoleChange}
            onToggleVerification={handleToggleUserVerification}
            onToggleBlock={handleToggleUserBlock}
            onEditUser={() => setProfileModalOpen(true)}
            onDeleteUser={handleDeleteUser}
          />
        )}

        {activeTab === "leads" && (
          <AdminLeadsTab
            inquiries={inquiriesList}
            pendingCount={stats.pendingInquiries}
            confirmedCount={stats.confirmedInquiries}
            onStatusChange={handleLeadStatusChange}
            onEditNotes={(inq) => setEditingLeadNotes(inq)}
            onDeleteLead={handleDeleteLead}
          />
        )}

        {activeTab === "settings" && (
          <AdminSettingsTab
            settings={platformSettings}
            auditLogs={auditLogs}
            onSaveSettings={handleSaveSettings}
          />
        )}
      </main>

      {/* 3. Modals */}
      <InspectPropertyModal
        property={inspectingProperty}
        onClose={() => setInspectingProperty(null)}
        onApprove={handleApproveProperty}
        onReject={handleRejectProperty}
        onToggleFeatured={handleToggleFeatured}
        onToggleVerified={handleToggleVerified}
      />

      <EditPropertyModal
        property={editingProperty}
        onClose={() => setEditingProperty(null)}
        onSave={handleSaveProperty}
      />

      <NewPropertyModal
        isOpen={showNewPropertyModal}
        onClose={() => setShowNewPropertyModal(false)}
        onSubmit={handleCreateProperty}
        userId={user?.id}
      />

      <DeletePropertyModal
        propertyId={deletingPropertyId}
        onClose={() => setDeletingPropertyId(null)}
        onConfirm={handleDeletePropertyConfirm}
      />

      <LeadNotesModal
        inquiry={editingLeadNotes}
        onClose={() => setEditingLeadNotes(null)}
        onSave={handleSaveLeadNotes}
      />

      <ProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />
    </div>
  );
}
