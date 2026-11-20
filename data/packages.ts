import { Package } from "@/types";

export const PACKAGES: Package[] = [
  {
    id: "solo-explorer",
    title: "Manali Solo Backpacker & Workation Trail",
    category: "Solo Trip",
    duration: "3 Nights / 4 Days",
    shortDur: "3N/4D",
    nights: 3,
    price: "₹6,000",
    priceLabel: "/ person",
    numericCouplePrice: 12000,
    numericSoloPrice: 6000,
    highlights: [
      "14-Seater Luxury Volvo Tempo Traveller (Kashmere Gate ISBT)",
      "Cozy Riverside Hostel / Boutique Single Pod",
      "Jogini Waterfall Trek & Hidimba Devi Temple",
      "Atal Tunnel, Koksar & Sissu Exploration (Bike Rent Available)",
      "Kasol Day Trip & Musical Group Bonfire Nights",
    ],
  },
  {
    id: "couple-bliss",
    title: "Manali Romantic Couple Getaway",
    category: "Couple Getaway",
    duration: "3 Nights / 4 Days",
    shortDur: "3N/4D",
    nights: 3,
    price: "₹11,000",
    priceLabel: "/ couple",
    numericCouplePrice: 11000,
    numericSoloPrice: 6000,
    highlights: [
      "14-Seater Luxury Volvo Tempo Traveller (Kashmere Gate ISBT)",
      "Private Valley-View Balcony Room",
      "Atal Tunnel, Koksar, Sissu & Solang Valley Tour",
      "Jogini Waterfall, Hidimba Temple & Kasol Excursion",
      "Candlelight Dinner & Romantic Evening Bonfire",
    ],
  },
];
