"use client";

import { useState, useEffect, useCallback } from "react";
import { ActiveTripBatch } from "@/types";
import { loadActiveTripBatch, saveActiveTripBatch } from "@/lib/storage";
import { getThisWeekendDates, addDaysToDateString, calculateTripNights } from "@/lib/date-utils";

export function getDefaultBatch(): ActiveTripBatch {
  const { start, end } = getThisWeekendDates();
  return {
    startDate: start,
    endDate: end,
    nights: 3,
    title: "Manali Fixed Departure Batch",
    seatsLeft: 8,
    isActive: true,
    updatedAt: new Date().toISOString(),
  };
}

export function useTripBatch() {
  const [activeBatch, setActiveBatch] = useState<ActiveTripBatch>(() => {
    // Return standard batch as initial state
    return {
      startDate: "2026-11-20",
      endDate: "2026-11-23",
      nights: 3,
      title: "Manali Fixed Departure Batch",
      seatsLeft: 8,
      isActive: true,
      updatedAt: "2026-11-18T00:00:00.000Z",
    };
  });
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on client mount
  useEffect(() => {
    const stored = loadActiveTripBatch();
    if (stored) {
      setActiveBatch(stored);
    } else {
      const defaultBatch = getDefaultBatch();
      setActiveBatch(defaultBatch);
      saveActiveTripBatch(defaultBatch);
    }
    setIsLoaded(true);
  }, []);

  const updateActiveBatch = useCallback((updates: Partial<ActiveTripBatch>) => {
    setActiveBatch((prev) => {
      const nextStart = updates.startDate ?? prev.startDate;
      const nextEnd = updates.endDate ?? (prev.endDate || addDaysToDateString(nextStart, 3));
      const computedNights = calculateTripNights(nextStart, nextEnd);

      const next: ActiveTripBatch = {
        ...prev,
        ...updates,
        startDate: nextStart,
        endDate: nextEnd,
        nights: updates.nights ?? computedNights,
        updatedAt: new Date().toISOString(),
      };
      saveActiveTripBatch(next);
      return next;
    });
  }, []);

  const toggleBatchActive = useCallback(() => {
    setActiveBatch((prev) => {
      const next: ActiveTripBatch = {
        ...prev,
        isActive: !prev.isActive,
        updatedAt: new Date().toISOString(),
      };
      saveActiveTripBatch(next);
      return next;
    });
  }, []);

  return {
    activeBatch,
    isLoaded,
    updateActiveBatch,
    toggleBatchActive,
  };
}
