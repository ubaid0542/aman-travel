/**
 * In-memory sliding-window rate limiter for serverless & edge Node.js runtime.
 * Protects public endpoints (like POST /api/enquiry) from spam, bots, and flooding.
 */

interface RateLimitConfig {
  maxRequests: number; // e.g. 5 requests
  windowMs: number;    // e.g. 60,000 ms (1 minute)
}

const ipHistoryMap = new Map<string, number[]>();
const CLEANUP_INTERVAL_MS = 60_000;
let lastCleanup = Date.now();

function purgeExpired(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [ip, timestamps] of ipHistoryMap.entries()) {
    const valid = timestamps.filter((t) => now - t < windowMs);
    if (valid.length === 0) {
      ipHistoryMap.delete(ip);
    } else {
      ipHistoryMap.set(ip, valid);
    }
  }
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { maxRequests: 5, windowMs: 60_000 }
): RateLimitResult {
  const now = Date.now();
  purgeExpired(config.windowMs);

  const timestamps = (ipHistoryMap.get(identifier) || []).filter(
    (t) => now - t < config.windowMs
  );

  if (timestamps.length >= config.maxRequests) {
    const oldest = timestamps[0];
    const resetSeconds = Math.ceil((oldest + config.windowMs - now) / 1000);
    return {
      success: false,
      limit: config.maxRequests,
      remaining: 0,
      resetSeconds: Math.max(1, resetSeconds),
    };
  }

  timestamps.push(now);
  ipHistoryMap.set(identifier, timestamps);

  return {
    success: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - timestamps.length,
    resetSeconds: Math.ceil(config.windowMs / 1000),
  };
}

export function getClientIp(req: Request): string {
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }
  return "127.0.0.1";
}
