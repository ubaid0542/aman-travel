/**
 * Generates a random 6-character uppercase hex reference code (e.g., AT-2026-8F3A1C)
 */
export function generateReferenceId(): string {
  const year = new Date().getFullYear();
  const hex = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 16)
      .toString(16)
      .toUpperCase()
  ).join("");
  return `AT-${year}-${hex}`;
}

/**
 * Returns today's local date formatted as YYYY-MM-DD
 */
export function getTodayDateString(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Adds a given number of days to a YYYY-MM-DD date string
 */
export function addDaysToDateString(dateStr: string, days: number): string {
  if (!dateStr) return "";
  const date = new Date(`${dateStr}T00:00:00`);
  date.setDate(date.getDate() + days);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Formats a YYYY-MM-DD date string into a friendly human-readable format: "Thu, 26 Nov 2026"
 */
export function formatDateWithDay(dateStr?: string): string {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return "";
  try {
    const date = new Date(`${dateStr}T00:00:00`);
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Calculates the number of nights between startDate and endDate
 */
export function calculateTripNights(startDate?: string, endDate?: string): number {
  if (!startDate || !endDate || endDate <= startDate) return 1;
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  return Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  );
}

/**
 * Returns upcoming Friday & Monday for "This Weekend" preset
 */
export function getThisWeekendDates(): { start: string; end: string } {
  const today = new Date();
  const day = today.getDay(); // 0 is Sunday, 5 is Friday
  const daysUntilFriday = (5 - day + 7) % 7 || 7;
  const friday = new Date(today);
  friday.setDate(today.getDate() + daysUntilFriday);

  const monday = new Date(friday);
  monday.setDate(friday.getDate() + 3);

  const fmt = (d: Date) => {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  return { start: fmt(friday), end: fmt(monday) };
}
