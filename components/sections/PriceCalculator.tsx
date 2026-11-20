"use client";

import React, { useState, useMemo } from "react";
import { PACKAGES } from "@/data/packages";
import { TRANSFER_OPTIONS, ADDON_OPTIONS } from "@/data/calculator";
import { BookingContext } from "@/types";
import { getTodayDateString } from "@/lib/date-utils";
import { buildWhatsAppBookingUrl } from "@/lib/whatsapp";

interface PriceCalculatorProps {
  onOpenCallback: (ctx: BookingContext) => void;
}

export function PriceCalculator({ onOpenCallback }: PriceCalculatorProps) {
  const [tripType, setTripType] = useState<"Solo" | "Couple" | "Group">("Solo");
  const [guests, setGuests] = useState(1);
  const [selectedPkgId, setSelectedPkgId] = useState("solo-explorer");
  const [transferId, setTransferId] = useState("volvo");
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [travelDate, setTravelDate] = useState("");

  const todayStr = useMemo(() => getTodayDateString(), []);

  const handleTripTypeChange = (type: "Solo" | "Couple" | "Group") => {
    setTripType(type);
    if (type === "Solo") {
      setGuests(1);
      setSelectedPkgId("solo-explorer");
    } else if (type === "Couple") {
      setGuests(2);
      setSelectedPkgId("couple-bliss");
    } else {
      setGuests(6);
      setSelectedPkgId("couple-bliss");
    }
  };

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const breakdown = useMemo(() => {
    const pkg =
      PACKAGES.find((p) => p.id === selectedPkgId) || PACKAGES[0];
    const transfer =
      TRANSFER_OPTIONS.find((t) => t.id === transferId) || TRANSFER_OPTIONS[0];

    const effectiveGuests =
      tripType === "Solo" ? 1 : tripType === "Couple" ? 2 : Math.max(3, guests);
    const rooms = Math.ceil(effectiveGuests / 2);

    // Stay is fixed & included in all packages (No hotel selection)
    const stayLabel =
      tripType === "Solo"
        ? "Riverside Hostel / Pod (Included)"
        : "Private Valley-View Room (Included)";

    // Base package cost calculation
    let baseCost = 6000;
    if (tripType === "Solo") {
      baseCost = pkg.numericSoloPrice || 6000;
    } else if (tripType === "Couple") {
      baseCost = pkg.numericCouplePrice;
    } else {
      // Group: scaled from couple price
      baseCost = Math.round((pkg.numericCouplePrice / 2) * effectiveGuests);
    }

    // Transfer cost (auto-scaled per 4 guests for Sedan, per 6 guests for Innova)
    const cabsNeeded =
      transfer.id === "sedan"
        ? Math.ceil(effectiveGuests / 4)
        : transfer.id === "innova"
        ? Math.ceil(effectiveGuests / 6)
        : 1;
    const transferCost = transfer.price * cabsNeeded;

    // Add-ons cost
    const activeAddonObjects = ADDON_OPTIONS.filter((a) =>
      selectedAddons.includes(a.id)
    );
    const addonsCost = activeAddonObjects.reduce((sum, item) => {
      return sum + (item.perPerson ? item.price * effectiveGuests : item.price);
    }, 0);

    const subtotal = baseCost + transferCost + addonsCost;

    // 10% group discount when guests >= 6
    const groupDiscount =
      effectiveGuests >= 6 ? Math.round(subtotal * 0.1) : 0;

    const finalTotal = subtotal - groupDiscount;
    const perPerson = Math.round(finalTotal / effectiveGuests);

    return {
      pkg,
      stayLabel,
      transfer,
      tripType,
      effectiveGuests,
      rooms,
      cabsNeeded,
      baseCost,
      transferCost,
      addonsCost,
      groupDiscount,
      finalTotal,
      perPerson,
      addonLabels: activeAddonObjects.map((a) => a.label),
    };
  }, [tripType, guests, selectedPkgId, transferId, selectedAddons]);

  const whatsappUrl = buildWhatsAppBookingUrl({
    packageName: `${breakdown.pkg.title} (${breakdown.pkg.shortDur})`,
    tripType: tripType === "Solo" ? "Solo Traveler" : tripType,
    guests: breakdown.effectiveGuests,
    rooms: breakdown.rooms,
    stayTier: breakdown.stayLabel,
    transferMode:
      breakdown.cabsNeeded > 1 && breakdown.transfer.id !== "volvo"
        ? `${breakdown.transfer.label} × ${breakdown.cabsNeeded}`
        : breakdown.transfer.label,
    addons: breakdown.addonLabels,
    travelDate: travelDate || undefined,
    totalPrice: breakdown.finalTotal,
  });

  return (
    <section id="calculator" className="py-16">
      <div className="mx-auto w-[90%] max-w-[1180px]">
        <div className="mb-9 text-center">
          <div className="mb-2 inline-block rounded-xl bg-[#dcfce7] px-3 py-1 text-xs font-black uppercase text-[#166534]">
            Solo • Couple • Group Live Estimator
          </div>
          <h2 className="mb-2 text-[32px] font-extrabold text-[#062847]">
            Dynamic Trip Price Calculator
          </h2>
          <p className="text-[#4b6578]">
            Solo (starting ₹6,000/person), Couple aur Group ke hisaab se live trip cost calculate karein
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-7 lg:grid-cols-[1.45fr_1fr]">
          {/* Left Controls Card */}
          <div className="rounded-2xl border border-[#e1eef6] bg-white p-6 shadow-[0_8px_24px_rgba(23,50,70,0.06)] sm:p-7">
            <div className="mb-4">
              <label className="mb-2 block text-sm font-bold text-[#173246]">
                Trip Type
              </label>
              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={() => handleTripTypeChange("Solo")}
                  className={`filter-chip ${
                    tripType === "Solo" ? "active !bg-[#166534] !border-[#166534]" : ""
                  }`}
                >
                  🎒 Solo Backpacker (1 Guest • ₹6,000)
                </button>
                <button
                  type="button"
                  onClick={() => handleTripTypeChange("Couple")}
                  className={`filter-chip ${
                    tripType === "Couple" ? "active" : ""
                  }`}
                >
                  💑 Couple Getaway (2 Guests)
                </button>
                <button
                  type="button"
                  onClick={() => handleTripTypeChange("Group")}
                  className={`filter-chip ${
                    tripType === "Group" ? "active" : ""
                  }`}
                >
                  👨‍👩‍👧‍👦 Friends / Group (3–12)
                </button>
              </div>
            </div>

            {/* Solo Traveler Notice */}
            {tripType === "Solo" && (
              <div className="mb-5 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] p-3.5 text-xs text-[#166534]">
                <strong className="block text-sm font-black text-[#15803d]">
                  🌟 Solo Traveler Special: ₹6,000 / person
                </strong>
                Delhi to Manali AC Semi-Sleeper Volvo transfers, riverside hostel/boutique single room,
                high-speed Wi-Fi aur Jogini waterfall trek guidance included hai.
              </div>
            )}

            {/* Group Stepper */}
            {tripType === "Group" && (
              <div className="mb-5 rounded-xl border border-[#d7e8f4] bg-[#f4f9fc] p-4">
                <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-bold text-[#173246]">
                    Total Travelers: <strong className="text-[#062847]">{guests} Guests</strong>
                    <span className="ml-2 rounded-md bg-[#e4f1fa] px-2 py-0.5 text-xs text-[#062847]">
                      {breakdown.rooms} {breakdown.rooms > 1 ? "Rooms" : "Room"}
                    </span>
                  </div>
                  {guests >= 6 ? (
                    <span className="rounded-xl bg-[#dcfce7] px-2.5 py-0.5 text-xs font-extrabold text-[#166534]">
                      10% Group Discount Applied!
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-[#4b6578]">
                      Add {6 - guests} more for 10% group discount
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.max(3, g - 1))}
                    disabled={guests <= 3}
                    aria-label="Decrease guests"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c3d8e6] bg-white font-black text-[#062847] shadow-xs hover:bg-[#e4f1fa] disabled:opacity-40"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min={3}
                    max={12}
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="flex-1 cursor-pointer accent-[#062847]"
                  />
                  <button
                    type="button"
                    onClick={() => setGuests((g) => Math.min(12, g + 1))}
                    disabled={guests >= 12}
                    aria-label="Increase guests"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c3d8e6] bg-white font-black text-[#062847] shadow-xs hover:bg-[#e4f1fa] disabled:opacity-40"
                  >
                    +
                  </button>
                </div>

                <div className="mt-1 flex justify-between text-xs text-[#4b6578]">
                  <span>3 Guests</span>
                  <span className="font-bold text-[#062847]">6+ Guests (10% Off)</span>
                  <span>12 Guests</span>
                </div>
              </div>
            )}

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#173246]">
                  Select Package
                </label>
                <select
                  value={selectedPkgId}
                  onChange={(e) => setSelectedPkgId(e.target.value)}
                  className="w-full rounded-[10px] border border-[#c3d8e6] bg-white px-3 py-2.5 text-[15px] text-[#173246] focus:border-[#062847] focus:outline-none"
                >
                  {PACKAGES.map((pkg) => (
                    <option key={pkg.id} value={pkg.id}>
                      {pkg.title} ({pkg.shortDur} • {tripType === "Solo" && pkg.numericSoloPrice ? `₹${pkg.numericSoloPrice.toLocaleString("en-IN")}` : pkg.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#173246]">
                  Preferred Travel Date
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full rounded-[10px] border border-[#c3d8e6] bg-white px-3 py-2.5 text-[15px] text-[#173246] focus:border-[#062847] focus:outline-none"
                />
              </div>
            </div>

            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#173246]">
                  Hotel / Accommodation
                </label>
                <div className="flex min-h-[44px] items-center rounded-[10px] border border-[#bbf7d0] bg-[#f0fdf4] px-3.5 py-2 text-xs font-bold text-[#166534]">
                  ✓ {breakdown.stayLabel}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-bold text-[#173246]">
                  Delhi Transfer Mode
                </label>
                <select
                  value={transferId}
                  onChange={(e) => setTransferId(e.target.value)}
                  className="w-full rounded-[10px] border border-[#c3d8e6] bg-white px-3 py-2.5 text-[15px] text-[#173246] focus:border-[#062847] focus:outline-none"
                >
                  {TRANSFER_OPTIONS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}{" "}
                      {t.price > 0
                        ? `(+₹${t.price.toLocaleString("en-IN")})`
                        : "(Included)"}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#173246]">
                Customize Add-ons
              </label>
              <div className="grid gap-2.5">
                {ADDON_OPTIONS.map((addon) => {
                  const checked = selectedAddons.includes(addon.id);
                  return (
                    <label
                      key={addon.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-[10px] border px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                        checked
                          ? "border-[#062847] bg-[#eaf4fb] text-[#062847]"
                          : "border-[#c6dce9] bg-[#f9fcfe] text-[#173246] hover:bg-[#f0f7fc]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleAddon(addon.id)}
                        className="h-4 w-4 accent-[#062847]"
                      />
                      <span>
                        {addon.label}{" "}
                        <small className="font-normal text-[#4b6578]">
                          (+₹{addon.price.toLocaleString("en-IN")}
                          {addon.perPerson ? "/person" : ""})
                        </small>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Instant Quote Summary Card */}
          <div className="rounded-[18px] bg-[#062847] p-7 text-white shadow-[0_12px_30px_rgba(6,40,71,0.22)]">
            <span className="mb-3 inline-block rounded-xl bg-[#ffd45a] px-2.5 py-1 text-xs font-extrabold uppercase text-[#102c41]">
              Instant Quote Summary
            </span>

            <h3 className="mb-1 text-[22px] font-bold">{breakdown.pkg.title}</h3>
            <p className="mb-5 text-sm text-[#bfd7ea]">
              {tripType} Trip • {breakdown.effectiveGuests} Traveler{breakdown.effectiveGuests > 1 ? "s" : ""} •{" "}
              {breakdown.rooms} {breakdown.rooms > 1 ? "Rooms" : "Room"}
            </p>

            <div className="grid gap-2.5 border-y border-white/15 py-3.5 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-[#d6e6f2]">
                  Base Package ({breakdown.effectiveGuests} Traveler)
                </span>
                <strong>₹{breakdown.baseCost.toLocaleString("en-IN")}</strong>
              </div>

              <div className="flex justify-between gap-3">
                <span className="text-[#d6e6f2]">Hotel / Accommodation</span>
                <span className="font-semibold text-[#86efac]">
                  Included (0 Extra)
                </span>
              </div>

              {breakdown.transferCost > 0 && (
                <div className="flex justify-between gap-3">
                  <span className="text-[#d6e6f2]">
                    Private Cab Transfer
                    {breakdown.cabsNeeded > 1
                      ? ` (${breakdown.cabsNeeded} Cabs)`
                      : ""}
                  </span>
                  <strong>
                    +₹{breakdown.transferCost.toLocaleString("en-IN")}
                  </strong>
                </div>
              )}

              {breakdown.addonsCost > 0 && (
                <div className="flex justify-between gap-3">
                  <span className="text-[#d6e6f2]">Selected Add-ons</span>
                  <strong>
                    +₹{breakdown.addonsCost.toLocaleString("en-IN")}
                  </strong>
                </div>
              )}

              {breakdown.groupDiscount > 0 && (
                <div className="flex justify-between gap-3 text-[#86efac]">
                  <span>Group Savings (10% Off)</span>
                  <strong>
                    -₹{breakdown.groupDiscount.toLocaleString("en-IN")}
                  </strong>
                </div>
              )}
            </div>

            <div className="my-5 flex items-center justify-between gap-3">
              <div>
                <small className="block text-xs text-[#bfd7ea]">
                  Total Estimated Cost
                </small>
                <div className="text-[30px] font-black leading-tight text-[#ffd45a]">
                  ₹{breakdown.finalTotal.toLocaleString("en-IN")}
                </div>
              </div>
              <div className="rounded-[20px] bg-white/10 px-3 py-1.5 text-[13px] font-bold">
                ₹{breakdown.perPerson.toLocaleString("en-IN")} / person
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
            >
              Book This Quote on WhatsApp
            </a>

            <button
              type="button"
              onClick={() =>
                onOpenCallback({
                  packageName: `${breakdown.pkg.title} (${tripType} - ₹${breakdown.finalTotal.toLocaleString("en-IN")})`,
                  guests: breakdown.effectiveGuests,
                  travelDate,
                  stayTier: breakdown.stayLabel,
                  transferMode: breakdown.transfer.label,
                  addons: breakdown.addonLabels,
                  totalPrice: breakdown.finalTotal,
                })
              }
              className="btn-gold mt-2.5 w-full cursor-pointer text-center"
            >
              Lock Price via Callback
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
