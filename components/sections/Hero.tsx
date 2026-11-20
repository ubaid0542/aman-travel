import React from "react";
import { BookingContext, ActiveTripBatch } from "@/types";
import { formatDateWithDay } from "@/lib/date-utils";

interface HeroProps {
  onOpenBooking: (ctx: BookingContext) => void;
  activeBatch?: ActiveTripBatch;
}

export function Hero({ onOpenBooking, activeBatch }: HeroProps) {
  const hasActiveBatch = activeBatch && activeBatch.isActive;

  return (
    <section className="relative flex min-h-[560px] items-center overflow-hidden bg-[#041f3d] px-[6%] py-16 text-white sm:py-20">
      {/* Custom Self-Contained Himalayan Mountain Panorama Backdrop */}
      <svg
        viewBox="0 0 1440 600"
        preserveAspectRatio="xMidYMid slice"
        className="pointer-events-none absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="heroSkyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#041f3d" />
            <stop offset="55%" stopColor="#0b3b66" />
            <stop offset="100%" stopColor="#1e6496" />
          </linearGradient>
          <linearGradient id="heroPeakSnow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#b5d6ee" />
          </linearGradient>
        </defs>
        <rect width="1440" height="600" fill="url(#heroSkyGrad)" />
        {/* Alpine Moon / Sun Glow */}
        <circle cx="1160" cy="135" r="58" fill="#ffd45a" opacity="0.88" />
        <circle cx="1160" cy="135" r="115" fill="#ffd45a" opacity="0.16" />
        {/* Majestic Himalayan Ridge */}
        <polygon points="520,600 840,145 1130,520" fill="#174d7a" />
        <polygon
          points="840,145 935,275 880,295 835,255 785,295 740,265"
          fill="url(#heroPeakSnow)"
        />
        <polygon points="780,600 1120,105 1460,550" fill="#1e5c8f" />
        <polygon
          points="1120,105 1235,265 1170,285 1120,240 1065,285 1015,250"
          fill="url(#heroPeakSnow)"
        />
        <polygon points="0,600 320,255 680,600" fill="#0e3a61" />
        <polygon
          points="320,255 395,335 350,350 315,320 275,345"
          fill="#d9ecfa"
          opacity="0.7"
        />
        {/* Pine Forest Foreground */}
        <path
          d="M0,475 Q480,415 960,475 T1440,455 L1440,600 L0,600 Z"
          fill="#062847"
        />
      </svg>

      {/* Dark Navy Linear Gradient Overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(4, 31, 61, 0.92) 0%, rgba(4, 31, 61, 0.72) 55%, rgba(4, 31, 61, 0.45) 100%)",
        }}
      />

      <div className="relative z-10 max-w-[760px]">
        {/* Top Feature Badges */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-block rounded-[20px] border border-[#ffd45a] bg-[#ffd45a]/20 px-3.5 py-1.5 text-[13px] font-bold text-[#ffd45a]">
            Delhi to Manali • Solo &amp; Couple Getaways
          </span>
          <span className="inline-block rounded-[20px] bg-[#25d366]/20 px-3 py-1 text-xs font-black text-[#86efac]">
            🔥 Solo Trips from ₹6,000 / person
          </span>
        </div>

        {/* Prominent Front Highlight for Admin Customized 3-Day Trip Date */}
        {hasActiveBatch && (
          <div className="mb-5 rounded-2xl border-2 border-[#ffd45a] bg-gradient-to-r from-[#062847]/95 to-[#0b3b66]/95 p-4 shadow-[0_10px_25px_rgba(255,212,90,0.18)] backdrop-blur-md">
            <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-[#ef4444] px-2.5 py-0.5 text-[11px] font-black uppercase tracking-wider text-white">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                </span>
                Upcoming Fixed Departure Batch
              </span>
              {activeBatch.seatsLeft !== undefined && activeBatch.seatsLeft > 0 && (
                <span className="rounded-full bg-[#ffd45a]/20 px-2.5 py-0.5 text-xs font-black text-[#ffd45a]">
                  ⚡ Only {activeBatch.seatsLeft} Seats Remaining
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-baseline gap-2 text-white">
              <span className="text-sm font-semibold text-[#c5def1]">Starting from Delhi:</span>
              <span className="text-lg font-black text-[#ffd45a] sm:text-xl">
                {formatDateWithDay(activeBatch.startDate)} → {formatDateWithDay(activeBatch.endDate)}
              </span>
              <span className="rounded-md bg-white/10 px-2 py-0.5 text-xs font-bold text-white">
                {activeBatch.nights} Nights / {activeBatch.nights + 1} Days
              </span>
            </div>

            {activeBatch.title && (
              <p className="mt-1 text-xs text-[#e2eef7]">
                {activeBatch.title} • 14-Seater Luxury Volvo Tempo Traveller from Kashmere Gate ISBT
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  onOpenBooking({
                    packageName: activeBatch.title || "Manali 3-Day Fixed Departure Batch",
                    travelDate: activeBatch.startDate,
                    guests: 1,
                    totalPrice: 6000,
                    batchInfo: activeBatch,
                  })
                }
                className="btn-gold cursor-pointer !py-1.5 !px-3.5 !text-xs"
              >
                Book Solo Seat (₹6,000)
              </button>
              <button
                type="button"
                onClick={() =>
                  onOpenBooking({
                    packageName: activeBatch.title || "Manali Romantic Couple Getaway (3N/4D)",
                    travelDate: activeBatch.startDate,
                    guests: 2,
                    totalPrice: 11000,
                    batchInfo: activeBatch,
                  })
                }
                className="btn-outline cursor-pointer !py-1.5 !px-3.5 !text-xs !text-[#ffd45a] !border-[#ffd45a] hover:!bg-[#ffd45a] hover:!text-[#041f3d]"
              >
                Book Couple Package (₹11,000)
              </button>
            </div>
          </div>
        )}

        <h1 className="mb-4 text-[clamp(32px,5vw,48px)] font-extrabold leading-[1.2] text-white">
          Delhi to Manali: Romantic Snow Peaks &amp; Solo Himalayan Escapes
        </h1>

        <p className="mb-7 text-[17px] leading-[1.65] text-[#e6f0f8]">
          New Delhi (Kashmere Gate ISBT) se luxury 14-Seater Volvo Tempo Traveller transfers,
          valley-view boutique stays, <strong>Solo backpacker seats from ₹6,000/person</strong>,
          Atal Tunnel, Koksar, Sissu snow adventures, Kasol day trip aur group bonfire — 100% transparent pricing ke sath.
        </p>

        <div className="flex flex-wrap gap-3.5">
          <button
            type="button"
            onClick={() =>
              onOpenBooking({
                packageName: "Manali Solo Backpacker & Workation Trail (3N/4D)",
                guests: 1,
                totalPrice: 6000,
                travelDate: hasActiveBatch ? activeBatch.startDate : undefined,
                batchInfo: hasActiveBatch ? activeBatch : undefined,
              })
            }
            className="btn-gold cursor-pointer"
          >
            Book Solo Trip (₹6,000)
          </button>
          <button
            type="button"
            onClick={() =>
              onOpenBooking({
                packageName: "Delhi to Manali Romantic Couple Getaway (3N/4D)",
                guests: 2,
                totalPrice: 11000,
                travelDate: hasActiveBatch ? activeBatch.startDate : undefined,
                batchInfo: hasActiveBatch ? activeBatch : undefined,
              })
            }
            className="btn-outline cursor-pointer"
          >
            Book Couple Package (₹11,000)
          </button>
          <a
            href="#calculator"
            className="flex items-center text-sm font-bold text-[#ffd45a] underline hover:text-white"
          >
            Calculate Live Cost →
          </a>
        </div>
      </div>
    </section>
  );
}
