"use client";

import React, { useState } from "react";
import Image from "next/image";
import { X, Calendar, Clock, Video, User, Phone, Mail, CheckCircle2, MapPin } from "lucide-react";
import confetti from "canvas-confetti";
import { Property } from "@/lib/types";
import { useAuth } from "@/lib/auth-context";
import { DataStore } from "@/lib/store";
import { formatCurrency } from "@/lib/utils";

interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property;
}

export function ScheduleVisitModal({ isOpen, onClose, property }: ScheduleVisitModalProps) {
  const { user } = useAuth();
  const brokerName = property.owner?.name || "Vikram Singhania";
  const brokerPhone = property.owner?.phone || "+91 98200 12345";

  const [visitType, setVisitType] = useState<"IN_PERSON" | "VIDEO_CALL">("IN_PERSON");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("11:00 AM - 01:00 PM");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "+91 98765 43210");
  const [notes, setNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const timeSlots = [
    "10:00 AM - 12:00 PM",
    "12:00 PM - 02:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
    "06:00 PM - 08:00 PM",
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !name || !email || !phone) return;

    // Save inquiry to DataStore
    DataStore.createInquiry({
      propertyId: property.id,
      userId: user?.id || null,
      name,
      email,
      phone,
      message: notes || `Requested ${visitType === "IN_PERSON" ? "in-person" : "video"} visit on ${selectedDate} at ${selectedSlot}`,
      visitDate: selectedDate,
      visitTime: selectedSlot,
      visitType,
    });

    // Trigger celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">Property Walkthrough</h3>
          </div>
          <button
            onClick={handleResetAndClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="p-8 text-center space-y-4 animate-in zoom-in-95">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h4 className="text-xl font-bold text-slate-900">Visit Confirmed!</h4>
            <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              Your appointment for <strong className="text-emerald-700">{property.title}</strong> has been received. Our luxury real estate concierge will call you on <strong className="text-slate-900">{phone}</strong> with directions and gate entry pass.
            </p>
            <div className="rounded-2xl bg-slate-50 p-4 text-xs text-slate-600 border border-slate-200 space-y-1.5 text-left max-w-sm mx-auto">
              <div className="flex justify-between">
                <span>Date & Slot:</span>
                <strong className="text-slate-800">{selectedDate} ({selectedSlot})</strong>
              </div>
              <div className="flex justify-between">
                <span>Format:</span>
                <strong className="text-emerald-700 capitalize">{visitType.replace("_", " ").toLowerCase()}</strong>
              </div>
              <div className="flex justify-between">
                <span>Agent Contact:</span>
                <strong className="text-right text-slate-800">{brokerName}<br />{brokerPhone}</strong>
              </div>
            </div>
            <button
              onClick={handleResetAndClose}
              className="mt-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/20 hover:from-emerald-500 hover:to-teal-500 cursor-pointer"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Property Summary Mini Card */}
            <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 border border-slate-200">
              <div className="relative h-14 w-18 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={property.images[0] || "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=300&q=80"}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 truncate">{property.title}</h4>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5">
                </div>
                <div className="text-xs font-extrabold text-emerald-600 mt-0.5">
                  {formatCurrency(property.price)}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-600 shadow-sm">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-wide text-emerald-700">Your broker</p>
                <p className="truncate text-xs font-bold text-slate-900">{brokerName}</p>
                <a href={`tel:${brokerPhone}`} className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-emerald-700">
                  <Phone className="h-3 w-3 text-emerald-600" />
                  <span>{brokerPhone}</span>
                </a>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
