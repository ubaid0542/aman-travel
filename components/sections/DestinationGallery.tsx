"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { GALLERY_SPOTS } from "@/data/gallery";
import { BookingContext } from "@/types";
import { DestinationArtwork } from "@/components/ui/DestinationArtwork";

interface DestinationGalleryProps {
  onBookSpot: (ctx: BookingContext) => void;
}

export function DestinationGallery({ onBookSpot }: DestinationGalleryProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"slider" | "grid">("slider");
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  // Touch Swipe State for Mobile
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const thumbnailStripRef = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);

  const categories = [
    "All",
    "Snow & Peaks",
    "Waterfalls & Nature",
    "Kasol & Adventure",
    "Culture & Stays",
  ];

  const filteredSpots =
    activeCategory === "All"
      ? GALLERY_SPOTS
      : GALLERY_SPOTS.filter((spot) => spot.category === activeCategory);

  // Reset index when category changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredSpots.length);
  }, [filteredSpots.length]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? filteredSpots.length - 1 : prev - 1
    );
  }, [filteredSpots.length]);

  // Autoplay functionality (gentle 5s rotation, pauses on hover/interaction)
  useEffect(() => {
    if (!isAutoPlay || lightboxIndex !== null || viewMode !== "slider") return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlay, lightboxIndex, viewMode, handleNext]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex !== null) {
        if (e.key === "Escape") setLightboxIndex(null);
        if (e.key === "ArrowRight") {
          setLightboxIndex((prev) =>
            prev === null ? null : (prev + 1) % filteredSpots.length
          );
        }
        if (e.key === "ArrowLeft") {
          setLightboxIndex((prev) =>
            prev === null
              ? null
              : (prev - 1 + filteredSpots.length) % filteredSpots.length
          );
        }
      } else if (viewMode === "slider") {
        if (e.key === "ArrowRight") handleNext();
        if (e.key === "ArrowLeft") handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, viewMode, filteredSpots.length, handleNext, handlePrev]);

  // Scroll active thumbnail horizontally inside the filmstrip ONLY when user changes slides (never on initial load, never scrolls window)
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    const strip = thumbnailStripRef.current;
    if (!strip) return;
    const activeThumb = strip.children[currentIndex] as HTMLElement | undefined;
    if (!activeThumb) return;

    const stripWidth = strip.clientWidth;
    const thumbLeft = activeThumb.offsetLeft;
    const thumbWidth = activeThumb.clientWidth;
    const targetScrollLeft = thumbLeft - stripWidth / 2 + thumbWidth / 2;

    strip.scrollLeft = Math.max(0, targetScrollLeft);
  }, [currentIndex]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsAutoPlay(false);
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const minSwipeDistance = 45;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const activeSpot =
    lightboxIndex !== null ? filteredSpots[lightboxIndex] : null;

  return (
    <section
      id="gallery"
      className="relative overflow-hidden py-14 sm:py-16 w-full max-w-full"
      style={{ contain: "paint" }}
    >
      {/* Background ambient mountain glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[400px] w-[90vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-20 blur-3xl overflow-hidden"
        style={{
          background:
            "radial-gradient(circle, rgba(255,212,90,0.3) 0%, rgba(6,40,71,0.4) 60%, transparent 100%)",
        }}
      />

      <div className="mx-auto w-[92%] max-w-[1200px]">
        {/* Section Header */}
        <div className="mb-7 flex flex-col items-center justify-between gap-4 text-center sm:mb-9 sm:flex-row sm:text-left">
          <div>
            <div className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-[#e4f1fa] px-3 py-0.5 text-xs font-black uppercase tracking-wider text-[#062847]">
              <span>✨ Cinematic Experience</span>
              <span className="hidden sm:inline">•</span>
              <span className="hidden text-[#4b6578] sm:inline">
                Layered Mountain Moments
              </span>
            </div>
            <h2 className="text-[28px] font-extrabold text-[#062847] sm:text-[34px]">
              Manali Destination Gallery
            </h2>
            <p className="text-sm text-[#4b6578] sm:text-base">
              Snow peaks, boutique stays, aur scenic valleys ki layered cinematic
              glimpse
            </p>
          </div>

          {/* View Mode Switcher Toggle */}
          <div className="flex items-center gap-1 rounded-full border border-[#c3d8e6] bg-white p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode("slider")}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                viewMode === "slider"
                  ? "bg-[#062847] text-[#ffd45a] shadow-xs"
                  : "text-[#4b6578] hover:text-[#062847]"
              }`}
              title="Cinematic Layered Slider"
            >
              <span>🎞️</span>
              <span>Cinematic Slider</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                viewMode === "grid"
                  ? "bg-[#062847] text-[#ffd45a] shadow-xs"
                  : "text-[#4b6578] hover:text-[#062847]"
              }`}
              title="Classic Photo Grid"
            >
              <span>▦</span>
              <span>Grid View</span>
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="mb-8 flex flex-wrap justify-center gap-2 sm:justify-start">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setActiveCategory(category);
                setLightboxIndex(null);
              }}
              className={`filter-chip text-xs sm:text-sm ${
                activeCategory === category ? "active" : ""
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* ============================================================== */}
        {/* CREATIVE EFFECT: LAYERED CINEMATIC SLIDER (MOBILE RESPONSIVE) */}
        {/* ============================================================== */}
        {viewMode === "slider" ? (
          <div
            className="relative flex flex-col items-center"
            onMouseEnter={() => setIsAutoPlay(false)}
            onMouseLeave={() => setIsAutoPlay(true)}
          >
            {/* 3D Perspective Stage Container with Strict Overflow Clip */}
            <div
              className="relative flex h-[380px] w-full max-w-[1040px] items-center justify-center overflow-hidden sm:h-[480px]"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                perspective: "1200px",
                overflow: "clip",
                contain: "paint",
              }}
            >
              {filteredSpots.map((spot, idx) => {
                const count = filteredSpots.length;
                let offset = idx - currentIndex;
                // Circular wrapping calculation
                if (offset < -Math.floor(count / 2)) offset += count;
                if (offset > Math.floor(count / 2)) offset -= count;

                const isCenter = offset === 0;
                const isLeft = offset === -1;
                const isRight = offset === 1;
                const isVisible = Math.abs(offset) <= 1;

                if (!isVisible) return null;

                // Responsive translation and 3D depth styles (contained strictly on mobile)
                let translateX = 0;
                let scale = 1;
                let opacity = 0;
                let zIndex = 10;
                let rotateY = 0;

                if (isCenter) {
                  translateX = 0;
                  scale = 1;
                  opacity = 1;
                  zIndex = 30;
                  rotateY = 0;
                } else if (isLeft) {
                  translateX = -55; // Percent of card width, keeps inside screen on mobile
                  scale = 0.85;
                  opacity = 0.55;
                  zIndex = 20;
                  rotateY = 8;
                } else if (isRight) {
                  translateX = 55;
                  scale = 0.85;
                  opacity = 0.55;
                  zIndex = 20;
                  rotateY = -8;
                }

                return (
                  <div
                    key={spot.id}
                    onClick={() => {
                      if (isCenter) {
                        setLightboxIndex(idx);
                      } else {
                        setCurrentIndex(idx);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${spot.title}`}
                    className={`absolute top-0 h-[360px] w-[86%] max-w-[540px] cursor-pointer select-none overflow-hidden rounded-[20px] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform sm:h-[450px] sm:w-[72%] ${
                      isCenter
                        ? "shadow-[0_24px_60px_rgba(4,31,61,0.45)] ring-2 ring-[#ffd45a]/70"
                        : "shadow-[0_12px_30px_rgba(4,31,61,0.2)] hover:opacity-80"
                    }`}
                    style={{
                      transform: `translate3d(${translateX}%, 0, ${
                        isCenter ? 0 : -80
                      }px) scale(${scale}) rotateY(${rotateY}deg)`,
                      opacity,
                      zIndex,
                    }}
                  >
                    {/* Background Photo */}
                    <div className="relative h-full w-full overflow-hidden bg-[#062847]">
                      {spot.image ? (
                        <img
                          src={encodeURI(spot.image)}
                          alt={spot.title}
                          loading={isCenter ? "eager" : "lazy"}
                          className={`h-full w-full object-cover transition-transform duration-700 ease-out ${
                            isCenter ? "hover:scale-106" : ""
                          }`}
                        />
                      ) : (
                        <div className="h-full w-full">
                          <DestinationArtwork
                            variant={spot.artVariant || "solang"}
                          />
                        </div>
                      )}

                      {/* Layered Vignette / Gradient Overlay */}
                      <div
                        className="absolute inset-0 flex flex-col justify-between p-5 text-white transition-opacity duration-300 sm:p-7"
                        style={{
                          background: isCenter
                            ? "linear-gradient(180deg, rgba(3,21,39,0.15) 0%, rgba(3,21,39,0.3) 45%, rgba(3,21,39,0.92) 100%)"
                            : "linear-gradient(180deg, rgba(3,21,39,0.5) 0%, rgba(3,21,39,0.85) 100%)",
                        }}
                      >
                        {/* Top Metadata Badges */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="rounded-full bg-[#ffd45a] px-3 py-1 text-xs font-black uppercase text-[#102c41] shadow-xs">
                            {spot.category}
                          </span>

                          {isCenter && (
                            <span className="flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                              <span>🔍 Tap to Expand</span>
                            </span>
                          )}
                        </div>

                        {/* Bottom Cinematic Details (Prominent on Active Slide) */}
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-xs font-semibold text-[#ffd45a]">
                            <span>📍 {spot.location}</span>
                            <span>•</span>
                            <span>{spot.bestTime}</span>
                          </div>

                          <h3 className="text-xl font-extrabold leading-tight text-white drop-shadow-md sm:text-2xl">
                            {spot.title}
                          </h3>

                          {isCenter && (
                            <p className="line-clamp-2 text-xs text-[#d6e6f2] sm:text-sm">
                              {spot.caption}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Prev Slide Navigation Chevron */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous image"
                className="absolute left-2 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-[#062847]/75 text-2xl font-bold text-white shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:bg-[#062847] active:scale-95 sm:left-4 sm:h-12 sm:w-12"
              >
                ‹
              </button>

              {/* Next Slide Navigation Chevron */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next image"
                className="absolute right-2 top-1/2 z-40 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/25 bg-[#062847]/75 text-2xl font-bold text-white shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:bg-[#062847] active:scale-95 sm:right-4 sm:h-12 sm:w-12"
              >
                ›
              </button>
            </div>

            {/* Slider Pagination Controls & Mobile Swipe Hint */}
            <div className="mt-4 flex w-full max-w-[640px] flex-col items-center gap-3">
              {/* Pagination Dots */}
              <div className="flex items-center gap-1.5">
                {filteredSpots.map((spot, idx) => (
                  <button
                    key={spot.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      currentIndex === idx
                        ? "w-7 bg-[#ffd45a]"
                        : "w-2 bg-[#c3d8e6] hover:bg-[#062847]/40"
                    }`}
                  />
                ))}
              </div>

              {/* Mobile Swipe Guidance Note */}
              <div className="flex items-center justify-between text-xs text-[#4b6578]">
                <span>
                  Photo <strong>{currentIndex + 1}</strong> of{" "}
                  <strong>{filteredSpots.length}</strong>
                </span>
                <span className="hidden sm:inline">
                  • Use arrow keys or click sides to navigate
                </span>
                <span className="sm:hidden">• Swipe left/right smoothly</span>
              </div>

              {/* Horizontal Filmstrip Thumbnail Ribbon */}
              <div
                ref={thumbnailStripRef}
                className="mt-2 flex w-full gap-2.5 overflow-x-auto pb-2 scrollbar-none"
                style={{ scrollbarWidth: "none" }}
              >
                {filteredSpots.map((spot, idx) => {
                  const isSelected = currentIndex === idx;
                  return (
                    <button
                      key={spot.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      aria-label={`Thumbnail ${spot.title}`}
                      className={`relative h-14 w-20 flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 transition-all duration-300 sm:h-16 sm:w-24 ${
                        isSelected
                          ? "border-[#ffd45a] shadow-md ring-2 ring-[#ffd45a]/50 scale-105"
                          : "border-transparent opacity-60 hover:opacity-90"
                      }`}
                    >
                      {spot.image ? (
                        <img
                          src={encodeURI(spot.image)}
                          alt={spot.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-[#062847]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* CLASSIC GRID VIEW MODE (OPTIONAL SWITCH)                       */
          /* ============================================================== */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredSpots.map((spot, idx) => (
              <div
                key={spot.id}
                role="button"
                tabIndex={0}
                onClick={() => setLightboxIndex(idx)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setLightboxIndex(idx);
                  }
                }}
                className="group relative h-[250px] cursor-pointer overflow-hidden rounded-2xl bg-[#062847] shadow-[0_8px_22px_rgba(6,40,71,0.12)] focus:outline-none focus:ring-2 focus:ring-[#ffd45a]"
              >
                <div className="h-full w-full overflow-hidden">
                  {spot.image ? (
                    <img
                      src={encodeURI(spot.image)}
                      alt={spot.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                    />
                  ) : (
                    <div className="h-full w-full transition-transform duration-500 group-hover:scale-105">
                      <DestinationArtwork
                        variant={spot.artVariant || "solang"}
                      />
                    </div>
                  )}
                </div>

                <div
                  className="absolute inset-0 flex flex-col justify-end p-5 text-white"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(4, 31, 61, 0.05) 35%, rgba(4, 31, 61, 0.88) 100%)",
                  }}
                >
                  <span className="mb-2 self-start rounded-xl bg-[#ffd45a] px-2.5 py-0.5 text-[11px] font-extrabold text-[#102c41]">
                    {spot.category}
                  </span>
                  <h3 className="mb-0.5 text-[19px] font-bold leading-snug">
                    {spot.title}
                  </h3>
                  <p className="text-[13px] text-[#d6e6f2]">{spot.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* FULLSCREEN CINEMATIC LIGHTBOX MODAL                            */}
      {/* ============================================================== */}
      {activeSpot && lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#041f3d]/85 p-3 backdrop-blur-sm sm:p-4"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative w-full max-w-[720px] overflow-hidden rounded-[20px] bg-white shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Cross Button */}
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close gallery preview"
              className="absolute right-3.5 top-3.5 z-20 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-[#062847]/85 text-xl text-white transition-all hover:scale-105 hover:bg-[#062847]"
            >
              ×
            </button>

            {/* Modal Image Display */}
            <div className="relative h-[320px] overflow-hidden bg-[#062847] sm:h-[420px]">
              {activeSpot.image ? (
                <img
                  src={encodeURI(activeSpot.image)}
                  alt={activeSpot.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <DestinationArtwork
                  variant={activeSpot.artVariant || "solang"}
                />
              )}

              {/* Prev in Modal */}
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex(
                    (lightboxIndex - 1 + filteredSpots.length) %
                      filteredSpots.length
                  )
                }
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#062847]/80 text-2xl text-white backdrop-blur-xs hover:bg-[#062847]"
              >
                ‹
              </button>

              {/* Next in Modal */}
              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((lightboxIndex + 1) % filteredSpots.length)
                }
                aria-label="Next photo"
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#062847]/80 text-2xl text-white backdrop-blur-xs hover:bg-[#062847]"
              >
                ›
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-6">
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <span className="rounded-full bg-[#e4f1fa] px-3 py-1 text-xs font-black uppercase text-[#062847]">
                  {activeSpot.category}
                </span>
                <span className="text-xs font-bold text-[#4b6578]">
                  Best Time: {activeSpot.bestTime}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-[#062847]">
                {activeSpot.title}
              </h3>
              <p className="mb-4 mt-2 text-sm leading-relaxed text-[#4b6578]">
                {activeSpot.caption}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#ebf3f8] pt-3.5">
                <span className="text-xs font-semibold text-[#4b6578]">
                  Spot {lightboxIndex + 1} of {filteredSpots.length}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const pkg = activeSpot.recommendedPackage;
                    setLightboxIndex(null);
                    onBookSpot({ packageName: pkg, guests: 2 });
                  }}
                  className="btn-gold cursor-pointer"
                >
                  Include in My Trip →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
