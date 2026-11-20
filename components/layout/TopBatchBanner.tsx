"use client";

import React from "react";
import { ActiveTripBatch, BookingContext } from "@/types";
import { formatDateWithDay } from "@/lib/date-utils";

interface TopBatchBannerProps {
  activeBatch: ActiveTripBatch;
  onOpenBooking: (ctx: BookingContext) => void;
  onOpenAdminSchedule?: () => void;
}

export function TopBatchBanner({
  activeBatch,
  onOpenBooking,
  onOpenAdminSchedule,
}: TopBatchBannerProps) {
  if (!activeBatch.isActive) return null;

  const handleBookBatch = () => {
    onOpenBooking({
      packageName: activeBatch.title || "Manali 3-Day Fixed Departure Batch",
      travelDate: activeBatch.startDate,
      guests: 2,
      batchInfo: activeBatch,
    });
  };

  return (
    <aside
      aria-label="Upcoming 3-Day Departure Announcement"
      className="relative z-50 border-b border-[#ffd45a]/30 bg-gradient-to-r from-[#031527] via-[#062847] to-[#0b3b66] px-4 py-2.5 text-white shadow-md"
    >
      <div className="mx-auto flex max-w-[1260px] flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Left Side: Pulse badge & Batch Dates */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <span className="flex items-center gap-1.5 rounded-full bg-[#ef4444] px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-white shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
            </span>
            Next Departure Batch
          </span>

          <div className="flex flex-wrap items-center gap-1.5 font-bold">
            <span className="text-[#ffd45a]">
              🗓️ {formatDateWithDay(activeBatch.startDate)} → {formatDateWithDay(activeBatch.endDate)}
            </span>
            <span className="rounded-md bg-white/15 px-2 py-0.5 text-[11px] font-extrabold text-white">
              {activeBatch.nights || 3}N / {(activeBatch.nights || 3) + 1}D
            </span>
            <span className="hidden text-white/50 md:inline">•</span>
            <span className="hidden text-[#e2eef7] md:inline">
              🚐 14-Seater Volvo Tempo (Kashmere Gate)
            </span>
            {activeBatch.seatsLeft !== undefined && activeBatch.seatsLeft > 0 && (
              <span className="rounded-md bg-[#ffd45a]/20 px-2 py-0.5 text-[11px] font-extrabold text-[#ffd45a]">
                ⚡ {activeBatch.seatsLeft} Seats Left
              </span>
            )}
          </div>
        </div>

        {/* Right Side: Quick Action Button & Admin Edit Trigger */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleBookBatch}
            className="flex cursor-pointer items-center gap-1.5 rounded-full bg-[#ffd45a] px-3.5 py-1 text-xs font-black text-[#041f3d] transition-all hover:bg-white hover:shadow-md"
          >
            <span>Book This Batch</span>
            <span className="text-[11px] font-normal opacity-90 sm:inline">(₹6k Solo / ₹11k Couple)</span>
            <span>→</span>
          </button>

          {onOpenAdminSchedule && (
            <button
              type="button"
              onClick={onOpenAdminSchedule}
              className="hidden cursor-pointer rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/80 hover:bg-white/20 hover:text-white sm:inline-block"
              title="Admin: Customize this trip date"
            >
              ⚙️ Customize Date
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
