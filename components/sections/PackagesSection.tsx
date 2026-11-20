"use client";

import React, { useState } from "react";
import { PACKAGES } from "@/data/packages";
import { BookingContext } from "@/types";
import { buildWhatsAppBookingUrl } from "@/lib/whatsapp";

interface PackagesSectionProps {
  onSelectPackage: (ctx: BookingContext) => void;
}

export function PackagesSection({ onSelectPackage }: PackagesSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Solo Trip",
    "Couple Getaway",
  ];

  const filteredPackages =
    selectedCategory === "All"
      ? PACKAGES
      : PACKAGES.filter((pkg) => pkg.category === selectedCategory);

  return (
    <section id="packages" className="py-16">
      <div className="mx-auto w-[90%] max-w-[1180px]">
        <div className="mb-9 text-center">
          <div className="mb-2 inline-block rounded-xl bg-[#e4f1fa] px-3 py-1 text-xs font-black uppercase text-[#062847]">
            14-Seater Luxury Tempo Traveller Packages
          </div>
          <h2 className="mb-2 text-[32px] font-extrabold text-[#062847]">
            Delhi to Manali Fixed Packages
          </h2>
          <p className="text-[#4b6578]">
            Solo backpackers (₹6,000 / person) aur Couples (₹11,000 / couple) ke liye complete 4-day packages
          </p>
        </div>

        {/* Filter Chips */}
        <div className="mb-8 flex flex-wrap justify-center gap-2.5">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`filter-chip ${
                selectedCategory === category ? "active" : ""
              }`}
            >
              {category === "All"
                ? "All Packages (2)"
                : category === "Solo Trip"
                ? "🎒 Solo Trip (₹6,000 / person)"
                : "💑 Couple Getaway (₹11,000 / couple)"}
            </button>
          ))}
        </div>

        {/* Package Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          {filteredPackages.map((pkg) => {
            const isSolo = pkg.category === "Solo Trip";
            const effectivePrice = isSolo
              ? pkg.numericSoloPrice || 6000
              : pkg.numericCouplePrice;

            const waHref = buildWhatsAppBookingUrl({
              packageName: `${pkg.title} (${pkg.duration})`,
              tripType: isSolo ? "Solo Traveler" : "Couple",
              guests: isSolo ? 1 : 2,
              totalPrice: effectivePrice,
            });

            return (
              <article
                key={pkg.id}
                className={`flex flex-col justify-between rounded-2xl border bg-white p-6 shadow-[0_8px_24px_rgba(23,50,70,0.08)] transition-transform duration-200 hover:-translate-y-1 ${
                  isSolo ? "border-[#25d366] ring-2 ring-[#25d366]/20" : "border-[#e1eef6]"
                }`}
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <span className={`inline-block rounded-xl px-2.5 py-1 text-xs font-black uppercase ${
                      isSolo ? "bg-[#dcfce7] text-[#166534]" : "bg-[#e4f1fa] text-[#062847]"
                    }`}>
                      {pkg.category} • {pkg.duration}
                    </span>
                    {isSolo && (
                      <span className="rounded-full bg-[#ffd45a] px-2 py-0.5 text-[11px] font-black text-[#102c41]">
                        Special ₹6,000 Offer
                      </span>
                    )}
                  </div>

                  <h3 className="mb-2 text-[21px] font-bold text-[#062847]">
                    {pkg.title}
                  </h3>

                  <ul className="my-4 ml-5 list-disc space-y-1.5 text-[15px] text-[#4b6578]">
                    {pkg.highlights.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2.5 border-t border-[#ebf3f8] pt-4">
                    <div>
                      <div className="text-[22px] font-black text-[#062847]">
                        {pkg.price}{" "}
                        <small className="text-[13px] font-normal text-[#4b6578]">
                          {pkg.priceLabel || "/ couple"}
                        </small>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        onSelectPackage({
                          packageName: `${pkg.title} (${pkg.duration})`,
                          guests: isSolo ? 1 : 2,
                          totalPrice: effectivePrice,
                        })
                      }
                      className="btn-gold cursor-pointer"
                    >
                      {isSolo ? "Book Solo (₹6,000)" : "Book Couple (₹11,000)"}
                    </button>
                  </div>

                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-whatsapp mt-2.5 !py-2.5 !text-[14px]"
                  >
                    Book on WhatsApp
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
