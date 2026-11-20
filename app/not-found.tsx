import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 inline-block rounded-xl bg-[#e4f1fa] px-3 py-1 text-xs font-black uppercase text-[#062847]">
        404 • Not Found
      </div>
      <h1 className="mb-2 text-3xl font-black text-[#062847]">
        Page Nahi Mila
      </h1>
      <p className="mb-6 max-w-[420px] text-sm text-[#4b6578]">
        Aap jis page ko dhoondh rahe hain wo exist nahi karta ya move ho chuka hai.
      </p>
      <Link href="/" className="btn-gold !no-underline">
        Back to Home
      </Link>
    </main>
  );
}
