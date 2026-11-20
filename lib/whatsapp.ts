import { WHATSAPP_NUMBER } from "@/data/constants";

export interface WhatsAppBookingParams {
  packageName: string;
  referenceId?: string;
  customerName?: string;
  tripType?: string;
  guests?: number;
  rooms?: number;
  stayTier?: string;
  transferMode?: string;
  pickupCity?: string;
  travelDate?: string;
  addons?: string[];
  totalPrice?: number;
  specialRequests?: string;
}

/**
 * Generates a formatted WhatsApp (https://wa.me/) URL with URL-encoded trip details.
 */
export function buildWhatsAppBookingUrl(data: WhatsAppBookingParams): string {
  const lines: string[] = [
    "Namaste *Aman Traveller*! Mujhe *Delhi to Manali* trip book karni hai:",
    "",
    `*Package:* ${data.packageName}`,
  ];

  if (data.referenceId) lines.push(`*Reference ID:* ${data.referenceId}`);
  if (data.customerName) lines.push(`*Name:* ${data.customerName}`);
  if (data.tripType) lines.push(`*Trip Type:* ${data.tripType}`);
  if (data.guests) {
    const roomCount = data.rooms ?? Math.ceil(data.guests / 2);
    lines.push(
      `*Guests:* ${data.guests} (${roomCount} Room${roomCount > 1 ? "s" : ""})`
    );
  }
  if (data.stayTier) lines.push(`*Stay Category:* ${data.stayTier}`);
  if (data.transferMode) lines.push(`*Transfer:* ${data.transferMode}`);
  if (data.pickupCity) lines.push(`*Delhi Boarding / Cab:* ${data.pickupCity}`);
  if (data.travelDate) lines.push(`*Travel Date:* ${data.travelDate}`);

  if (data.addons && data.addons.length > 0) {
    lines.push(`*Add-ons:* ${data.addons.join(", ")}`);
  }

  if (typeof data.totalPrice === "number") {
    lines.push(
      `*Estimated Total:* ₹${data.totalPrice.toLocaleString("en-IN")}`
    );
  }

  if (data.specialRequests && data.specialRequests.trim()) {
    lines.push(`*Special Request:* ${data.specialRequests.trim()}`);
  }

  lines.push("", "Please share availability and final booking details.");

  const encodedText = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedText}`;
}
