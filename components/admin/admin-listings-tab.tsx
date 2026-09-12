"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Search, Trash2 } from "lucide-react";
import { Property, PropertyStatus, PropertyType } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

interface AdminListingsTabProps {
  properties: Property[];
  pendingPropertiesCount: number;
  approvedPropertiesCount: number;
  rejectedPropertiesCount: number;
  onAddProperty: () => void;
  onInspect: (property: Property) => void;
  onEdit: (property: Property) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDelete: (id: string) => void;
  onBulkApprove: (ids: string[]) => void;
  onBulkReject: (ids: string[]) => void;
  onBulkDelete: (ids: string[]) => void;
}

const CITIES_LIST = ["ALL", "Mumbai", "Bangalore", "Goa", "Delhi NCR", "Hyderabad", "Pune"];

export function AdminListingsTab({
  properties,
  pendingPropertiesCount,
  approvedPropertiesCount,
  rejectedPropertiesCount,
  onAddProperty,
  onInspect,
  onEdit,
  onApprove,
  onReject,
  onDelete,
  onBulkApprove,
  onBulkReject,
  onBulkDelete,
}: AdminListingsTabProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = useState<PropertyType | "ALL">("ALL");
  const [cityFilter, setCityFilter] = useState("ALL");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = properties.filter((p) => {
    if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
    if (typeFilter !== "ALL" && p.propertyType !== typeFilter) return false;
    if (cityFilter !== "ALL" && p.city?.toLowerCase() !== cityFilter.toLowerCase()) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        p.title.toLowerCase().includes(q) ||
        p.locality?.toLowerCase().includes(q) ||
        p.city?.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filtered.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Property Listings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review submissions, edit property parameters, and update status.
          </p>
        </div>

        <button
          onClick={onAddProperty}
          className="h-9 px-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Add Property</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="p-3.5 bg-white border border-slate-200 rounded-lg flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="h-3.5 w-3.5 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search listings..."
            className="w-full h-9 pl-8 pr-3 text-xs border border-slate-200 rounded-md bg-slate-50 focus:bg-white focus:outline-none focus:border-slate-900"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="h-9 px-3 text-xs border border-slate-200 rounded-md bg-white text-slate-700 focus:outline-none focus:border-slate-900 cursor-pointer"
        >
          <option value="ALL">All Statuses ({properties.length})</option>
          <option value="PENDING">Pending Review ({pendingPropertiesCount})</option>
          <option value="APPROVED">Approved ({approvedPropertiesCount})</option>
          <option value="REJECTED">Rejected ({rejectedPropertiesCount})</option>
          <option value="SOLD">Sold</option>
          <option value="RENTED">Rented</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as any)}
          className="h-9 px-3 text-xs border border-slate-200 rounded-md bg-white text-slate-700 focus:outline-none focus:border-slate-900 cursor-pointer"
        >
          <option value="ALL">All Types</option>
          <option value="VILLA">Villa</option>
          <option value="APARTMENT">Apartment</option>
          <option value="PENTHOUSE">Penthouse</option>
          <option value="PLOT">Plot</option>
          <option value="COMMERCIAL">Commercial</option>
        </select>

        <select
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          className="h-9 px-3 text-xs border border-slate-200 rounded-md bg-white text-slate-700 focus:outline-none focus:border-slate-900 cursor-pointer"
        >
          {CITIES_LIST.map((c) => (
            <option key={c} value={c}>
              {c === "ALL" ? "All Cities" : c}
            </option>
          ))}
        </select>
      </div>

      {/* Bulk actions banner */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-700">
            {selectedIds.length} properties selected
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onBulkApprove(selectedIds);
                setSelectedIds([]);
              }}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded text-xs cursor-pointer"
            >
              Approve
            </button>
            <button
              onClick={() => {
                onBulkReject(selectedIds);
                setSelectedIds([]);
              }}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded text-xs cursor-pointer"
            >
              Reject
            </button>
            <button
              onClick={() => {
                if (window.confirm(`Delete ${selectedIds.length} properties?`)) {
                  onBulkDelete(selectedIds);
                  setSelectedIds([]);
                }
              }}
              className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium rounded text-xs cursor-pointer"
            >
              Delete
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="text-slate-500 hover:text-slate-800 ml-2 cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Listings Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase">
              <tr>
                <th className="w-8 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={filtered.length > 0 && selectedIds.length === filtered.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-slate-300 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Type & City</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    No properties found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleToggleSelect(p.id, e.target.checked)}
                          className="rounded border-slate-300 cursor-pointer"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-12 rounded bg-slate-100 overflow-hidden relative shrink-0">
                            <Image
                              src={
                                p.images[0] ||
                                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80"
                              }
                              alt={p.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/properties/${p.id}`}
                              className="font-semibold text-slate-900 hover:underline block truncate max-w-xs"
                            >
                              {p.title}
                            </Link>
                            <span className="text-[11px] text-slate-400">{p.locality}, {p.city}</span>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span className="font-medium text-slate-800">{p.propertyType}</span>
                        <span className="text-[11px] text-slate-400 block">{p.listingType}</span>
                      </td>

                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {formatCurrency(p.price)}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            p.status === "APPROVED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : p.status === "REJECTED"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-amber-50 text-amber-800 border border-amber-200"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onInspect(p)}
                            className="h-7 px-2 border border-slate-200 hover:bg-slate-50 rounded text-slate-600 text-xs font-medium cursor-pointer"
                            title="Inspect Details"
                          >
                            Inspect
                          </button>

                          <button
                            onClick={() => onEdit(p)}
                            className="h-7 px-2 border border-slate-200 hover:bg-slate-50 rounded text-slate-600 text-xs font-medium cursor-pointer"
                            title="Edit Property"
                          >
                            Edit
                          </button>

                          {p.status === "PENDING" ? (
                            <>
                              <button
                                onClick={() => onApprove(p.id)}
                                className="h-7 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-medium cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => onReject(p.id)}
                                className="h-7 px-2 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-medium cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => onDelete(p.id)}
                              className="h-7 w-7 flex items-center justify-center border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 rounded text-slate-400 cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
