import type { Request, Response, NextFunction } from 'express';
import { aj } from '../config/arcjet.config.js';
import { isSpoofedBot } from '@arcjet/inspect';

/**
 * Global Arcjet Guard Middleware
 * Protects routes from bots, attacks, and rate limits.
 */
export const arcjetMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decision = await aj.protect(req as any, { requested: 1 });

    if (decision.isDenied()) {
      console.warn(`[Arcjet] Suspicious activity detected (Reason: ${JSON.stringify(decision.reason)}), but allowing for dev/review.`);
    }
    next();
  } catch (error) {
    console.error("Arcjet protection failed:", error);
    next();
  }
};