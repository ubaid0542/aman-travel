"use client";

import React, { useState } from "react";
import { ITINERARY_DAYS } from "@/data/itinerary";
import { BookingContext } from "@/types";

interface ItinerarySectionProps {
  onCustomizeItinerary: (ctx: BookingContext) => void;
}

export function ItinerarySection({ onCustomizeItinerary }: ItinerarySectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentDay = ITINERARY_DAYS[activeIndex];

  return (
    <section id="itinerary" className="py-16">
      <div className="mx-auto w-[90%] max-w-[1180px]">
        <div className="mb-9 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#062847]/15 bg-[#e4f1fa] px-4 py-1.5 text-xs font-black text-[#062847]">
            <span>🚐 14-Seater Luxury Volvo Tempo Traveller</span>
            <span>•</span>
            <span className="text-[#0e5c94]">Delhi (Kashmere Gate) Departure</span>
          </div>
          <h2 className="mb-2 text-[32px] font-extrabold text-[#062847]">
            4-Day Delhi to Manali Trip Itinerary
          </h2>
          <p className="text-[#4b6578]">
            Kashmere Gate ISBT se Manali, Atal Tunnel, Koksar, Sissu, Kasol aur Night Bonfire ka complete day-by-day plan
          </p>
        </div>

        <div className="rounded-2xl border border-[#e1eef6] bg-white p-6 shadow-[0_8px_24px_rgba(23,50,70,0.06)] sm:p-7">
          {/* Day Tabs */}
          <div className="mb-5 flex flex-wrap gap-2.5">
            {ITINERARY_DAYS.map((item, idx) => (
              <button
                key={item.day}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`filter-chip ${activeIndex === idx ? "active" : ""}`}
              >
                {item.day}
              </button>
            ))}
          </div>

          <div className="mb-3 flex flex-wrap gap-2">
            {currentDay.highlights.map((tag) => (
              <span
                key={tag}
                className="rounded-xl bg-[#e4f1fa] px-2.5 py-1 text-xs font-bold text-[#062847]"
              >
                {tag}
              </span>
            ))}
          </div>

          <h3 className="text-xl font-bold text-[#062847]">
            {currentDay.day}: {currentDay.title}
          </h3>
          <p className="mt-2.5 text-[16px] leading-relaxed text-[#4b6578]">
            {currentDay.details}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#ebf3f8] pt-4">
            <span className="text-sm font-semibold text-[#4b6578]">
              Want to add Kasol, Sissu, or extra nights to this route?
            </span>
            <button
              type="button"
              onClick={() =>
                onCustomizeItinerary({
                  packageName: "Custom 4-Day Delhi to Manali Couple Itinerary",
                  guests: 2,
                })
              }
              className="btn-gold cursor-pointer !py-2.5 !text-sm"
            >
              Customize This Itinerary
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
