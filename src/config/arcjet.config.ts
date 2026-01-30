
import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { env } from "./env.config.js";

export const aj = arcjet({
  key: env.ARCJET_KEY,
  rules: [
    // 1. Shield: Protects against common attacks (SQLi, XSS, etc.)
    shield({ mode: "LIVE" }),

    // 2. Bot Detection
    detectBot({
      mode: "LIVE", 
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Allow Google, Bing
        // "CATEGORY:MONITOR",    // Uncomment if you use UptimeRobot, etc.
      ],
    }),

    // 3. Rate Limiting (Token Bucket)
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,   // Refill 5 tokens...
      interval: 10,    // ...every 10 seconds
      capacity: 10,    // Max bucket size
    }),
  ],
});