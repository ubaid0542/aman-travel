"use client";

import React, { useState, useEffect, useMemo } from "react";
import { LeadRecord, ActiveTripBatch } from "@/types";
import {
  getStoredAdminPassword,
  isAdminSessionActive,
  setAdminSessionActive,
} from "@/lib/storage";
import {
  getTodayDateString,
  addDaysToDateString,
  calculateTripNights,
  formatDateWithDay,
  getThisWeekendDates,
} from "@/lib/date-utils";

interface SavedLeadsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  leads: LeadRecord[];
  onUpdateLeadDates: (leadId: string, updates: Partial<LeadRecord>) => void;
  onUpdateLeadNotes?: (leadId: string, notes: string) => void;
  onToggleLeadStatus: (leadId: string) => void;
  onDeleteLead?: (leadId: string) => void;
  onClearAllLeads: () => void;
  activeBatch?: ActiveTripBatch;
  onUpdateBatch?: (updates: Partial<ActiveTripBatch>) => void;
  onToggleBatchActive?: () => void;
  initialTab?: "leads" | "schedule";
}

export function SavedLeadsDrawer({
  isOpen,
  onClose,
  leads,
  onUpdateLeadDates,
  onUpdateLeadNotes,
  onToggleLeadStatus,
  onDeleteLead,
  onClearAllLeads,
  activeBatch,
  onUpdateBatch,
  onToggleBatchActive,
  initialTab = "leads",
}: SavedLeadsDrawerProps) {
  // Authentication State
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Top Section Navigation Tab: "leads" or "schedule"
  const [activeTab, setActiveTab] = useState<"leads" | "schedule">(initialTab);

  // Batch Manager State (Custom Starting & Ending Dates)
  const [batchStartDate, setBatchStartDate] = useState("");
  const [batchEndDate, setBatchEndDate] = useState("");
  const [batchTitle, setBatchTitle] = useState("");
  const [batchSeats, setBatchSeats] = useState(8);
  const [batchIsActive, setBatchIsActive] = useState(true);
  const [batchSavedMessage, setBatchSavedMessage] = useState(false);
  const [batchDateError, setBatchDateError] = useState<string | null>(null);

  // Search & Filter for Leads
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING_CALLBACK" | "CONTACTED">("ALL");

  // Inline Editing for Individual Lead
  const [editingLeadId, setEditingLeadId] = useState<string | null>(null);
  const [editStartDate, setEditStartDate] = useState("");
  const [editEndDate, setEditEndDate] = useState("");
  const [editGuests, setEditGuests] = useState(2);
  const [editNotes, setEditNotes] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [justSavedId, setJustSavedId] = useState<string | null>(null);

  const [confirmClear, setConfirmClear] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Check persistent session on mount & lockout timer
  useEffect(() => {
    if (isAdminSessionActive()) {
      setIsUnlocked(true);
    }

    const checkLockout = () => {
      try {
        const lockoutUntil = parseInt(
          sessionStorage.getItem("aman_admin_lockout_until") || "0",
          10
        );
        const remaining = Math.max(0, Math.ceil((lockoutUntil - Date.now()) / 1000));
        setLockoutSeconds(remaining);
      } catch {
        // ignore storage errors
      }
    };

    checkLockout();
    const timer = setInterval(checkLockout, 1000);
    return () => clearInterval(timer);
  }, []);

  // Synchronize batch states when activeBatch changes
  useEffect(() => {
    if (activeBatch) {
      setBatchStartDate(activeBatch.startDate);
      setBatchEndDate(activeBatch.endDate || addDaysToDateString(activeBatch.startDate, 3));
      setBatchTitle(activeBatch.title || "Manali Fixed Departure Batch");
      setBatchSeats(activeBatch.seatsLeft ?? 8);
      setBatchIsActive(activeBatch.isActive);
    }
  }, [activeBatch]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (!isOpen) {
      setConfirmClear(false);
      setDeletingId(null);
      setCopiedId(null);
      setEditingLeadId(null);
      setEditError(null);
      setAuthError(null);
      setBatchSavedMessage(false);
      setBatchDateError(null);
    }
  }, [isOpen]);

  // Dynamic Duration Calculation
  const calculatedNights = useMemo(() => {
    if (batchStartDate && batchEndDate && batchEndDate > batchStartDate) {
      return calculateTripNights(batchStartDate, batchEndDate);
    }
    return 3;
  }, [batchStartDate, batchEndDate]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      if (statusFilter !== "ALL" && lead.status !== statusFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = lead.name.toLowerCase().includes(q);
        const matchesPhone = lead.phone.includes(q);
        const matchesId = lead.id.toLowerCase().includes(q);
        const matchesPkg = lead.packageName.toLowerCase().includes(q);
        return matchesName || matchesPhone || matchesId || matchesPkg;
      }
      return true;
    });
  }, [leads, statusFilter, searchQuery]);

  if (!isOpen) return null;

  // Handle Login Authentication with Brute-Force Protection
  const handleUnlockSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (lockoutSeconds > 0) {
      setAuthError(
        `Bahut saari galat koshishein hui hain. Kripya ${lockoutSeconds}s intezar karein.`
      );
      return;
    }

    const currentAdminPassword = getStoredAdminPassword();

    if (!passwordInput.trim()) {
      setAuthError("Admin password enter karein.");
      return;
    }

    if (passwordInput.trim() !== currentAdminPassword) {
      try {
        const attempts =
          parseInt(sessionStorage.getItem("aman_admin_attempts") || "0", 10) + 1;
        if (attempts >= 5) {
          const lockoutUntil = Date.now() + 5 * 60 * 1000; // 5 min lockout
          sessionStorage.setItem("aman_admin_lockout_until", String(lockoutUntil));
          sessionStorage.setItem("aman_admin_attempts", "0");
          setLockoutSeconds(300);
          setAuthError(
            "Security Lockout: 5 baar galat password enter karne ke karan desk 5 minute ke liye lock ho gaya hai."
          );
          return;
        } else {
          sessionStorage.setItem("aman_admin_attempts", String(attempts));
          setAuthError(
            `Galat password! (${attempts}/5 koshishein). Kripya sahi password enter karein.`
          );
          return;
        }
      } catch {
        setAuthError("Galat password! Kripya sahi Admin Password enter karein.");
        return;
      }
    }

    // Successful authentication: Reset failed attempt counters
    try {
      sessionStorage.removeItem("aman_admin_attempts");
      sessionStorage.removeItem("aman_admin_lockout_until");
    } catch {
      // ignore
    }

    setAuthError(null);
    setIsUnlocked(true);
    setAdminSessionActive(true);
    setPasswordInput("");
  };

  // Handle Logout / Lock
  const handleLockLeads = () => {
    setIsUnlocked(false);
    setAdminSessionActive(false);
    setPasswordInput("");
    setEditingLeadId(null);
    setAuthError(null);
    setBatchSavedMessage(false);
  };

  // Handle Custom Starting Date Change
  const handleBatchStartChange = (newStart: string) => {
    setBatchStartDate(newStart);
    setBatchDateError(null);

    // If end date is missing or earlier than new start, adjust intelligently
    if (newStart && (!batchEndDate || batchEndDate <= newStart)) {
      setBatchEndDate(addDaysToDateString(newStart, 3));
    }
  };

  // Handle Custom Ending Date Change
  const handleBatchEndChange = (newEnd: string) => {
    setBatchEndDate(newEnd);
    if (batchStartDate && newEnd <= batchStartDate) {
      setBatchDateError("Ending date, starting date ke baad ki honi chahiye.");
    } else {
      setBatchDateError(null);
    }
  };

  // Save Both Custom Starting & Ending Dates
  const handleSaveBatchSchedule = () => {
    if (!batchStartDate || !batchEndDate) {
      setBatchDateError("Starting Date aur Ending Date dono enter karein.");
      return;
    }

    if (batchEndDate <= batchStartDate) {
      setBatchDateError("Ending date, starting date ke baad ki honi chahiye.");
      return;
    }

    const nights = calculateTripNights(batchStartDate, batchEndDate);
    const days = nights + 1;

    if (onUpdateBatch) {
      onUpdateBatch({
        startDate: batchStartDate,
        endDate: batchEndDate,
        nights,
        title: batchTitle.trim() || `Manali ${days}-Day Fixed Departure Batch`,
        seatsLeft: Number(batchSeats) || 8,
        isActive: batchIsActive,
      });
    }

    setBatchDateError(null);
    setBatchSavedMessage(true);
    setTimeout(() => setBatchSavedMessage(false), 3500);
  };

  const handleBatchPresetWeekend = () => {
    const { start, end } = getThisWeekendDates();
    setBatchStartDate(start);
    setBatchEndDate(end);
    setBatchDateError(null);
  };

  const handleBatchPresetNights = (nightsCount: number) => {
    const start = batchStartDate || getTodayDateString();
    setBatchStartDate(start);
    setBatchEndDate(addDaysToDateString(start, nightsCount));
    setBatchDateError(null);
  };

  const handleStartEditingDates = (lead: LeadRecord) => {
    setEditingLeadId(lead.id);
    setEditStartDate(lead.startDate || getTodayDateString());
    setEditEndDate(
      lead.endDate ||
        addDaysToDateString(lead.startDate || getTodayDateString(), 3)
    );
    setEditGuests(lead.guests || 2);
    setEditNotes(lead.adminNotes || "");
    setEditError(null);
  };

  const handleSaveEditedDates = (leadId: string) => {
    if (!editStartDate || !editEndDate) {
      setEditError("Trip Starting Date aur Ending Date dono select karein.");
      return;
    }
    if (editEndDate <= editStartDate) {
      setEditError("Ending date, starting date ke baad ki honi chahiye.");
      return;
    }
    const parsedGuests = Number(editGuests);
    if (!Number.isInteger(parsedGuests) || parsedGuests < 1 || parsedGuests > 30) {
      setEditError("Guests 1 se 30 ke beech hone chahiye.");
      return;
    }

    const nights = calculateTripNights(editStartDate, editEndDate);
    onUpdateLeadDates(leadId, {
      startDate: editStartDate,
      endDate: editEndDate,
      nights,
      guests: parsedGuests,
      adminNotes: editNotes.trim() || undefined,
    });

    if (onUpdateLeadNotes && editNotes.trim()) {
      onUpdateLeadNotes(leadId, editNotes.trim());
    }

    setEditingLeadId(null);
    setEditError(null);
    setJustSavedId(leadId);
    setTimeout(() => setJustSavedId(null), 2200);
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const headers = [
      "Reference ID",
      "Customer Name",
      "Phone",
      "Email",
      "Package",
      "Start Date",
      "End Date",
      "Nights",
      "Guests",
      "Boarding Point",
      "Stay Category",
      "Transfer Mode",
      "Total Price",
      "Status",
      "Created At",
      "Admin Notes",
    ];

    const rows = leads.map((lead) => [
      `"${lead.id}"`,
      `"${lead.name.replace(/"/g, '""')}"`,
      `"${lead.phone}"`,
      `"${lead.email || ""}"`,
      `"${lead.packageName.replace(/"/g, '""')}"`,
      `"${lead.startDate}"`,
      `"${lead.endDate}"`,
      lead.nights,
      lead.guests,
      `"${lead.pickup.replace(/"/g, '""')}"`,
      `"${lead.stayTier || ""}"`,
      `"${lead.transferMode || ""}"`,
      lead.totalPrice || "",
      `"${lead.status}"`,
      `"${lead.createdAt}"`,
      `"${(lead.adminNotes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `aman_traveller_leads_${getTodayDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyJson = (record: LeadRecord) => {
    if (typeof navigator !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(JSON.stringify(record, null, 2));
      setCopiedId(record.id);
      setTimeout(() => setCopiedId(null), 1800);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex justify-end bg-[#041f3d]/80 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-[640px] flex-col bg-[#f4f9fc] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="bg-[#062847] px-4 py-3 sm:px-6 sm:py-4 text-white">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <span className="block truncate text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#ffd45a]">
                {isUnlocked ? "Admin Control Panel • Unlocked" : "Password Protected • Admin Control"}
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-white leading-tight">
                Aman Traveller Admin Desk
              </h3>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isUnlocked && (
                <div className="hidden sm:flex items-center gap-2">
                  {activeTab === "leads" && (
                    <button
                      type="button"
                      onClick={handleExportCSV}
                      className="flex cursor-pointer items-center gap-1.5 rounded-full border border-[#ffd45a]/60 bg-white/10 px-3 py-1 text-xs font-bold text-[#ffd45a] hover:bg-white/20"
                      title="Export all leads to CSV"
                    >
                      📥 CSV
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleLockLeads}
                    className="cursor-pointer rounded-full border border-red-400/40 bg-red-500/20 px-3 py-1 text-xs font-bold text-red-200 hover:bg-red-500/30"
                  >
                    Lock
                  </button>
                </div>
              )}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Admin Drawer"
                className="flex h-8 w-8 sm:h-9 sm:w-9 cursor-pointer items-center justify-center rounded-full bg-white/10 text-lg sm:text-xl text-white hover:bg-white/20"
              >
                ×
              </button>
            </div>
          </div>

          {/* Mobile Action Bar when unlocked */}
          {isUnlocked && (
            <div className="mt-2.5 flex sm:hidden items-center justify-between border-t border-white/10 pt-2">
              <div>
                {activeTab === "leads" && (
                  <button
                    type="button"
                    onClick={handleExportCSV}
                    className="flex cursor-pointer items-center gap-1 rounded-full border border-[#ffd45a]/60 bg-white/10 px-2.5 py-1 text-xs font-bold text-[#ffd45a] hover:bg-white/20"
                    title="Export all leads to CSV"
                  >
                    📥 Export CSV
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={handleLockLeads}
                className="cursor-pointer rounded-full border border-red-400/40 bg-red-500/20 px-3 py-1 text-xs font-bold text-red-200 hover:bg-red-500/30"
              >
                🔒 Lock Desk
              </button>
            </div>
          )}
        </div>

        {/* Lock Screen View */}
        {!isUnlocked ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <form
              onSubmit={handleUnlockSubmit}
              className="w-full max-w-[420px] rounded-2xl border border-[#e1eef6] bg-white p-7 shadow-[0_12px_30px_rgba(6,40,71,0.12)]"
            >
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#062847] text-[#ffd45a]">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  viewBox="0 0 24 24"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>

              <h4 className="mb-1 text-center text-xl font-extrabold text-[#062847]">
                Admin Desk Authentication
              </h4>
              <p className="mb-4 text-center text-xs leading-relaxed text-[#4b6578]">
                Trip Starting &amp; Ending Dates customize karne aur customer enquiries access karne ke liye apna <strong>Admin Password</strong> enter karein.
              </p>

              {authError && (
                <div
                  role="alert"
                  className="mb-3.5 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-xs font-bold text-[#991b1b]"
                >
                  {authError}
                </div>
              )}

              <div className="mb-4">
                <label
                  htmlFor="leads-vault-password"
                  className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#173246]"
                >
                  Enter Password
                </label>
                <div className="relative">
                  <input
                    id="leads-vault-password"
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      lockoutSeconds > 0
                        ? `Locked (${lockoutSeconds}s remaining)`
                        : "Enter admin password"
                    }
                    value={passwordInput}
                    disabled={lockoutSeconds > 0}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setAuthError(null);
                    }}
                    className="w-full rounded-xl border border-[#c3d8e6] bg-white px-3 py-2.5 pr-16 text-sm text-[#173246] focus:border-[#062847] focus:outline-none disabled:bg-gray-100 disabled:opacity-75"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    disabled={lockoutSeconds > 0}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent text-xs font-bold text-[#4b6578] hover:text-[#062847] disabled:opacity-50"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={lockoutSeconds > 0}
                className="btn-gold w-full cursor-pointer text-center !py-3 !text-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                {lockoutSeconds > 0
                  ? `Desk Locked (${lockoutSeconds}s)`
                  : "Unlock Admin Desk"}
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Unlocked Navigation Tabs */}
            <div className="flex border-b border-[#c3d8e6] bg-[#062847] px-2 sm:px-6 text-xs sm:text-sm">
              <button
                type="button"
                onClick={() => setActiveTab("schedule")}
                className={`relative flex flex-1 sm:flex-initial items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2.5 sm:py-3 font-extrabold transition-colors ${
                  activeTab === "schedule"
                    ? "border-b-2 border-[#ffd45a] text-[#ffd45a]"
                    : "text-[#c5def1] hover:text-white"
                }`}
              >
                <span>🗓️ <span className="hidden sm:inline">Custom Trip Dates (Front Highlight)</span><span className="sm:hidden">Trip Dates</span></span>
                {batchIsActive && (
                  <span className="flex h-2 w-2 rounded-full bg-[#22c55e] shrink-0"></span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("leads")}
                className={`flex flex-1 sm:flex-initial items-center justify-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2.5 sm:py-3 font-extrabold transition-colors ${
                  activeTab === "leads"
                    ? "border-b-2 border-[#ffd45a] text-[#ffd45a]"
                    : "text-[#c5def1] hover:text-white"
                }`}
              >
                <span>Customer Leads</span>
                <span className="rounded-full bg-white/20 px-1.5 py-0.5 text-[10px] sm:text-xs text-white">
                  {leads.length}
                </span>
              </button>
            </div>

            {/* TAB 1: CUSTOM START & END DATES SCHEDULE MANAGER */}
            {activeTab === "schedule" && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5">
                {/* Intro Card */}
                <div className="rounded-2xl border-2 border-[#ffd45a] bg-gradient-to-br from-[#062847] to-[#0c406e] p-5 text-white shadow-md">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-lg bg-[#ffd45a] px-2.5 py-0.5 text-xs font-black text-[#041f3d]">
                      CUSTOM DATE HIGHLIGHT
                    </span>
                    <span className="text-xs text-[#d2e8f8]">
                      {calculatedNights} Nights / {calculatedNights + 1} Days
                    </span>
                  </div>
                  <h4 className="text-lg font-black text-white">
                    Trip Starting &amp; Ending Date Customizer
                  </h4>
                  <p className="mt-1 text-xs leading-relaxed text-[#c5def1]">
                    Apni agali trip ki <strong>Starting Date</strong> aur <strong>Ending Date</strong> dono apne hisab se customize karein. Website ke <strong>Top Announcement Banner</strong>, <strong>Hero Section</strong> aur <strong>Booking Form</strong> me yeh exact date range aur duration highlight ho jayegi!
                  </p>
                </div>

                {/* Batch Customization Form */}
                <div className="rounded-2xl border border-[#c3d8e6] bg-white p-5 shadow-xs space-y-4">
                  {batchSavedMessage && (
                    <div className="flex items-center gap-2 rounded-xl border border-[#86efac] bg-[#f0fdf4] p-3 text-xs font-extrabold text-[#166534]">
                      <span className="text-base">✓</span>
                      <span>Success! Customized Trip Dates ({formatDateWithDay(batchStartDate)} → {formatDateWithDay(batchEndDate)}) website ke front par highlight ho chuki hain!</span>
                    </div>
                  )}

                  {batchDateError && (
                    <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] p-3 text-xs font-bold text-[#991b1b]">
                      ⚠️ {batchDateError}
                    </div>
                  )}

                  {/* Quick Preset Buttons */}
                  <div>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase text-[#4b6578]">
                        Quick Date Presets:
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 text-xs">
                      <button
                        type="button"
                        onClick={handleBatchPresetWeekend}
                        className="cursor-pointer rounded-lg border border-[#c3d8e6] bg-[#eaf4fb] px-2.5 py-1 font-bold text-[#062847] hover:bg-[#d0e5f5]"
                      >
                        ⚡ This Weekend (Fri→Mon)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBatchPresetNights(3)}
                        className="cursor-pointer rounded-lg border border-[#c3d8e6] bg-[#eaf4fb] px-2.5 py-1 font-bold text-[#062847] hover:bg-[#d0e5f5]"
                      >
                        🏔️ 3 Nights / 4 Days
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBatchPresetNights(4)}
                        className="cursor-pointer rounded-lg border border-[#c3d8e6] bg-[#eaf4fb] px-2.5 py-1 font-bold text-[#062847] hover:bg-[#d0e5f5]"
                      >
                        ❄️ 4 Nights / 5 Days
                      </button>
                      <button
                        type="button"
                        onClick={() => handleBatchPresetNights(5)}
                        className="cursor-pointer rounded-lg border border-[#c3d8e6] bg-[#eaf4fb] px-2.5 py-1 font-bold text-[#062847] hover:bg-[#d0e5f5]"
                      >
                        🌲 5 Nights / 6 Days
                      </button>
                    </div>
                  </div>

                  {/* BOTH STARTING DATE AND ENDING DATE INPUTS */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-[#062847]">
                        Trip Starting Date (Delhi Departure) *
                      </label>
                      <input
                        type="date"
                        value={batchStartDate}
                        min={getTodayDateString()}
                        onChange={(e) => handleBatchStartChange(e.target.value)}
                        className="w-full rounded-xl border border-[#c3d8e6] bg-[#f9fcfe] px-3 py-2.5 text-sm font-bold text-[#062847] focus:border-[#062847] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-[#062847]">
                        Trip Ending Date (Delhi Return) *
                      </label>
                      <input
                        type="date"
                        value={batchEndDate}
                        min={batchStartDate ? addDaysToDateString(batchStartDate, 1) : getTodayDateString()}
                        onChange={(e) => handleBatchEndChange(e.target.value)}
                        className="w-full rounded-xl border border-[#c3d8e6] bg-[#f9fcfe] px-3 py-2.5 text-sm font-bold text-[#062847] focus:border-[#062847] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Dynamic Duration Calculation Card */}
                  <div className="rounded-xl border border-[#bcd6ea] bg-[#eaf4fb] p-3.5">
                    <div className="text-[11px] font-black uppercase text-[#062847]">
                      Calculated Trip Schedule &amp; Duration:
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <div className="text-[11px] text-[#4b6578]">Delhi Departure:</div>
                        <div className="text-sm font-black text-[#062847]">
                          {formatDateWithDay(batchStartDate) || "Start date select karein"}
                        </div>
                      </div>
                      <span className="text-lg font-bold text-[#062847]">→</span>
                      <div>
                        <div className="text-[11px] text-[#4b6578]">Delhi Return:</div>
                        <div className="text-sm font-black text-[#062847]">
                          {formatDateWithDay(batchEndDate) || "End date select karein"}
                        </div>
                      </div>
                      <div className="rounded-lg bg-[#062847] px-3 py-1 text-xs font-black text-[#ffd45a]">
                        {batchStartDate && batchEndDate && batchEndDate > batchStartDate
                          ? `${calculatedNights} Nights / ${calculatedNights + 1} Days`
                          : "Select Valid Dates"}
                      </div>
                    </div>
                  </div>

                  {/* Batch Title & Seats Left */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#173246]">
                        Batch Title / Highlight Caption
                      </label>
                      <input
                        type="text"
                        value={batchTitle}
                        placeholder="e.g. Manali Snow Special 14-Seater Batch"
                        onChange={(e) => setBatchTitle(e.target.value)}
                        className="w-full rounded-xl border border-[#c3d8e6] bg-white px-3 py-2 text-xs text-[#173246] focus:border-[#062847] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-[#173246]">
                        Seats Available (Max 14)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={14}
                        value={batchSeats}
                        onChange={(e) => setBatchSeats(Number(e.target.value))}
                        className="w-full rounded-xl border border-[#c3d8e6] bg-white px-3 py-2 text-xs font-bold text-[#062847] focus:border-[#062847] focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Active / Publish Toggle */}
                  <div className="flex items-center justify-between rounded-xl border border-[#c3d8e6] bg-[#f9fcfe] p-3.5">
                    <div>
                      <span className="text-xs font-extrabold text-[#062847]">
                        Website Front Highlight Status
                      </span>
                      <p className="text-[11px] text-[#4b6578]">
                        Jab ye ON hoga, website ke front banner aur hero section par yeh batch show hoga.
                      </p>
                    </div>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input
                        type="checkbox"
                        checked={batchIsActive}
                        onChange={(e) => setBatchIsActive(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="h-6 w-11 rounded-full bg-gray-300 peer-checked:bg-[#22c55e] peer-focus:outline-none after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                    </label>
                  </div>

                  {/* Save Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={handleSaveBatchSchedule}
                      className="btn-gold w-full cursor-pointer text-center !py-3 !text-sm"
                    >
                      🚀 Save &amp; Highlight on Website Front
                    </button>
                  </div>
                </div>

                {/* Front Live Preview Box */}
                <div className="rounded-2xl border border-dashed border-[#c3d8e6] bg-[#f9fcfe] p-4 text-xs text-[#4b6578]">
                  <div className="mb-2 font-black uppercase text-[#062847]">
                    👀 Live Preview of Website Front:
                  </div>
                  <div className="rounded-xl bg-[#062847] p-3.5 text-white">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-black text-[#ffd45a]">
                        <span>⚡ Next Fixed Departure:</span>
                        <span>
                          {formatDateWithDay(batchStartDate)} → {formatDateWithDay(batchEndDate)}
                        </span>
                      </div>
                      <span className="rounded-md bg-white/20 px-2 py-0.5 text-[11px] font-bold text-white">
                        {calculatedNights}N / {calculatedNights + 1}D
                      </span>
                    </div>
                    <div className="mt-1 flex items-center justify-between text-[11px] text-[#c5def1]">
                      <span>{batchTitle} • 14-Seater Luxury Tempo Traveller</span>
                      <span className="font-bold text-[#ffd45a]">Only {batchSeats} Seats Left!</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SAVED LEADS LIST */}
            {activeTab === "leads" && (
              <>
                {/* Search, Filter & Toolbar Bar */}
                <div className="border-b border-[#d7e8f4] bg-white px-3 sm:px-6 py-3 sm:py-3.5 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Search by name, phone, reference ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 rounded-xl border border-[#c3d8e6] bg-[#f9fcfe] px-3 py-2 text-xs text-[#173246] focus:border-[#062847] focus:outline-none"
                    />
                    {leads.length > 0 && (
                      <div>
                        {!confirmClear ? (
                          <button
                            type="button"
                            onClick={() => setConfirmClear(true)}
                            className="cursor-pointer rounded-lg border border-[#fecaca] bg-[#fef2f2] px-2.5 py-1.5 text-xs font-bold text-[#991b1b] hover:bg-[#fee2e2]"
                          >
                            Clear All
                          </button>
                        ) : (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => {
                                onClearAllLeads();
                                setConfirmClear(false);
                              }}
                              className="cursor-pointer rounded-lg bg-[#dc2626] px-2.5 py-1.5 text-xs font-bold text-white"
                            >
                              Confirm
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmClear(false)}
                              className="cursor-pointer rounded-lg border border-[#c3d8e6] bg-white px-2 py-1.5 text-xs font-bold text-[#173246]"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Status Tabs */}
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setStatusFilter("ALL")}
                      className={`rounded-lg px-2.5 py-1 font-bold ${
                        statusFilter === "ALL" ? "bg-[#062847] text-white" : "bg-[#f4f9fc] text-[#4b6578] hover:bg-[#e4f1fa]"
                      }`}
                    >
                      All ({leads.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter("PENDING_CALLBACK")}
                      className={`rounded-lg px-2.5 py-1 font-bold ${
                        statusFilter === "PENDING_CALLBACK" ? "bg-[#f59e0b] text-white" : "bg-[#f4f9fc] text-[#4b6578] hover:bg-[#e4f1fa]"
                      }`}
                    >
                      Pending ({leads.filter((l) => l.status === "PENDING_CALLBACK").length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatusFilter("CONTACTED")}
                      className={`rounded-lg px-2.5 py-1 font-bold ${
                        statusFilter === "CONTACTED" ? "bg-[#166534] text-white" : "bg-[#f4f9fc] text-[#4b6578] hover:bg-[#e4f1fa]"
                      }`}
                    >
                      Contacted ({leads.filter((l) => l.status === "CONTACTED").length})
                    </button>
                  </div>
                </div>

                {/* Leads List */}
                <div className="flex-1 space-y-3 sm:space-y-4 overflow-y-auto p-3.5 sm:p-6">
                  {filteredLeads.length === 0 ? (
                    <div className="rounded-2xl border border-[#e1eef6] bg-white p-8 text-center">
                      <p className="mb-1 text-base font-bold text-[#062847]">
                        No leads found matching criteria
                      </p>
                      <p className="text-xs text-[#4b6578]">
                        {searchQuery ? "Try clearing the search query." : "Submit an enquiry via Book Now or Price Calculator to see leads here."}
                      </p>
                    </div>
                  ) : (
                    filteredLeads.map((lead) => {
                      const isEditingThis = editingLeadId === lead.id;
                      const leadNights = lead.nights || calculateTripNights(lead.startDate, lead.endDate);
                      const isPending = lead.status === "PENDING_CALLBACK";

                      const waFollowupUrl = `https://wa.me/91${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                        `Namaste ${lead.name}! Aman Traveller se aapki "${lead.packageName}" trip enquiry regarding call/message tha.`
                      )}`;

                      return (
                        <div
                          key={lead.id}
                          className="rounded-2xl border border-[#e1eef6] bg-white p-4 shadow-xs"
                        >
                          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5">
                              <span className="rounded-lg bg-[#062847] px-2.5 py-1 text-xs font-black text-[#ffd45a]">
                                {lead.id}
                              </span>
                              {justSavedId === lead.id && (
                                <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-[11px] font-extrabold text-[#166534]">
                                  Updated ✓
                                </span>
                              )}
                            </div>

                            {/* Top Action Pills */}
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => onToggleLeadStatus(lead.id)}
                                className={`cursor-pointer rounded-full px-2.5 py-0.5 text-[11px] font-black ${
                                  isPending ? "bg-[#fef9c3] text-[#854d0e] hover:bg-[#fef08a]" : "bg-[#dcfce7] text-[#166534] hover:bg-[#bbf7d0]"
                                }`}
                                title="Click to toggle status"
                              >
                                {isPending ? "⏳ Pending Callback" : "✓ Contacted"}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  isEditingThis ? setEditingLeadId(null) : handleStartEditingDates(lead)
                                }
                                className={`cursor-pointer rounded-lg border px-2 py-0.5 text-[11px] font-bold ${
                                  isEditingThis
                                    ? "border-[#062847] bg-[#062847] text-white"
                                    : "border-[#c3d8e6] bg-[#f4f9fc] text-[#062847] hover:border-[#062847]"
                                }`}
                              >
                                {isEditingThis ? "Cancel" : "✏️ Edit"}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleCopyJson(lead)}
                                className="cursor-pointer rounded-lg border border-[#c3d8e6] px-2 py-0.5 text-[11px] font-bold text-[#173246] hover:bg-[#f4f9fc]"
                              >
                                {copiedId === lead.id ? "Copied!" : "JSON"}
                              </button>

                              {onDeleteLead && (
                                <div>
                                  {deletingId === lead.id ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        onDeleteLead(lead.id);
                                        setDeletingId(null);
                                      }}
                                      className="cursor-pointer rounded-lg bg-[#dc2626] px-2 py-0.5 text-[11px] font-black text-white"
                                    >
                                      Delete?
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => setDeletingId(lead.id)}
                                      className="cursor-pointer rounded-lg border border-[#fecaca] px-1.5 py-0.5 text-[11px] font-bold text-[#dc2626] hover:bg-[#fef2f2]"
                                      title="Delete lead"
                                    >
                                      ×
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Package Name */}
                          <div className="mb-2 text-sm font-black text-[#062847]">
                            {lead.packageName}
                          </div>

                          {/* Client Details Grid */}
                          <div className="mb-3 grid grid-cols-1 gap-1 text-xs text-[#4b6578] sm:grid-cols-2">
                            <div>
                              <strong>Client:</strong> <span className="text-[#173246] font-bold">{lead.name}</span>
                            </div>
                            <div>
                              <strong>Boarding:</strong> {lead.pickup}
                            </div>
                            <div>
                              <strong>Trip Window:</strong>{" "}
                              <span className="font-bold text-[#062847]">
                                {formatDateWithDay(lead.startDate)} → {formatDateWithDay(lead.endDate)}
                              </span>
                            </div>
                            <div>
                              <strong>Travelers:</strong>{" "}
                              {lead.guests === 1
                                ? "1 Solo Backpacker (Pod / Room)"
                                : `${lead.guests} Travelers (${leadNights}N/${leadNights + 1}D)`}
                            </div>
                            {lead.totalPrice && (
                              <div className="sm:col-span-2 text-[#166534] font-black">
                                Estimated Total: ₹{lead.totalPrice.toLocaleString("en-IN")}
                              </div>
                            )}
                            {lead.specialRequests && (
                              <div className="sm:col-span-2 text-[#854d0e] bg-[#fefce8] p-1.5 rounded-lg border border-[#fef08a]">
                                <strong>Request:</strong> {lead.specialRequests}
                              </div>
                            )}
                            {lead.adminNotes && (
                              <div className="sm:col-span-2 text-[#062847] bg-[#e4f1fa] p-1.5 rounded-lg border border-[#c3d8e6]">
                                <strong>Admin Note:</strong> {lead.adminNotes}
                              </div>
                            )}
                          </div>

                          {/* Quick Communication Actions */}
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <a
                              href={`tel:${lead.phone}`}
                              className="flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-lg border border-[#c3d8e6] bg-[#f4f9fc] px-3 py-1.5 text-xs font-black text-[#062847] no-underline hover:bg-[#e4f1fa]"
                            >
                              📞 Call ({lead.phone})
                            </a>
                            <a
                              href={waFollowupUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex flex-1 sm:flex-initial items-center justify-center gap-1.5 rounded-lg bg-[#25d366] px-3 py-1.5 text-xs font-black text-[#072814] no-underline hover:bg-[#20bd5a]"
                            >
                              💬 WhatsApp Customer
                            </a>
                          </div>

                          {/* Inline Customizer Screen */}
                          {isEditingThis && (
                            <div className="mt-3 rounded-xl border border-[#bcd6ea] bg-[#eaf4fb] p-3.5">
                              <div className="mb-2 text-xs font-black uppercase text-[#062847]">
                                Customize Lead Trip Dates, Guests &amp; Notes
                              </div>

                              {editError && (
                                <div className="mb-2 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-2.5 py-1 text-xs font-bold text-[#991b1b]">
                                  {editError}
                                </div>
                              )}

                              <div className="mb-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
                                <div>
                                  <label className="mb-1 block text-[11px] font-bold text-[#173246]">
                                    Start Date
                                  </label>
                                  <input
                                    type="date"
                                    value={editStartDate}
                                    onChange={(e) => {
                                      const nextStart = e.target.value;
                                      setEditStartDate(nextStart);
                                      if (nextStart && (!editEndDate || editEndDate <= nextStart)) {
                                        setEditEndDate(addDaysToDateString(nextStart, 3));
                                      }
                                      setEditError(null);
                                    }}
                                    className="w-full rounded-lg border border-[#c3d8e6] bg-white px-2 py-1 text-xs font-semibold text-[#173246]"
                                  />
                                </div>

                                <div>
                                  <label className="mb-1 block text-[11px] font-bold text-[#173246]">
                                    End Date
                                  </label>
                                  <input
                                    type="date"
                                    min={editStartDate ? addDaysToDateString(editStartDate, 1) : undefined}
                                    value={editEndDate}
                                    onChange={(e) => {
                                      setEditEndDate(e.target.value);
                                      setEditError(null);
                                    }}
                                    className="w-full rounded-lg border border-[#c3d8e6] bg-white px-2 py-1 text-xs font-semibold text-[#173246]"
                                  />
                                </div>

                                <div>
                                  <label className="mb-1 block text-[11px] font-bold text-[#173246]">
                                    Guests
                                  </label>
                                  <input
                                    type="number"
                                    min={1}
                                    max={30}
                                    value={editGuests}
                                    onChange={(e) => {
                                      setEditGuests(Number(e.target.value));
                                      setEditError(null);
                                    }}
                                    className="w-full rounded-lg border border-[#c3d8e6] bg-white px-2 py-1 text-xs font-semibold text-[#173246]"
                                  />
                                </div>
                              </div>

                              {/* Admin Notes Field */}
                              <div className="mb-3">
                                <label className="mb-1 block text-[11px] font-bold text-[#173246]">
                                  Internal Admin Notes (e.g. Quoted price, follow-up comments)
                                </label>
                                <input
                                  type="text"
                                  placeholder="e.g. Discussed Volvo semi-sleeper, callback scheduled tomorrow"
                                  value={editNotes}
                                  onChange={(e) => setEditNotes(e.target.value)}
                                  className="w-full rounded-lg border border-[#c3d8e6] bg-white px-2.5 py-1.5 text-xs text-[#173246]"
                                />
                              </div>

                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs font-bold text-[#062847]">
                                  {editStartDate && editEndDate && editEndDate > editStartDate
                                    ? `Duration: ${calculateTripNights(editStartDate, editEndDate)}N / ${calculateTripNights(editStartDate, editEndDate) + 1}D`
                                    : "Select valid dates"}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleSaveEditedDates(lead.id)}
                                  className="btn-gold cursor-pointer !px-3.5 !py-1 !text-xs"
                                >
                                  Save Changes
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
