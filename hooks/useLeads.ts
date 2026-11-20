"use client";

import { useState, useEffect, useCallback } from "react";
import { LeadRecord } from "@/types";
import { getInitialSampleLeads } from "@/data/sample-leads";
import { loadStoredLeads, saveStoredLeads } from "@/lib/storage";

export function useLeads() {
  const [savedLeads, setSavedLeads] = useState<LeadRecord[]>(() => getInitialSampleLeads());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on client mount
  useEffect(() => {
    const stored = loadStoredLeads();
    if (stored) {
      setSavedLeads(stored);
    }
    setIsLoaded(true);
  }, []);

  const persistLeads = useCallback((nextLeads: LeadRecord[]) => {
    setSavedLeads(nextLeads);
    saveStoredLeads(nextLeads);
  }, []);

  const handleSaveEnquiry = useCallback((record: LeadRecord) => {
    setSavedLeads((prev) => {
      const next = [record, ...prev];
      saveStoredLeads(next);
      return next;
    });
  }, []);

  const handleUpdateLeadDates = useCallback((leadId: string, updates: Partial<LeadRecord>) => {
    setSavedLeads((prev) => {
      const updated = prev.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : lead
      );
      saveStoredLeads(updated);
      return updated;
    });
  }, []);

  const handleUpdateLeadNotes = useCallback((leadId: string, adminNotes: string) => {
    setSavedLeads((prev) => {
      const updated = prev.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              adminNotes,
              updatedAt: new Date().toISOString(),
            }
          : lead
      );
      saveStoredLeads(updated);
      return updated;
    });
  }, []);

  const handleToggleLeadStatus = useCallback((leadId: string) => {
    setSavedLeads((prev) => {
      const updated = prev.map((lead) =>
        lead.id === leadId
          ? {
              ...lead,
              status: (lead.status === "PENDING_CALLBACK"
                ? "CONTACTED"
                : "PENDING_CALLBACK") as "PENDING_CALLBACK" | "CONTACTED",
              updatedAt: new Date().toISOString(),
            }
          : lead
      );
      saveStoredLeads(updated);
      return updated;
    });
  }, []);

  const handleDeleteLead = useCallback((leadId: string) => {
    setSavedLeads((prev) => {
      const updated = prev.filter((lead) => lead.id !== leadId);
      saveStoredLeads(updated);
      return updated;
    });
  }, []);

  const handleClearAllLeads = useCallback(() => {
    persistLeads([]);
  }, [persistLeads]);

  return {
    savedLeads,
    isLoaded,
    handleSaveEnquiry,
    handleUpdateLeadDates,
    handleUpdateLeadNotes,
    handleToggleLeadStatus,
    handleDeleteLead,
    handleClearAllLeads,
  };
}
