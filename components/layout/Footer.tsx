import React from "react";
import { buildWhatsAppBookingUrl } from "@/lib/whatsapp";
import { BRAND, WHATSAPP_NUMBER } from "@/data/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="mt-10 bg-[#062847] px-[5%] pb-6 pt-10 text-[#d6e6f2]"
    >
      <div className="mx-auto mb-6 grid max-w-[1180px] grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <div className="mb-2.5 text-2xl font-black tracking-wider text-white">
            AMAN <span className="text-[#ffd45a]">TRAVELLER</span>
          </div>
          <p className="text-[15px] leading-relaxed">
            Delhi to Manali Mountain &amp; Couple Getaway Specialists. Safe
            cabs, luxury Volvos, verified hotels, aur transparent pricing.
          </p>
        </div>

        <div>
          <h4 className="mb-2.5 font-bold text-white">Quick Links</h4>
          <ul className="space-y-1.5 text-[15px]">
            <li>
              <a
                href="#packages"
                className="text-[#d6e6f2] no-underline hover:text-[#ffd45a]"
              >
                Delhi to Manali Packages
              </a>
            </li>
            <li>
              <a
                href="#gallery"
                className="text-[#d6e6f2] no-underline hover:text-[#ffd45a]"
              >
                Manali Photo Gallery
              </a>
            </li>
            <li>
              <a
                href="#calculator"
                className="text-[#d6e6f2] no-underline hover:text-[#ffd45a]"
              >
                Couple &amp; Group Calculator
              </a>
            </li>
            <li>
              <a
                href="#itinerary"
                className="text-[#d6e6f2] no-underline hover:text-[#ffd45a]"
              >
                4-Day Itinerary
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-2.5 font-bold text-white">Contact Us</h4>
          <p className="mb-1 text-[15px]">
            Majnu Ka Tilla (New Delhi) • Mall Road (Manali)
          </p>
          <p className="mb-1 text-[15px]">
            Phone / Call:{" "}
            <a href={`tel:+${WHATSAPP_NUMBER}`} className="font-bold text-white hover:text-[#ffd45a]">
              {BRAND.phoneDisplay}
            </a>
          </p>
          <p className="mb-2 text-[15px]">Support: 24/7 Trip Assistance</p>
          <a
            href={buildWhatsAppBookingUrl({
              packageName: "Delhi to Manali Mountain & Couple Getaway",
            })}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm font-bold text-[#ffd45a] underline hover:text-[#f5c43d]"
          >
            Direct WhatsApp Desk ({BRAND.phoneDisplay}) →
          </a>
        </div>
      </div>

      <div className="border-t border-white/15 pt-4 text-center text-sm">
        © {currentYear} Aman Traveller | Delhi to Manali Mountain
        &amp; Couple Getaway.
      </div>
    </footer>
  );
}
