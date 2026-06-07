/**
 * lib/theme.ts
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * SINGLE SOURCE OF TRUTH for Archdrift's color palette and design tokens.
 *
 * HOW TO RETHEME:
 *   1. Edit the values in THEME_LIGHT and THEME_DARK below.
 *   2. Run `npm run dev` — changes appear instantly across the whole app AND demo.
 *   3. For production, push to git and Vercel redeploys automatically.
 *
 * These values are mirrored in app/globals.css as CSS custom properties.
 * The CSS is the runtime source; this file documents what those values *mean*
 * and provides typed access for JS/TS code (e.g. chart colors in Recharts).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const THEME_LIGHT = {
  // ── Backgrounds ──────────────────────────────────────────────────────────
  bg:          "#fefefe",
  card:        "#ffffff",
  cardAlt:     "#fefefe",
  cardHover:   "#f4f4f4",
  sidebar:     "#ffffff",
  inset:       "#f4f4f4",

  // ── Text ─────────────────────────────────────────────────────────────────
  text:          "#2b3230",
  textSecondary: "#4b5563",
  textMuted:     "#bec0bf",
  textAccent:    "#476e66",
  textInverse:   "#ffffff",

  // ── Borders ───────────────────────────────────────────────────────────────
  border:       "#dfdfe2",
  borderSubtle: "#f4f4f4",
  borderHover:  "#bec0bf",
  ring:         "rgba(71, 110, 102, 0.25)",

  // ── Accent (primary interactive color) ───────────────────────────────────
  accent:      "#476e66",
  accentHover: "#375650",
  accentSoft:  "rgba(71, 110, 102, 0.08)",
  accentMuted: "rgba(71, 110, 102, 0.15)",

  // ── Brand / Competitor labels ─────────────────────────────────────────────
  brandBg:        "rgba(71, 110, 102, 0.1)",
  brandText:      "#476e66",
  competitorBg:   "rgba(112, 138, 131, 0.1)",
  competitorText: "#708a83",

  // ── Status ────────────────────────────────────────────────────────────────
  success:     "#708a83",
  successSoft: "rgba(112, 138, 131, 0.15)",
  warning:     "#eab308",
  warningSoft: "rgba(234, 179, 8, 0.1)",
  danger:      "#ef4444",
  dangerSoft:  "rgba(239, 68, 68, 0.1)",

  // ── Charts (use these in Recharts <Line stroke={...}> etc.) ───────────────
  chartLine: "#476e66",
  chartGrid: "rgba(0, 0, 0, 0.04)",
  chartDot:  "#375650",
  chartAxis: "#bec0bf",

  // ── Misc ──────────────────────────────────────────────────────────────────
  scoreRingBg: "#dfdfe2",
  scrollbar:   "rgba(190, 192, 191, 0.3)",
} as const;

export const THEME_DARK = {
  // ── Backgrounds ──────────────────────────────────────────────────────────
  bg:          "#0b1121",
  card:        "#111827",
  cardAlt:     "#0f172a",
  cardHover:   "#1e293b",
  sidebar:     "#0f172a",
  inset:       "#0d1424",

  // ── Text ─────────────────────────────────────────────────────────────────
  text:          "#e2e8f0",
  textSecondary: "#94a3b8",
  textMuted:     "#64748b",
  textAccent:    "#60a5fa",
  textInverse:   "#0f172a",

  // ── Borders ───────────────────────────────────────────────────────────────
  border:       "#1e293b",
  borderSubtle: "rgba(30, 41, 59, 0.6)",
  borderHover:  "#334155",
  ring:         "rgba(96, 165, 250, 0.25)",

  // ── Accent ────────────────────────────────────────────────────────────────
  accent:      "#3b82f6",
  accentHover: "#60a5fa",
  accentSoft:  "rgba(59, 130, 246, 0.12)",
  accentMuted: "rgba(59, 130, 246, 0.2)",

  // ── Brand / Competitor labels ─────────────────────────────────────────────
  brandBg:        "rgba(96, 165, 250, 0.12)",
  brandText:      "#60a5fa",
  competitorBg:   "rgba(251, 146, 60, 0.12)",
  competitorText: "#fb923c",

  // ── Status ────────────────────────────────────────────────────────────────
  success:     "#34d399",
  successSoft: "rgba(52, 211, 153, 0.12)",
  warning:     "#fbbf24",
  warningSoft: "rgba(251, 191, 36, 0.12)",
  danger:      "#f87171",
  dangerSoft:  "rgba(248, 113, 113, 0.12)",

  // ── Charts ────────────────────────────────────────────────────────────────
  chartLine: "#60a5fa",
  chartGrid: "rgba(148, 163, 184, 0.1)",
  chartDot:  "#3b82f6",
  chartAxis: "#94a3b8",

  // ── Misc ──────────────────────────────────────────────────────────────────
  scoreRingBg: "#1e293b",
  scrollbar:   "rgba(148, 163, 184, 0.15)",
} as const;

/**
 * Per-provider chart colors used in Recharts and analytics tabs.
 * To add a new provider or change its color, edit here.
 */
export const PROVIDER_COLORS: Record<string, string> = {
  chatgpt:    "#10b981", // emerald
  perplexity: "#8b5cf6", // violet
  gemini:     "#3b82f6", // blue
  copilot:    "#f59e0b", // amber
  google_ai:  "#ef4444", // red
  grok:       "#6b7280", // gray (reserved)
};
