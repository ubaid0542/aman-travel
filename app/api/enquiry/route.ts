import { NextRequest, NextResponse } from "next/server";
import { validateBookingField, normalizeIndianPhone, sanitizePlainText } from "@/lib/validation";
import { getTodayDateString, calculateTripNights, generateReferenceId } from "@/lib/date-utils";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET() {
  return NextResponse.json(
    {
      status: "online",
      service: "Aman Traveller Booking & Enquiry API",
      timestamp: new Date().toISOString(),
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: "GET, POST, OPTIONS",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(req: NextRequest) {
  // 1. IP Rate Limiting (5 requests per IP per minute)
  const clientIp = getClientIp(req);
  const rateResult = checkRateLimit(clientIp, { maxRequests: 5, windowMs: 60_000 });

  if (!rateResult.success) {
    return NextResponse.json(
      {
        success: false,
        message: `Too many booking requests from this IP. Kripya ${rateResult.resetSeconds} seconds baad try karein ya WhatsApp par contact karein.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateResult.resetSeconds),
          "X-RateLimit-Limit": String(rateResult.limit),
          "X-RateLimit-Remaining": String(rateResult.remaining),
        },
      }
    );
  }

  // 2. Request Payload Size Guard (< 15KB)
  const contentLength = req.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > 15_000) {
    return NextResponse.json(
      {
        success: false,
        message: "Request payload too large.",
      },
      { status: 413 }
    );
  }

  try {
    const body = await req.json();

    // 3. Honeypot check (reject automated spam bots silently)
    if (body.website && String(body.website).trim().length > 0) {
      return NextResponse.json(
        {
          success: true,
          message: "Enquiry received.",
        },
        { status: 200 }
      );
    }

    const todayStr = getTodayDateString();
    const requiredFields = ["name", "phone", "startDate", "endDate", "guests", "pickup"];
    const validationErrors: Record<string, string> = {};

    for (const field of requiredFields) {
      const err = validateBookingField(field, body[field], todayStr, body);
      if (err) {
        validationErrors[field] = err;
      }
    }

    // Optional email validation
    if (body.email) {
      const emailErr = validateBookingField("email", body.email, todayStr, body);
      if (emailErr) {
        validationErrors.email = emailErr;
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed. Please correct the highlighted errors.",
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    const sanitizedPhone = normalizeIndianPhone(String(body.phone || ""));
    const nights = calculateTripNights(body.startDate, body.endDate);
    const referenceId = body.id || generateReferenceId();

    // 4. Strict input sanitization & character length capping
    const confirmedLead = {
      id: sanitizePlainText(referenceId, 32),
      packageName: sanitizePlainText(body.packageName || "Manali Romantic Couple Getaway", 100),
      name: sanitizePlainText(body.name, 80),
      phone: sanitizedPhone,
      email: body.email ? sanitizePlainText(body.email, 100) : undefined,
      startDate: sanitizePlainText(body.startDate, 10),
      endDate: sanitizePlainText(body.endDate, 10),
      nights,
      guests: Math.min(30, Math.max(1, Number(body.guests) || 1)),
      pickup: sanitizePlainText(body.pickup, 120),
      stayTier: body.stayTier ? sanitizePlainText(body.stayTier, 100) : undefined,
      transferMode: body.transferMode ? sanitizePlainText(body.transferMode, 100) : undefined,
      addons: Array.isArray(body.addons)
        ? body.addons.map((a: unknown) => sanitizePlainText(a, 100))
        : undefined,
      totalPrice:
        typeof body.totalPrice === "number" && !Number.isNaN(body.totalPrice)
          ? Math.max(0, Math.min(body.totalPrice, 1_000_000))
          : undefined,
      specialRequests: body.specialRequests
        ? sanitizePlainText(body.specialRequests, 500)
        : undefined,
      status: "PENDING_CALLBACK",
      source: sanitizePlainText(body.source || "api-route", 50),
      createdAt: new Date().toISOString(),
      serverStatus: "CONFIRMED",
    };

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry submitted successfully",
        data: confirmedLead,
      },
      { status: 201 }
    );
  } catch {
    // 5. Safe error handling: Do NOT leak internal stack traces or database errors in production
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error processing enquiry. Please try again or book directly via WhatsApp.",
      },
      { status: 500 }
    );
  }
}
