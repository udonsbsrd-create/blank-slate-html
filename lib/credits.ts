/**
 * lib/credits.ts
 *
 * Single source of truth for credit costs.
 * Change a number here and it propagates everywhere instantly.
 *
 * COGS alignment: 1 credit = 1 BrightData/OpenRouter/Gemini API call.
 * A user running 1 prompt across all 6 models costs 6 credits.
 */

export const CREDIT_COSTS = {
  /** /api/scrape — 1 BrightData AI scrape per model */
  scrape: 1,

  /** /api/audit — AEO readiness audit (multiple external fetches) */
  audit: 2,

  /** /api/analyze — single OpenRouter LLM call (battlecards, niche, fan-out) */
  analyze: 1,

  /** /api/brightdata-platforms — scrape across all AI platforms for 1 keyword */
  brightdata_platforms: 3,

  /** /api/serp — single SERP lookup */
  serp: 1,

  /** /api/sro-analyze — OpenRouter LLM synthesis of SRO data */
  sro_analyze: 2,

  /** /api/unlocker — BrightData web unlocker per page */
  unlocker: 1,

  /** /api/site-context — BrightData + OpenRouter to analyse a homepage */
  site_context: 2,

  /** /api/bulk-sro — per item in the batch (covers all sub-calls per URL) */
  bulk_sro_per_item: 5,
} as const;

export type CreditAction = keyof typeof CREDIT_COSTS;

/** Plan definitions. Stored in user_credits.plan column. */
export const PLAN_LIMITS: Record<string, number> = {
  free: 50,
  pro: 500,
  unlimited: 999_999,
};
