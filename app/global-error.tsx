"use client";

import React from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const isDev = process.env.NODE_ENV !== "production";

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center bg-[#f4f9fc] p-6 text-center font-sans">
        <h2 className="mb-2 text-2xl font-black text-[#062847]">Application Error</h2>
        <p className="mb-4 max-w-md text-sm text-[#4b6578]">
          {isDev && error?.message
            ? error.message
            : "An unexpected error occurred. Please refresh the page or contact Aman Travels via WhatsApp."}
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            background: "#ffd45a",
            color: "#102c41",
            padding: "12px 24px",
            borderRadius: "30px",
            fontWeight: "bold",
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
