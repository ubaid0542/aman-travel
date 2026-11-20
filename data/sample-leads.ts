import { LeadRecord } from "@/types";
import { getTodayDateString, addDaysToDateString } from "@/lib/date-utils";

export function getInitialSampleLeads(): LeadRecord[] {
  const today = getTodayDateString();
  const s0 = addDaysToDateString(today, 5);
  const e0 = addDaysToDateString(today, 8);
  const s1 = addDaysToDateString(today, 10);
  const e1 = addDaysToDateString(today, 13);
  const s2 = addDaysToDateString(today, 18);
  const e2 = addDaysToDateString(today, 22);

  return [
    {
      id: "AT-2026-60SOLO",
      packageName: "Manali Solo Backpacker & Workation Trail (3N/4D)",
      name: "Aayush Sharma",
      phone: "9818901234",
      email: "aayush.travels@gmail.com",
      startDate: s0,
      endDate: e0,
      nights: 3,
      pickup: "Delhi (Majnu Ka Tilla Volvo)",
      guests: 1,
      totalPrice: 6000,
      specialRequests: "Co-working space with fast Wi-Fi and quiet room",
      status: "PENDING_CALLBACK",
      createdAt: `${today}T11:45:00.000Z`,
      source: "website-booking-modal",
    },
    {
      id: "AT-2026-91A4C2",
      packageName: "Manali Romantic Couple Getaway (3 Nights / 4 Days)",
      name: "Rohan Sharma",
      phone: "9811456720",
      startDate: s1,
      endDate: e1,
      nights: 3,
      pickup: "Delhi (Kashmere Gate ISBT)",
      guests: 2,
      totalPrice: 11000,
      status: "PENDING_CALLBACK",
      createdAt: `${today}T10:30:00.000Z`,
      source: "website-booking-modal",
    },
    {
      id: "AT-2026-47B8E9",
      packageName: "Manali Romantic Couple Getaway (3 Nights / 4 Days)",
      name: "Aditya Malhotra",
      phone: "9873210984",
      startDate: s2,
      endDate: e2,
      nights: 3,
      pickup: "Delhi (Kashmere Gate ISBT)",
      guests: 2,
      totalPrice: 11000,
      status: "CONTACTED",
      createdAt: `${today}T08:15:00.000Z`,
      source: "website-booking-modal",
    },
  ];
}
