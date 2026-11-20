export interface Package {
  id: string;
  title: string;
  category: "Solo Trip" | "Couple Getaway" | "Snow Special" | "Mountain Adventure" | string;
  duration: string;
  shortDur: string;
  nights: number;
  price: string;
  priceLabel?: string;
  numericCouplePrice: number;
  numericSoloPrice?: number;
  highlights: string[];
}

export interface GallerySpot {
  id: string;
  title: string;
  category: "Snow & Peaks" | "Waterfalls & Nature" | "Kasol & Adventure" | "Culture & Stays" | string;
  location: string;
  bestTime: string;
  image?: string;
  artVariant?: "solang" | "atal" | "balcony" | "cafes" | "hidimba" | "jogini" | string;
  caption: string;
  recommendedPackage: string;
}

export interface StayOption {
  id: string;
  label: string;
  extraPerNightPerRoom: number;
}

export interface TransferOption {
  id: string;
  label: string;
  price: number;
}

export interface AddonOption {
  id: string;
  label: string;
  price: number;
  perPerson: boolean;
}

export interface Review {
  id: string;
  coupleNames: string;
  city: string;
  tripType: string;
  packageBooked: string;
  travelMonth: string;
  rating: number;
  highlight: string;
  comment: string;
}

export interface ItineraryDay {
  day: string;
  title: string;
  highlights: string[];
  details: string;
}

export interface ActiveTripBatch {
  startDate: string;
  endDate: string;
  nights: number;
  title?: string;
  seatsLeft?: number;
  isActive: boolean;
  updatedAt: string;
}

export interface LeadRecord {
  id: string;
  packageName: string;
  name: string;
  phone: string;
  email?: string;
  specialRequests?: string;
  startDate: string;
  endDate: string;
  nights: number;
  pickup: string;
  guests: number;
  stayTier?: string;
  transferMode?: string;
  addons?: string[];
  totalPrice?: number;
  status: "PENDING_CALLBACK" | "CONTACTED";
  adminNotes?: string;
  createdAt: string;
  updatedAt?: string;
  source: string;
}

export interface BookingContext {
  packageName: string;
  guests?: number;
  travelDate?: string;
  stayTier?: string;
  transferMode?: string;
  addons?: string[];
  totalPrice?: number;
  batchInfo?: ActiveTripBatch;
}

export interface PriceBreakdown {
  pkg: Package;
  stay: StayOption;
  transfer: TransferOption;
  tripType: "Solo" | "Couple" | "Group";
  effectiveGuests: number;
  rooms: number;
  cabsNeeded: number;
  baseCost: number;
  stayUpgradeCost: number;
  transferCost: number;
  addonsCost: number;
  groupDiscount: number;
  finalTotal: number;
  perPerson: number;
  addonLabels: string[];
}

export interface BookingFormValues {
  name: string;
  phone: string;
  email?: string;
  startDate: string;
  endDate: string;
  pickup: string;
  guests: string;
  specialRequests?: string;
}

export type BookingFormErrors = Partial<Record<keyof BookingFormValues, string>>;
