"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  BookingContext,
  LeadRecord,
  BookingFormValues,
  BookingFormErrors,
} from "@/types";
import {
  getTodayDateString,
  addDaysToDateString,
  calculateTripNights,
  formatDateWithDay,
  generateReferenceId,
  getThisWeekendDates,
} from "@/lib/date-utils";
import {
  validateBookingField,
  validateAllBookingFields,
  normalizeIndianPhone,
} from "@/lib/validation";
import { buildWhatsAppBookingUrl } from "@/lib/whatsapp";

interface BookingModalProps {
  bookingContext: BookingContext | null;
  onClose: () => void;
  onSaveEnquiry: (record: LeadRecord) => void;
  onOpenLeadsDrawer: () => void;
}

export function BookingModal({
  bookingContext,
  onClose,
  onSaveEnquiry,
  onOpenLeadsDrawer,
}: BookingModalProps) {
  const todayStr = useMemo(() => getTodayDateString(), []);

  const [values, setValues] = useState<BookingFormValues>({
    name: "",
    phone: "",
    email: "",
    startDate: "",
    endDate: "",
    pickup: "Delhi (Kashmere Gate 14-Seater Volvo Tempo)",
    guests: "2",
    specialRequests: "",
  });

  const [website, setWebsite] = useState(""); // Honeypot field
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<BookingFormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [simulateServerFailure, setSimulateServerFailure] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedRecord, setSavedRecord] = useState<LeadRecord | null>(null);
  const [copiedRef, setCopiedRef] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const guestsRef = useRef<HTMLInputElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bookingContext) {
      const initialStart =
        bookingContext.batchInfo?.startDate ||
        bookingContext.travelDate ||
        addDaysToDateString(todayStr, 7);
      const initialEnd =
        bookingContext.batchInfo?.endDate || addDaysToDateString(initialStart, 3);
      const isSolo = bookingContext.packageName.toLowerCase().includes("solo");
      const defaultGuests = bookingContext.guests !== undefined ? bookingContext.guests : isSolo ? 1 : 2;
      setValues((prev) => ({
        ...prev,
        startDate: initialStart,
        endDate: initialEnd,
        guests: String(defaultGuests),
      }));
      setTouched({});
      setErrors({});
      setServerError(null);
      setSavedRecord(null);
      setCopiedRef(false);
    }
  }, [bookingContext, todayStr]);

  if (!bookingContext) return null;

  const packageName = bookingContext.packageName;

  const tripNights =
    values.startDate && values.endDate && values.endDate > values.startDate
      ? calculateTripNights(values.startDate, values.endDate)
      : null;

  const handleFieldChange = (field: keyof BookingFormValues, rawVal: string) => {
    let sanitizedVal = rawVal;

    // Special cleanups
    if (field === "phone") {
      // Keep only digits and max 10
      sanitizedVal = rawVal.replace(/\D/g, "");
      if (sanitizedVal.length > 10 && (sanitizedVal.startsWith("91") || sanitizedVal.startsWith("0"))) {
        sanitizedVal = normalizeIndianPhone(sanitizedVal);
      }
      sanitizedVal = sanitizedVal.slice(0, 10);
    }

    const nextValues = { ...values, [field]: sanitizedVal };

    // Auto-suggest +3 nights ending date when startDate is changed
    if (
      field === "startDate" &&
      sanitizedVal &&
      (!values.endDate || values.endDate <= sanitizedVal)
    ) {
      nextValues.endDate = addDaysToDateString(sanitizedVal, 3);
    }

    setValues(nextValues);
    setServerError(null);

    if (touched[field]) {
      const msg = validateBookingField(
        field,
        nextValues[field],
        todayStr,
        nextValues
      );
      setErrors((prev) => ({ ...prev, [field]: msg || undefined }));
    }

    if (field === "startDate" && nextValues.endDate) {
      const endMsg = validateBookingField(
        "endDate",
        nextValues.endDate,
        todayStr,
        nextValues
      );
      setErrors((prev) => ({ ...prev, endDate: endMsg || undefined }));
    }
  };

  const handleFieldBlur = (field: keyof BookingFormValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Auto capitalize name
    if (field === "name" && values.name.trim()) {
      const capitalized = values.name
        .trim()
        .split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
      setValues((prev) => ({ ...prev, name: capitalized }));
    }

    const msg = validateBookingField(field, values[field], todayStr, values);
    setErrors((prev) => ({ ...prev, [field]: msg || undefined }));
  };

  const applyWeekendPreset = () => {
    const { start, end } = getThisWeekendDates();
    setValues((prev) => ({
      ...prev,
      startDate: start,
      endDate: end,
    }));
    setErrors((prev) => ({ ...prev, startDate: undefined, endDate: undefined }));
  };

  const applyDaysPreset = (daysOffset: number) => {
    const start = addDaysToDateString(todayStr, daysOffset);
    const end = addDaysToDateString(start, 3);
    setValues((prev) => ({
      ...prev,
      startDate: start,
      endDate: end,
    }));
    setErrors((prev) => ({ ...prev, startDate: undefined, endDate: undefined }));
  };

  const focusFirstInvalidInput = (validationErrors: BookingFormErrors) => {
    if (validationErrors.name) nameRef.current?.focus();
    else if (validationErrors.phone) phoneRef.current?.focus();
    else if (validationErrors.guests) guestsRef.current?.focus();
    else if (validationErrors.startDate) startDateRef.current?.focus();
    else if (validationErrors.endDate) endDateRef.current?.focus();
  };

  const dateRangeSummary =
    values.startDate && values.endDate
      ? `${formatDateWithDay(values.startDate)} to ${formatDateWithDay(
          values.endDate
        )}${tripNights ? ` (${tripNights}N/${tripNights + 1}D)` : ""}`
      : values.startDate || undefined;

  const whatsappDirectLink = buildWhatsAppBookingUrl({
    packageName,
    referenceId: savedRecord?.id,
    customerName: values.name.trim() || undefined,
    guests: Math.max(1, Number(values.guests) || 2),
    travelDate: dateRangeSummary,
    pickupCity: values.pickup,
    stayTier: bookingContext.stayTier,
    transferMode: bookingContext.transferMode,
    addons: bookingContext.addons,
    totalPrice: bookingContext.totalPrice,
    specialRequests: values.specialRequests,
  });

  const handleCopyReference = () => {
    if (savedRecord?.id && typeof navigator !== "undefined" && navigator?.clipboard) {
      navigator.clipboard.writeText(savedRecord.id);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    setTouched({
      name: true,
      phone: true,
      startDate: true,
      endDate: true,
      pickup: true,
      guests: true,
      email: true,
    });

    const validationErrors = validateAllBookingFields(values, todayStr);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      focusFirstInvalidInput(validationErrors);
      return;
    }

    setIsSubmitting(true);

    // Bot protection Honeypot
    if (website.trim() !== "") {
      setIsSubmitting(false);
      onClose();
      return;
    }

    // Simulated Server Failure test mode
    if (simulateServerFailure) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      setIsSubmitting(false);
      setServerError(
        "503 Service Unavailable: Server se temporary connection error aaya hai. Kripya dubara try karein ya niche WhatsApp button se direct booking karein."
      );
      return;
    }

    const nights = calculateTripNights(values.startDate, values.endDate);
    const newRecord: LeadRecord = {
      id: generateReferenceId(),
      packageName,
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email?.trim() || undefined,
      startDate: values.startDate,
      endDate: values.endDate,
      nights,
      pickup: values.pickup,
      guests: Number(values.guests),
      stayTier: bookingContext.stayTier,
      transferMode: bookingContext.transferMode,
      addons: bookingContext.addons,
      totalPrice: bookingContext.totalPrice,
      specialRequests: values.specialRequests?.trim() || undefined,
      status: "PENDING_CALLBACK",
      createdAt: new Date().toISOString(),
      source: "website-booking-modal",
    };

    // Post to Next.js API Route /api/enquiry
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord),
      });

      if (!response.ok) {
        const errorJson = await response.json();
        throw new Error(errorJson.message || "Failed to submit enquiry");
      }
    } catch {
      // Fallback gracefully so customer enquiry is never lost locally
    }

    onSaveEnquiry(newRecord);
    setSavedRecord(newRecord);
    setIsSubmitting(false);
  };

  const guestsNum = Number(values.guests) || 2;
  const estimatedRooms = Math.ceil(guestsNum / 2);
  const isPhoneValid = /^[6-9]\d{9}$/.test(values.phone.trim());
  const isNameValid = values.name.trim().length >= 2 && /^[a-zA-Z\s.'-]+$/.test(values.name.trim());
  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#041f3d]/80 p-4 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-title"
        className="relative max-h-[92vh] w-full max-w-[540px] overflow-y-auto rounded-[20px] bg-white p-6 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-3.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-[#f4f9fc] text-xl leading-none text-[#4b6578] transition-colors hover:bg-[#e4f1fa] hover:text-[#062847]"
        >
          ×
        </button>

        {savedRecord ? (
          <div className="py-2 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#dcfce7] text-2xl text-[#166534]">
              ✓
            </div>

            <div className="mb-2 flex items-center justify-center gap-2">
              <span className="inline-block rounded-xl bg-[#062847] px-3.5 py-1 text-xs font-black text-[#ffd45a]">
                Reference ID: {savedRecord.id}
              </span>
              <button
                type="button"
                onClick={handleCopyReference}
                className="cursor-pointer rounded-lg border border-[#c3d8e6] bg-[#f4f9fc] px-2.5 py-1 text-xs font-bold text-[#062847] hover:bg-[#e4f1fa]"
              >
                {copiedRef ? "Copied! ✓" : "Copy ID"}
              </button>
            </div>

            <h3 className="mb-1.5 text-2xl font-black text-[#062847]">
              Delhi to Manali Enquiry Confirmed!
            </h3>
            <p className="mb-4 text-[15px] leading-relaxed text-[#4b6578]">
              Thank you, <strong>{savedRecord.name}</strong>! Aapka enquiry request humare
              Manali coordinators ko receive ho gaya hai.
            </p>

            {/* Structured Trip Recap Card */}
            <div className="mb-4 rounded-xl border border-[#d7e8f4] bg-[#f4f9fc] p-4 text-left text-xs text-[#173246]">
              <div className="mb-2 font-black text-[#062847]">
                📌 {savedRecord.packageName}
              </div>
              <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                <div>
                  <span className="text-[#4b6578]">Travel Dates:</span>{" "}
                  <strong>
                    {formatDateWithDay(savedRecord.startDate)} →{" "}
                    {formatDateWithDay(savedRecord.endDate)}
                  </strong>
                </div>
                <div>
                  <span className="text-[#4b6578]">Duration:</span>{" "}
                  <strong>
                    {savedRecord.nights} Nights / {savedRecord.nights + 1} Days
                  </strong>
                </div>
                <div>
                  <span className="text-[#4b6578]">Travelers:</span>{" "}
                  <strong>{savedRecord.guests} Guests ({Math.ceil(savedRecord.guests / 2)} Rooms)</strong>
                </div>
                <div>
                  <span className="text-[#4b6578]">Boarding:</span>{" "}
                  <strong>{savedRecord.pickup}</strong>
                </div>
                {savedRecord.totalPrice && (
                  <div className="sm:col-span-2 text-[#166534] font-bold">
                    <span>Estimated Quote:</span> ₹{savedRecord.totalPrice.toLocaleString("en-IN")}
                  </div>
                )}
              </div>
            </div>

            <a
              href={whatsappDirectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mb-2.5 !py-3 text-[15px]"
            >
              💬 Instant Confirmation on WhatsApp
            </a>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLeadsDrawer();
                }}
                className="w-1/2 rounded-[30px] border border-[#062847] bg-white py-2.5 text-xs font-bold text-[#062847] hover:bg-[#f4f9fc]"
              >
                View in Leads Vault →
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn-gold w-1/2 cursor-pointer text-center !py-2.5 !text-xs"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-4">
              <span className="mb-1 inline-block rounded-lg bg-[#e4f1fa] px-2 py-0.5 text-xs font-black uppercase text-[#062847]">
                Callback &amp; Booking Desk
              </span>
              <h3
                id="booking-modal-title"
                className="text-xl font-extrabold text-[#062847]"
              >
                Customize Delhi to Manali Trip
              </h3>
              <p className="mt-0.5 text-xs text-[#4b6578]">
                Package: <strong className="text-[#062847]">{packageName}</strong>
              </p>
            </div>

            {/* Calculated Context Badge if available */}
            {bookingContext.totalPrice && (
              <div className="mb-3 flex items-center justify-between rounded-xl bg-[#062847] px-4 py-2.5 text-white">
                <div>
                  <div className="text-[11px] text-[#bfd7ea]">Pre-Calculated Quote</div>
                  <div className="text-sm font-black text-[#ffd45a]">
                    ₹{bookingContext.totalPrice.toLocaleString("en-IN")} Total
                  </div>
                </div>
                <div className="text-right text-xs text-[#d6e6f2]">
                  <div>{bookingContext.stayTier || "Deluxe Valley-View"}</div>
                  <div className="text-[11px] text-[#bfd7ea]">{bookingContext.transferMode || "Volvo"}</div>
                </div>
              </div>
            )}

            {/* Scheduled Departure Batch Card if available */}
            {bookingContext.batchInfo && (
              <div className="mb-4 rounded-xl border border-[#ffd45a] bg-gradient-to-r from-[#062847] to-[#0b3b66] p-3 text-white">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-xs font-black text-[#ffd45a]">
                    <span>⚡ Scheduled Departure Batch</span>
                  </span>
                  <span className="rounded-md bg-white/20 px-2 py-0.5 text-[11px] font-bold text-white">
                    {bookingContext.batchInfo.nights} Nights / {bookingContext.batchInfo.nights + 1} Days
                  </span>
                </div>
                <div className="mt-1 text-sm font-black text-white">
                  🗓️ {formatDateWithDay(bookingContext.batchInfo.startDate)} → {formatDateWithDay(bookingContext.batchInfo.endDate)}
                </div>
                {bookingContext.batchInfo.title && (
                  <div className="text-[11px] text-[#c5def1]">{bookingContext.batchInfo.title}</div>
                )}
              </div>
            )}

            {/* Hidden Honeypot Input */}
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            {/* Error Banners */}
            {serverError && (
              <div
                role="alert"
                className="mb-3.5 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-3.5 py-2.5 text-xs font-semibold leading-snug text-[#991b1b]"
              >
                <strong>Error:</strong> {serverError}
              </div>
            )}

            {!serverError && errorCount > 0 && (
              <div
                role="alert"
                className="mb-3.5 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-3.5 py-2 text-xs font-bold text-[#991b1b]"
              >
                Kripya {errorCount} highlighted {errorCount === 1 ? "field" : "fields"} ko sahi karein.
              </div>
            )}

            {/* Full Name Input */}
            <div className="mb-3.5">
              <div className="mb-1 flex items-center justify-between">
                <label
                  htmlFor="booking-name"
                  className="text-xs font-bold uppercase tracking-wider text-[#173246]"
                >
                  Full Name *
                </label>
                {isNameValid && (
                  <span className="text-xs font-bold text-[#166534]">
                    ✓ Valid
                  </span>
                )}
              </div>
              <input
                ref={nameRef}
                id="booking-name"
                type="text"
                placeholder="e.g. Rohan Sharma"
                value={values.name}
                aria-invalid={Boolean(errors.name)}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                onBlur={() => handleFieldBlur("name")}
                className={`w-full rounded-xl border px-3 py-2.5 text-sm text-[#173246] transition-all focus:outline-none ${
                  errors.name
                    ? "border-[#dc2626] bg-[#fffafa] ring-3 ring-[#dc2626]/15"
                    : isNameValid
                    ? "border-[#86efac] bg-white focus:border-[#062847]"
                    : "border-[#c3d8e6] bg-white focus:border-[#062847]"
                }`}
              />
              {errors.name && (
                <span role="alert" className="mt-1 block text-xs font-bold text-[#dc2626]">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Phone & Guests Row */}
            <div className="mb-3.5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label
                    htmlFor="booking-phone"
                    className="text-xs font-bold uppercase tracking-wider text-[#173246]"
                  >
                    Phone / WhatsApp *
                  </label>
                  <span className="text-[11px] font-semibold text-[#4b6578]">
                    {values.phone.length}/10
                  </span>
                </div>
                <div className="relative flex">
                  <span className="inline-flex items-center rounded-l-xl border border-r-0 border-[#c3d8e6] bg-[#f4f9fc] px-2.5 text-xs font-extrabold text-[#062847]">
                    🇮🇳 +91
                  </span>
                  <input
                    ref={phoneRef}
                    id="booking-phone"
                    type="tel"
                    inputMode="numeric"
                    placeholder="9876543210"
                    value={values.phone}
                    aria-invalid={Boolean(errors.phone)}
                    onChange={(e) => handleFieldChange("phone", e.target.value)}
                    onBlur={() => handleFieldBlur("phone")}
                    className={`w-full rounded-r-xl border px-3 py-2 text-sm text-[#173246] transition-all focus:outline-none ${
                      errors.phone
                        ? "border-[#dc2626] bg-[#fffafa] ring-3 ring-[#dc2626]/15"
                        : isPhoneValid
                        ? "border-[#86efac] bg-white focus:border-[#062847]"
                        : "border-[#c3d8e6] bg-white focus:border-[#062847]"
                    }`}
                  />
                </div>
                {errors.phone ? (
                  <span role="alert" className="mt-1 block text-xs font-bold text-[#dc2626]">
                    {errors.phone}
                  </span>
                ) : isPhoneValid ? (
                  <span className="mt-1 block text-[11px] font-bold text-[#166534]">
                    ✓ Valid 10-digit number
                  </span>
                ) : null}
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between">
                  <label
                    htmlFor="booking-guests"
                    className="text-xs font-bold uppercase tracking-wider text-[#173246]"
                  >
                    Guests *
                  </label>
                  <span className="text-[11px] font-bold text-[#062847]">
                    {guestsNum === 1 ? "1 Solo Pod / Room" : `${estimatedRooms} ${estimatedRooms > 1 ? "Rooms" : "Room"}`}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const cur = Number(values.guests) || 2;
                      if (cur > 1) handleFieldChange("guests", String(cur - 1));
                    }}
                    disabled={guestsNum <= 1}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c3d8e6] bg-white font-black text-[#062847] hover:bg-[#e4f1fa] disabled:opacity-40"
                  >
                    -
                  </button>
                  <input
                    ref={guestsRef}
                    id="booking-guests"
                    type="number"
                    min={1}
                    max={30}
                    value={values.guests}
                    aria-invalid={Boolean(errors.guests)}
                    onChange={(e) => handleFieldChange("guests", e.target.value)}
                    onBlur={() => handleFieldBlur("guests")}
                    className="flex-1 rounded-lg border border-[#c3d8e6] bg-white px-2.5 py-1.5 text-center text-sm font-bold text-[#173246] focus:border-[#062847] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const cur = Number(values.guests) || 2;
                      if (cur < 30) handleFieldChange("guests", String(cur + 1));
                    }}
                    disabled={guestsNum >= 30}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c3d8e6] bg-white font-black text-[#062847] hover:bg-[#e4f1fa] disabled:opacity-40"
                  >
                    +
                  </button>
                </div>
                {errors.guests && (
                  <span role="alert" className="mt-1 block text-xs font-bold text-[#dc2626]">
                    {errors.guests}
                  </span>
                )}
              </div>
            </div>

            {/* Travel Dates with Quick Presets */}
            <div className="mb-3.5">
              <div className="mb-1.5 flex flex-wrap items-center justify-between gap-1">
                <label className="text-xs font-bold uppercase tracking-wider text-[#173246]">
                  Trip Dates *
                </label>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  {bookingContext.batchInfo && (
                    <button
                      type="button"
                      onClick={() => {
                        setValues((prev) => ({
                          ...prev,
                          startDate: bookingContext.batchInfo!.startDate,
                          endDate: bookingContext.batchInfo!.endDate,
                        }));
                        setErrors((prev) => ({ ...prev, startDate: undefined, endDate: undefined }));
                      }}
                      className="cursor-pointer rounded-md bg-[#ffd45a] px-2 py-0.5 font-black text-[#041f3d] hover:bg-[#ffe58f]"
                    >
                      ⚡ Scheduled Batch
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={applyWeekendPreset}
                    className="cursor-pointer rounded-md bg-[#e4f1fa] px-2 py-0.5 font-bold text-[#062847] hover:bg-[#d0e5f5]"
                  >
                    ⚡ This Weekend
                  </button>
                  <button
                    type="button"
                    onClick={() => applyDaysPreset(10)}
                    className="cursor-pointer rounded-md bg-[#e4f1fa] px-2 py-0.5 font-bold text-[#062847] hover:bg-[#d0e5f5]"
                  >
                    ❄️ +10 Days
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <div>
                  <span className="mb-1 block text-[11px] font-semibold text-[#4b6578]">
                    Start Date (Delhi Departure)
                  </span>
                  <input
                    ref={startDateRef}
                    id="booking-start-date"
                    type="date"
                    min={todayStr}
                    value={values.startDate}
                    aria-invalid={Boolean(errors.startDate)}
                    onChange={(e) => handleFieldChange("startDate", e.target.value)}
                    onBlur={() => handleFieldBlur("startDate")}
                    className={`w-full rounded-xl border px-3 py-2 text-xs text-[#173246] focus:outline-none ${
                      errors.startDate ? "border-[#dc2626] bg-[#fffafa]" : "border-[#c3d8e6] bg-white focus:border-[#062847]"
                    }`}
                  />
                  {errors.startDate && (
                    <span role="alert" className="mt-1 block text-xs font-bold text-[#dc2626]">
                      {errors.startDate}
                    </span>
                  )}
                </div>

                <div>
                  <span className="mb-1 block text-[11px] font-semibold text-[#4b6578]">
                    End Date (Delhi Return)
                  </span>
                  <input
                    ref={endDateRef}
                    id="booking-end-date"
                    type="date"
                    min={values.startDate ? addDaysToDateString(values.startDate, 1) : todayStr}
                    value={values.endDate}
                    aria-invalid={Boolean(errors.endDate)}
                    onChange={(e) => handleFieldChange("endDate", e.target.value)}
                    onBlur={() => handleFieldBlur("endDate")}
                    className={`w-full rounded-xl border px-3 py-2 text-xs text-[#173246] focus:outline-none ${
                      errors.endDate ? "border-[#dc2626] bg-[#fffafa]" : "border-[#c3d8e6] bg-white focus:border-[#062847]"
                    }`}
                  />
                  {errors.endDate && (
                    <span role="alert" className="mt-1 block text-xs font-bold text-[#dc2626]">
                      {errors.endDate}
                    </span>
                  )}
                </div>
              </div>

              {/* Live Formatted Summary Badge */}
              {values.startDate && values.endDate && (
                <div className="mt-2 rounded-lg border border-[#c6dce9] bg-[#eaf4fb] px-3 py-1.5 text-xs font-bold text-[#062847]">
                  🗓️ {formatDateWithDay(values.startDate)} → {formatDateWithDay(values.endDate)}
                  {tripNights ? ` (${tripNights} Nights / ${tripNights + 1} Days)` : ""}
                </div>
              )}
            </div>

            {/* Delhi Boarding / Cab Selector */}
            <div className="mb-3.5">
              <label
                htmlFor="booking-pickup"
                className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#173246]"
              >
                Delhi Boarding Point / Cab *
              </label>
              <select
                id="booking-pickup"
                value={values.pickup}
                aria-invalid={Boolean(errors.pickup)}
                onChange={(e) => handleFieldChange("pickup", e.target.value)}
                onBlur={() => handleFieldBlur("pickup")}
                className="w-full rounded-xl border border-[#c3d8e6] bg-white px-3 py-2 text-xs text-[#173246] focus:border-[#062847] focus:outline-none"
              >
                <option value="Delhi (Kashmere Gate 14-Seater Volvo Tempo)">
                  Kashmere Gate ISBT, Delhi (14-Seater Luxury Volvo Tempo Traveller • 8:30 PM)
                </option>
                <option value="Delhi (Majnu Ka Tilla Volvo)">
                  Majnu Ka Tilla, North Delhi (AC Semi-Sleeper Volvo • 8:30 PM)
                </option>
                <option value="Delhi (RK Ashram Marg Volvo)">
                  RK Ashram Marg / Connaught Place (AC Volvo • 9:15 PM)
                </option>
                <option value="Delhi NCR Private Cab">
                  Delhi NCR Doorstep Cab (Private Sedan / SUV • Flexible Timing)
                </option>
              </select>
            </div>

            {/* Optional Email & Special Requests Accordion */}
            <div className="mb-3.5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="booking-email"
                  className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#173246]"
                >
                  Email Address <span className="font-normal text-[#4b6578]">(Optional)</span>
                </label>
                <input
                  id="booking-email"
                  type="email"
                  placeholder="name@example.com"
                  value={values.email || ""}
                  onChange={(e) => handleFieldChange("email", e.target.value)}
                  onBlur={() => handleFieldBlur("email")}
                  className={`w-full rounded-xl border px-3 py-2 text-xs text-[#173246] focus:outline-none ${
                    errors.email ? "border-[#dc2626] bg-[#fffafa]" : "border-[#c3d8e6] bg-white focus:border-[#062847]"
                  }`}
                />
                {errors.email && (
                  <span role="alert" className="mt-1 block text-xs font-bold text-[#dc2626]">
                    {errors.email}
                  </span>
                )}
              </div>

              <div>
                <label
                  htmlFor="booking-requests"
                  className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#173246]"
                >
                  Special Request <span className="font-normal text-[#4b6578]">(Optional)</span>
                </label>
                <input
                  id="booking-requests"
                  type="text"
                  placeholder="e.g. Honeymoon setup, Veg meals"
                  value={values.specialRequests || ""}
                  onChange={(e) => handleFieldChange("specialRequests", e.target.value)}
                  className="w-full rounded-xl border border-[#c3d8e6] bg-white px-3 py-2 text-xs text-[#173246] focus:border-[#062847] focus:outline-none"
                />
              </div>
            </div>

            {/* Test Simulation Switch */}
            <label className="mb-3 flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-[#c3d8e6] bg-[#f4f9fc] px-3 py-1.5 text-[11px] text-[#4b6578]">
              <span>Test API Error Handling on Submit</span>
              <input
                type="checkbox"
                checked={simulateServerFailure}
                onChange={(e) => {
                  setSimulateServerFailure(e.target.checked);
                  setServerError(null);
                }}
                className="h-3.5 w-3.5 accent-[#dc2626]"
              />
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-gold w-full cursor-pointer text-center !py-3 !text-sm disabled:cursor-not-allowed disabled:opacity-75"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Validating &amp; Submitting...
                </span>
              ) : (
                "Request Phone Callback & Best Quote"
              )}
            </button>

            <a
              href={whatsappDirectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp mt-2.5 !py-2.5 !text-xs"
            >
              Or Send Details Directly via WhatsApp
            </a>
          </form>
        )}
      </div>
    </div>
  );
}
