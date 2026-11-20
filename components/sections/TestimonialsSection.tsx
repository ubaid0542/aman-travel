"use client";

import React, { useState } from "react";
import { SAMPLE_REVIEWS } from "@/data/testimonials";
import { BookingContext } from "@/types";

interface TestimonialsSectionProps {
  onPlanSimilar: (ctx: BookingContext) => void;
}

export function TestimonialsSection({ onPlanSimilar }: TestimonialsSectionProps) {
  const [filter, setFilter] = useState("All");

  const filters = ["All", "Solo Trip", "Couple Getaway", "Snow Special", "Group Trip"];

  const visibleReviews =
    filter === "All"
      ? SAMPLE_REVIEWS
      : SAMPLE_REVIEWS.filter((r) => r.tripType === filter);

  return (
    <section id="reviews" className="bg-[#eaf4fb] py-16">
      <div className="mx-auto w-[90%] max-w-[1180px]">
        <div className="mb-9 text-center">
          <div className="mb-2 inline-block rounded-xl bg-[#dcfce7] px-3 py-1 text-xs font-black uppercase text-[#166534]">
            Solo, Couple &amp; Group Reviews
          </div>
          <h2 className="mb-2 text-[32px] font-extrabold text-[#062847]">
            Verified Traveler &amp; Couple Stories
          </h2>
          <p className="text-[#4b6578]">
            Delhi to Manali solo backpackers (₹6,000 budget), couples aur groups ke real experiences
          </p>
        </div>

        {/* Dark Navy Trust Banner */}
        <div className="mb-7 grid grid-cols-1 gap-4 rounded-2xl bg-[#062847] px-6 py-5 text-center text-white sm:grid-cols-3">
          <div>
            <strong className="block text-[22px] font-black text-[#ffd45a]">
              4.9 / 5 ★
            </strong>
            <span className="text-[13px] text-[#d6e6f2]">
              Average Traveler Rating
            </span>
          </div>
          <div>
            <strong className="block text-[22px] font-black text-[#ffd45a]">
              Solo &amp; Couples Safe
            </strong>
            <span className="text-[13px] text-[#d6e6f2]">
              Verified Hostels &amp; Hotels
            </span>
          </div>
          <div>
            <strong className="block text-[22px] font-black text-[#ffd45a]">
              24/7 On-Ground
            </strong>
            <span className="text-[13px] text-[#d6e6f2]">
              Local Captain Trip Support
            </span>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="mb-8 flex flex-wrap justify-center gap-2.5">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`filter-chip ${filter === item ? "active" : ""}`}
            >
              {item === "Solo Trip" ? "🎒 Solo Trips (₹6,000)" : item}
            </button>
          ))}
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {visibleReviews.map((review) => (
            <article
              key={review.id}
              className="flex flex-col justify-between rounded-2xl border border-[#e1eef6] bg-white p-6 shadow-[0_8px_24px_rgba(23,50,70,0.08)]"
            >
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-xl bg-[#dcfce7] px-2.5 py-0.5 text-xs font-extrabold text-[#166534]">
                    ✓ Verified Booking
                  </span>
                  <span
                    className="text-[15px] tracking-widest text-[#f59e0b]"
                    aria-label={`${review.rating} out of 5 stars`}
                  >
                    {"★".repeat(review.rating)}
                  </span>
                </div>

                <div className="mb-2 text-[17px] font-extrabold text-[#062847]">
                  “{review.highlight}”
                </div>
                <p className="mb-4 text-[15px] leading-relaxed text-[#4b6578]">
                  {review.comment}
                </p>
              </div>

              <div>
                <div className="mb-3.5 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#062847] font-black text-[#ffd45a]">
                    {review.coupleNames.charAt(0)}
                  </div>
                  <div>
                    <strong className="block text-[15px] text-[#173246]">
                      {review.coupleNames}
                    </strong>
                    <div className="text-[13px] text-[#4b6578]">
                      {review.city} • {review.travelMonth} • {review.tripType}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 border-t border-[#ebf3f8] pt-3">
                  <span className="text-xs font-bold text-[#4b6578]">
                    {review.packageBooked}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      onPlanSimilar({
                        packageName: review.packageBooked,
                        guests: review.tripType === "Solo Trip" ? 1 : review.tripType === "Group Trip" ? 6 : 2,
                        totalPrice: review.tripType === "Solo Trip" ? 6000 : undefined,
                      })
                    }
                    className="cursor-pointer border-none bg-transparent text-[13px] font-extrabold text-[#062847] underline hover:text-[#154c79]"
                  >
                    Plan Similar →
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
