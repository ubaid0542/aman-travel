# Aman Traveller | Delhi to Manali Mountain & Couple Getaway 🏔️❤️

Production-ready Next.js application for **Aman Traveller**, featuring curated Delhi-to-Manali travel packages, dynamic live pricing calculator, interactive destination gallery with lightbox, verified traveler reviews, customizable 4-day itinerary, WhatsApp integration, and password-protected admin leads vault.

---

## 📁 Project Architecture & Structure

```
Aman Travels/
├── app/
│   ├── api/
│   │   └── enquiry/
│   │       └── route.ts          # Server-side API endpoint for POST /api/enquiry
│   ├── globals.css               # Global styles, Tailwind directives & custom button tokens
│   ├── layout.tsx                # Next.js Root Layout with SEO metadata & viewport
│   └── page.tsx                  # Home page assembling all sections & managing state
├── components/
│   ├── booking/
│   │   └── BookingModal.tsx      # Interactive booking modal with validation & server simulation
│   ├── layout/
│   │   ├── FloatingWhatsAppButton.tsx # Fixed quick-contact WhatsApp action button
│   │   ├── Footer.tsx            # Dark navy brand footer with quick links & support info
│   │   └── Navbar.tsx            # Sticky header with leads counter badge & mobile drawer
│   ├── leads/
│   │   └── SavedLeadsDrawer.tsx  # Password-protected leads vault with date/guest editor
│   ├── sections/
│   │   ├── DestinationGallery.tsx # Destination showcase with category filter & lightbox
│   │   ├── Hero.tsx              # Himalayan panorama vector scene & booking CTA
│   │   ├── ItinerarySection.tsx  # Interactive 4-day day-by-day plan with highlights
│   │   ├── PackagesSection.tsx   # Curated couple & adventure packages with WhatsApp booking
│   │   ├── PriceCalculator.tsx   # Live price calculator for couples & groups with instant quote
│   │   └── TestimonialsSection.tsx # Verified customer reviews & trust ratings
│   └── ui/
│       └── DestinationArtwork.tsx # 100% self-contained vector SVG illustrations
├── data/
│   ├── calculator.ts             # Stay tiers, transfer modes & add-on pricing
│   ├── constants.ts              # WhatsApp numbers, storage keys, admin credentials & brand info
│   ├── gallery.ts                # Destination spots metadata & recommended package links
│   ├── itinerary.ts              # Day-by-day itinerary data
│   ├── packages.ts               # Core travel package configurations
│   ├── sample-leads.ts           # Initial seeded demo enquiries
│   └── testimonials.ts           # Verified couple and traveler stories
├── hooks/
│   └── useLeads.ts               # Custom React hook for enquiries state & localStorage persistence
├── lib/
│   ├── date-utils.ts             # Date arithmetic, nights calculation & reference ID generator
│   ├── storage.ts                # SSR-safe localStorage persistence utilities
│   ├── validation.ts             # Client & server validation logic for booking fields
│   └── whatsapp.ts               # Formatted WhatsApp link builder with encoded trip details
├── types/
│   └── index.ts                  # TypeScript definitions for packages, leads, options & forms
├── next.config.mjs               # Next.js configuration
├── package.json                  # Dependencies & execution scripts
├── postcss.config.mjs            # PostCSS configuration
├── tailwind.config.ts            # Tailwind CSS configuration with brand color tokens
└── tsconfig.json                 # TypeScript compiler configuration with @/* path aliases
```

---

## 🎨 Design Tokens & Theme Colors

- **Navy Brand Dominant:** `#062847` / `#041f3d`
- **Warm Gold Accent:** `#ffd45a` (Hover: `#f5c43d`, Text: `#102c41`)
- **Icy Sky Background:** `#f4f9fc`
- **Soft Blue Sections:** `#eaf4fb`
- **Slate Text:** `#173246` (Muted: `#4b6578`)
- **WhatsApp Green:** `#25d366` (Hover: `#20bd5a`, Text: `#072814`)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm start
```

---

## 🔑 Admin Leads Vault Credentials

- **Vault Access:** Click **Saved Leads** in the Navbar
- **Demo Password:** `aman_leads_2026`
- **Features in Vault:**
  - View stored enquiries in real-time
  - Inline customizer for **Starting Date**, **Ending Date**, and **Guest Count**
  - Toggle status: `PENDING_CALLBACK` ↔ `CONTACTED`
  - Copy JSON payload to clipboard
  - Clear all records with confirmation
