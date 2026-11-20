import { BookingFormValues, BookingFormErrors } from "@/types";

/**
 * Real-time & submit field validation matching BookingModal & POST /api/enquiry
 */
export function validateBookingField(
  field: string,
  rawValue: unknown,
  todayStr: string,
  allValues: Partial<BookingFormValues> = {}
): string {
  const val = String(rawValue ?? "").trim();

  switch (field) {
    case "name": {
      if (!val) return "Full name likhna zaroori hai.";
      if (val.length < 2) return "Name kam se kam 2 characters ka hona chahiye.";
      if (val.length > 80) return "Name 80 characters se chota hona chahiye.";
      if (!/^[a-zA-Z\s.'-]+$/.test(val)) {
        return "Name mein sirf alphabets aur spaces use karein.";
      }
      return "";
    }

    case "phone": {
      if (!val) return "Mobile ya WhatsApp number enter karein.";
      const digitsOnly = val.replace(/\D/g, "");
      if (digitsOnly.length > 15) return "Invalid phone number length.";
      const tenDigit =
        digitsOnly.length === 12 && digitsOnly.startsWith("91")
          ? digitsOnly.slice(2)
          : digitsOnly.length === 11 && digitsOnly.startsWith("0")
          ? digitsOnly.slice(1)
          : digitsOnly;

      if (!/^[6-9]\d{9}$/.test(tenDigit)) {
        return "Valid 10-digit Indian mobile number enter karein (e.g., 9876543210).";
      }
      return "";
    }

    case "email": {
      // Optional field, validate only if provided
      if (!val) return "";
      if (val.length > 100) return "Email address bohot lamba hai (max 100 chars).";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        return "Valid email address enter karein (e.g., rohan@example.com).";
      }
      return "";
    }

    case "startDate": {
      if (!val) return "Trip starting date select karein.";
      if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return "Invalid date format.";
      if (val < todayStr) return "Starting date aaj ya future ki honi chahiye.";
      return "";
    }

    case "endDate": {
      if (!val) return "Trip ending date select karein.";
      if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return "Invalid date format.";
      if (allValues.startDate && val <= allValues.startDate) {
        return "Ending date, starting date ke baad ki honi chahiye.";
      }
      return "";
    }

    case "guests": {
      const num = Number(val);
      if (!val || Number.isNaN(num) || !Number.isInteger(num)) {
        return "Guests ki valid sankhya enter karein.";
      }
      if (num < 1 || num > 30) {
        return "Guests 1 se 30 ke beech hone chahiye.";
      }
      return "";
    }

    case "pickup": {
      if (!val) return "Delhi boarding point ya cab select karein.";
      if (val.length > 120) return "Pickup location bohot lambi hai.";
      return "";
    }

    default:
      return "";
  }
}

/**
 * Strips HTML tags, null bytes, and non-printable control characters.
 * Enforces maximum character length to prevent buffer or memory abuse.
 */
export function sanitizePlainText(input: unknown, maxLength = 500): string {
  if (input === null || input === undefined) return "";
  let clean = String(input);
  // Strip control characters & null bytes
  clean = clean.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  // Strip HTML-like tags
  clean = clean.replace(/<[^>]*>?/gm, "");
  return clean.trim().slice(0, maxLength);
}

/**
 * Validates all fields in a form submission
 */
export function validateAllBookingFields(
  values: BookingFormValues,
  todayStr: string
): BookingFormErrors {
  const errors: BookingFormErrors = {};
  (Object.keys(values) as (keyof BookingFormValues)[]).forEach((key) => {
    const errorMsg = validateBookingField(key, values[key], todayStr, values);
    if (errorMsg) {
      errors[key] = errorMsg;
    }
  });
  return errors;
}

/**
 * Normalizes Indian 10-digit phone number
 */
export function normalizeIndianPhone(raw: string): string {
  const digitsOnly = raw.replace(/\D/g, "");
  if (digitsOnly.length === 12 && digitsOnly.startsWith("91")) {
    return digitsOnly.slice(2);
  }
  if (digitsOnly.length === 11 && digitsOnly.startsWith("0")) {
    return digitsOnly.slice(1);
  }
  return digitsOnly;
}
