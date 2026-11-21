"use client";

import React, { useState } from "react";
import { BookingContext } from "@/types";

interface NavbarProps {
  onOpenBooking: (ctx: BookingContext) => void;
  leadsCount: number;
  onOpenLeadsDrawer: () => void;
}

export function Navbar({
  onOpenBooking,
  leadsCount,
  onOpenLeadsDrawer,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Packages", href: "#packages" },
    { label: "Gallery", href: "#gallery" },
    { label: "Price Calculator", href: "#calculator" },
    { label: "Reviews", href: "#reviews" },
    { label: "Itinerary", href: "#itinerary" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#062847] text-white shadow-[0_4px_14px_rgba(6,40,71,0.2)] w-full overflow-hidden">
      <div className="mx-auto flex max-w-[1260px] items-center justify-between gap-2 px-3 py-3 sm:px-[5%] sm:py-4">
        <a
          href="#"
          className="shrink-0 text-lg sm:text-2xl font-black tracking-wider text-white no-underline"
        >
          AMAN <span className="text-[#ffd45a]">TRAVELLER</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-5 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[15px] font-semibold text-[#e2eef7] no-underline transition-colors hover:text-[#ffd45a]"
            >
              {item.label}
            </a>
          ))}

          <button
            type="button"
            onClick={onOpenLeadsDrawer}
            className="flex cursor-pointer items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-xs font-bold text-[#e2eef7] transition-colors hover:border-[#ffd45a] hover:text-[#ffd45a]"
            title="View Password-Protected Saved Leads"
          >
            <svg
              className="h-3.5 w-3.5 text-[#ffd45a]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <span>Saved Leads</span>
            <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ffd45a] px-1.5 text-[11px] font-black text-[#102c41]">
              {leadsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              onOpenBooking({
                packageName:
                  "Delhi to Manali Romantic Couple Getaway (3 Nights / 4 Days)",
                guests: 2,
              })
            }
            className="btn-gold cursor-pointer"
          >
            Book Now
          </button>
        </nav>

        {/* Mobile Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden shrink-0">
          <button
            type="button"
            onClick={onOpenLeadsDrawer}
            className="flex cursor-pointer items-center gap-1 rounded-full border border-white/25 bg-white/10 px-2 py-1 text-xs font-bold text-[#e2eef7]"
            aria-label="Open Saved Leads"
          >
            <span className="hidden sm:inline">Leads</span>
            <span className="inline-flex h-4 min-w-[18px] items-center justify-center rounded-full bg-[#ffd45a] px-1 text-[10px] font-black text-[#102c41]">
              {leadsCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() =>
              onOpenBooking({
                packageName:
                  "Delhi to Manali Romantic Couple Getaway (3 Nights / 4 Days)",
                guests: 2,
              })
            }
            className="btn-gold !px-2.5 !py-1 !text-xs font-bold sm:!px-4 sm:!py-2 sm:!text-sm"
          >
            Book
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="rounded-lg border border-white/25 p-1.5 sm:p-2 text-white hover:bg-white/10"
            aria-label="Toggle Menu"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="border-t border-white/15 bg-[#062847] px-[5%] pb-4 pt-3 lg:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 text-[15px] font-semibold text-[#e2eef7] no-underline hover:text-[#ffd45a]"
              >
                {item.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLeadsDrawer();
              }}
              className="mt-1 flex w-fit items-center gap-2 rounded-full border border-[#ffd45a]/60 bg-white/10 px-4 py-2 text-xs font-bold text-[#ffd45a]"
            >
              <span>View Saved Leads</span>
              <span className="rounded-full bg-[#ffd45a] px-2 py-0.5 text-[#102c41]">
                {leadsCount}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
