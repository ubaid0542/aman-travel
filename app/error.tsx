"use client";

import React, { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In development only, log error for developer diagnostics
    if (process.env.NODE_ENV !== "production") {
      console.error("Application Error:", error);
    }
  }, [error]);

  const isDev = process.env.NODE_ENV !== "production";

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 inline-block rounded-xl bg-[#fee2e2] px-3 py-1 text-xs font-black uppercase text-[#991b1b]">
        Error
      </div>
      <h1 className="mb-2 text-2xl font-black text-[#062847]">
        Koshish karte waqt ek error aaya
      </h1>
      <p className="mb-6 max-w-[460px] text-sm text-[#4b6578]">
        {isDev && error?.message
          ? error.message
          : "Kripya page refresh karein ya humse seedha WhatsApp par sampark karein."}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="btn-gold cursor-pointer"
        >
          Try Again
        </button>
        <a
          href="https://wa.me/919304457465?text=Hello%20Aman%20Travels,%20I%20faced%20an%20issue%20on%20website"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp !py-2.5 !text-sm"
        >
          WhatsApp Support
        </a>
      </div>
    </main>
  );
}
