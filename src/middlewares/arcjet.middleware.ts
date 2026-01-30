import type { Request, Response, NextFunction } from 'express';
import { aj } from '../config/arcjet.config.js';
import { isSpoofedBot } from '@arcjet/inspect';

/**
 * Global Arcjet Guard Middleware
 * Protects routes from bots, attacks, and rate limits.
 */
export const arcjetMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // protect(req, { requested: 1 }) deducts 1 token per request.
    // Adjust this number if some routes are more "expensive" than others.
    const decision = await aj.protect(req as any, { requested: 1 });

    // console.log("Arcjet decision", decision); // Optional: Keep for debugging

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Too Many Requests" });
      } else if (decision.reason.isBot()) {
        res.status(403).json({ error: "No bots allowed" });
      } else {
        res.status(403).json({ error: "Forbidden" });
      }
      return; // Stop execution here
    }

    // Additional Checks (Hosting IPs & Spoofed Bots)
    
    // Check 1: Spoofed Bots (e.g., a script pretending to be GoogleBot)
    if (decision.results.some(isSpoofedBot)) {
      res.status(403).json({ error: "Forbidden: Spoofed bot detected" });
      return;
    }

    // Check 2: Hosting IPs (Optional - careful with this on APIs!)
    // If your API is called by other servers (e.g. AWS Lambda), remove this check.
    if (decision.ip.isHosting()) {
       // res.status(403).json({ error: "Forbidden: Hosting IP detected" });
       // return;
    }

    // If we pass all checks, proceed to the next middleware/controller
    next();
  } catch (error) {
    // If Arcjet fails (network issue), fail open or closed?
    // Usually, we log it and let the request through to avoid blocking real users.
    console.error("Arcjet protection failed:", error);
    next();
  }
};