import {
  STORAGE_KEY,
  BATCH_STORAGE_KEY,
  ADMIN_LEADS_PASSWORD,
  ADMIN_SESSION_STORAGE_KEY,
} from "@/data/constants";
import { LeadRecord, ActiveTripBatch } from "@/types";

/**
 * Safely loads stored enquiries from localStorage (SSR-safe).
 */
export function loadStoredLeads(): LeadRecord[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed as LeadRecord[];
      }
    }
  } catch {
    // Ignore storage read errors in restricted iframe sandboxes
  }
  return null;
}

/**
 * Safely saves enquiries to localStorage (SSR-safe).
 */
export function saveStoredLeads(leads: LeadRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch {
    // Ignore storage write errors in restricted iframe sandboxes
  }
}

/**
 * Safely loads the active departure trip batch from localStorage (SSR-safe).
 */
export function loadActiveTripBatch(): ActiveTripBatch | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(BATCH_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.startDate === "string" && typeof parsed.endDate === "string") {
        return parsed as ActiveTripBatch;
      }
    }
  } catch {
    // Ignore storage read errors
  }
  return null;
}

/**
 * Safely saves the active departure trip batch to localStorage (SSR-safe).
 */
export function saveActiveTripBatch(batch: ActiveTripBatch): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BATCH_STORAGE_KEY, JSON.stringify(batch));
  } catch {
    // Ignore storage write errors
  }
}

/**
 * Loads current admin password (standard fixed master password).
 */
export function getStoredAdminPassword(): string {
  return ADMIN_LEADS_PASSWORD;
}

/**
 * Saves a new custom admin password (deprecated - master password fixed).
 */
export function saveStoredAdminPassword(_password: string): void {
  // Deprecated: Password changes disabled per site policy
}

/**
 * Checks if admin session is currently authenticated in this browser.
 */
export function isAdminSessionActive(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * Sets admin authenticated session status.
 */
export function setAdminSessionActive(active: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (active) {
      window.sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, "true");
    } else {
      window.sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
    }
  } catch {
    // Ignore storage error
  }
}
