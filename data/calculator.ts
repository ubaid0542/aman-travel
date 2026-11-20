import { StayOption, TransferOption, AddonOption } from "@/types";

export const STAY_OPTIONS: StayOption[] = [
  { id: "deluxe", label: "Deluxe Valley-View Room", extraPerNightPerRoom: 0 },
  {
    id: "boutique",
    label: "Luxury Boutique / Jacuzzi Suite",
    extraPerNightPerRoom: 2500,
  },
  {
    id: "cottage",
    label: "Private Riverside Cottage",
    extraPerNightPerRoom: 4000,
  },
];

export const TRANSFER_OPTIONS: TransferOption[] = [
  {
    id: "tempo",
    label: "14-Seater Luxury Volvo Tempo Traveller (Kashmere Gate ISBT)",
    price: 0,
  },
  {
    id: "volvo",
    label: "AC Semi-Sleeper Volvo Bus (New Delhi)",
    price: 0,
  },
  {
    id: "sedan",
    label: "Private Sedan Cab (Delhi NCR Doorstep)",
    price: 4500,
  },
  {
    id: "innova",
    label: "Private Innova Crysta SUV (Delhi NCR)",
    price: 7500,
  },
];

export const ADDON_OPTIONS: AddonOption[] = [
  {
    id: "bike-rent",
    label: "Mountain Bike Rental in Koksar / Sissu (₹1,200/person)",
    price: 1200,
    perPerson: true,
  },
  {
    id: "bonfire",
    label: "Evening Group Bonfire & Musical Session",
    price: 499,
    perPerson: false,
  },
  {
    id: "candlelight",
    label: "Candlelight Dinner & Honeymoon Cake",
    price: 1499,
    perPerson: false,
  },
  {
    id: "snow-combo",
    label: "Paragliding & Snow Scooter Combo",
    price: 1999,
    perPerson: true,
  },
  {
    id: "atal-sissu",
    label: "Atal Tunnel + Sissu Day Excursion",
    price: 2499,
    perPerson: false,
  },
];
