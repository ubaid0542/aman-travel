"use client";

import React, { useState } from "react";
import { BookingContext } from "@/types";
import { useLeads } from "@/hooks/useLeads";
import { useTripBatch } from "@/hooks/useTripBatch";
import { TopBatchBanner } from "@/components/layout/TopBatchBanner";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsAppButton } from "@/components/layout/FloatingWhatsAppButton";
import { Hero } from "@/components/sections/Hero";
import { PackagesSection } from "@/components/sections/PackagesSection";
import { DestinationGallery } from "@/components/sections/DestinationGallery";
import { PriceCalculator } from "@/components/sections/PriceCalculator";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { ItinerarySection } from "@/components/sections/ItinerarySection";
import { BookingModal } from "@/components/booking/BookingModal";
import { SavedLeadsDrawer } from "@/components/leads/SavedLeadsDrawer";

export default function HomePage() {
  const [bookingContext, setBookingContext] = useState<BookingContext | null>(null);
  const [leadsDrawerOpen, setLeadsDrawerOpen] = useState(false);
  const [adminDrawerTab, setAdminDrawerTab] = useState<"leads" | "schedule">("leads");

  const {
    savedLeads,
    handleSaveEnquiry,
    handleUpdateLeadDates,
    handleUpdateLeadNotes,
    handleToggleLeadStatus,
    handleDeleteLead,
    handleClearAllLeads,
  } = useLeads();

  const {
    activeBatch,
    updateActiveBatch,
    toggleBatchActive,
  } = useTripBatch();

  const handleOpenAdmin = (tab: "leads" | "schedule" = "leads") => {
    setAdminDrawerTab(tab);
    setLeadsDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f4f9fc] font-sans text-[#173246] antialiased">
      {/* High-Visibility Departure Batch Top Banner */}
      <TopBatchBanner
        activeBatch={activeBatch}
        onOpenBooking={(ctx) => setBookingContext(ctx)}
        onOpenAdminSchedule={() => handleOpenAdmin("schedule")}
      />

      <Navbar
        onOpenBooking={(ctx) => setBookingContext(ctx)}
        leadsCount={savedLeads.length}
        onOpenLeadsDrawer={() => handleOpenAdmin("leads")}
      />

      <main>
        <Hero
          onOpenBooking={(ctx) => setBookingContext(ctx)}
          activeBatch={activeBatch}
        />
        <PackagesSection onSelectPackage={(ctx) => setBookingContext(ctx)} />
        <DestinationGallery onBookSpot={(ctx) => setBookingContext(ctx)} />
        <PriceCalculator onOpenCallback={(ctx) => setBookingContext(ctx)} />
        <TestimonialsSection onPlanSimilar={(ctx) => setBookingContext(ctx)} />
        <ItinerarySection
          onCustomizeItinerary={(ctx) => setBookingContext(ctx)}
        />
      </main>

      <Footer />

      <FloatingWhatsAppButton />

      <BookingModal
        bookingContext={bookingContext}
        onClose={() => setBookingContext(null)}
        onSaveEnquiry={handleSaveEnquiry}
        onOpenLeadsDrawer={() => handleOpenAdmin("leads")}
      />

      <SavedLeadsDrawer
        isOpen={leadsDrawerOpen}
        onClose={() => setLeadsDrawerOpen(false)}
        leads={savedLeads}
        onUpdateLeadDates={handleUpdateLeadDates}
        onUpdateLeadNotes={handleUpdateLeadNotes}
        onToggleLeadStatus={handleToggleLeadStatus}
        onDeleteLead={handleDeleteLead}
        onClearAllLeads={handleClearAllLeads}
        activeBatch={activeBatch}
        onUpdateBatch={updateActiveBatch}
        onToggleBatchActive={toggleBatchActive}
        initialTab={adminDrawerTab}
      />
    </div>
  );
}
