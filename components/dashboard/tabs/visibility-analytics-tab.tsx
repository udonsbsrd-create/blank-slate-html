"use client";

import { useCallback, useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ScrapeRun, Provider } from "@/components/dashboard/types";
import { PROVIDER_LABELS } from "@/components/dashboard/types";

/* ───────────────────────── helpers ──────────────────────────── */

const PROVIDER_TINT: Record<Provider, string> = {
  chatgpt: "#10a37f",
  perplexity: "#1ba1e3",
  copilot: "#7c5bbf",
  gemini: "#4285f4",
  google_ai: "#ea4335",
};

function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function fmtPct(n: number) {
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}`;
}

/* ───────────────────────── component ─────────────────────────── */

type Props = {
  data: Array<{ day: string; visibility: number }>;
  runs: ScrapeRun[];
};

export function VisibilityAnalyticsTab({ data, runs }: Props) {
  /* ── aggregate metrics ───────────────────────────────────── */
  const metrics = useMemo(() => {
    if (runs.length === 0) {
      return null;
    }
    const sorted = [...runs].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
    const half = Math.floor(sorted.length / 2) || 1;
    const older = sorted.slice(0, half);
    const recent = sorted.slice(-half);
    const avg = (xs: ScrapeRun[]) =>
      xs.length ? xs.reduce((a, r) => a + (r.visibilityScore ?? 0), 0) / xs.length : 0;
    const cur = avg(recent);
    const prev = avg(older);
    const delta = cur - prev;
    const latest = sorted[sorted.length - 1];

    /* per-provider trend */
    const byProvider = new Map<Provider, ScrapeRun[]>();
    sorted.forEach((r) => {
      const arr = byProvider.get(r.provider) ?? [];
      arr.push(r);
      byProvider.set(r.provider, arr);
    });
    const providers = [...byProvider.entries()].map(([p, list]) => {
      const sparkData = list.map((r, i) => ({ i, v: r.visibilityScore ?? 0 }));
      const cur =
        list.slice(-Math.ceil(list.length / 2)).reduce((a, r) => a + (r.visibilityScore ?? 0), 0) /
        Math.max(1, Math.ceil(list.length / 2));
      const prev =
        list.slice(0, Math.floor(list.length / 2)).reduce((a, r) => a + (r.visibilityScore ?? 0), 0) /
        Math.max(1, Math.floor(list.length / 2));
      return {
        provider: p,
        score: Math.round(cur),
        delta: cur - prev,
        runs: list.length,
        spark: sparkData,
      };
    }).sort((a, b) => b.score - a.score);

    /* sentiment */
    const sentiment = sorted.reduce(
      (acc, r) => {
        const s = (r.sentiment ?? "neutral") as keyof typeof acc;
        acc[s] = (acc[s] ?? 0) + 1;
        return acc;
      },
      { positive: 0, neutral: 0, negative: 0, "not-mentioned": 0 },
    );

    /* movers — by prompt */
    const promptScores = new Map<string, number[]>();
    sorted.forEach((r) => {
      const arr = promptScores.get(r.prompt) ?? [];
      arr.push(r.visibilityScore ?? 0);
      promptScores.set(r.prompt, arr);
    });
    const movers = [...promptScores.entries()]
      .filter(([, arr]) => arr.length >= 2)
      .map(([prompt, arr]) => {
        const first = arr.slice(0, Math.ceil(arr.length / 2));
        const last = arr.slice(-Math.ceil(arr.length / 2));
        const d =
          last.reduce((a, b) => a + b, 0) / last.length -
          first.reduce((a, b) => a + b, 0) / first.length;
        return { prompt, delta: d, current: Math.round(last[last.length - 1]) };
      })
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));

    const topGainers = [...movers].sort((a, b) => b.delta - a.delta).slice(0, 3);
    const topLosers = [...movers].sort((a, b) => a.delta - b.delta).slice(0, 3);

    return {
      cur,
      delta,
      latest,
      providers,
      sentiment,
      topGainers,
      topLosers,
      totalRuns: runs.length,
    };
  }, [runs]);

  /* ── exports ───────────────────────────────────────────────── */
  const exportRunsCsv = useCallback(() => {
    const header =
      "Date,Provider,Prompt,Visibility Score,Sentiment,Brand Mentions,Competitor Mentions,Sources Count\n";
    const rows = runs
      .map((r) =>
        [
          r.createdAt,
          r.provider,
          `"${r.prompt.replace(/"/g, '""')}"`,
          r.visibilityScore ?? 0,
          r.sentiment ?? "",
          (r.brandMentions ?? []).join("; "),
          (r.competitorMentions ?? []).join("; "),
          r.sources.length,
        ].join(","),
      )
      .join("\n");
    downloadCsv(`aeo-runs-${new Date().toISOString().slice(0, 10)}.csv`, header + rows);
  }, [runs]);

  const exportTrendCsv = useCallback(() => {
    const header = "Day,Avg Visibility (%)\n";
    const rows = data.map((d) => `${d.day},${d.visibility}`).join("\n");
    downloadCsv(`aeo-trend-${new Date().toISOString().slice(0, 10)}.csv`, header + rows);
  }, [data]);

  if (!metrics) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <div className="text-6xl font-black tabular-nums tracking-tighter text-th-text-muted">
          —
        </div>
        <div className="text-sm uppercase tracking-[0.2em] text-th-text-muted">
          No visibility signal yet
        </div>
        <div className="max-w-sm text-sm text-th-text-secondary">
          Run prompts from the Prompt Hub to start streaming visibility intelligence.
        </div>
      </div>
    );
  }

  const deltaPositive = metrics.delta >= 0;
  const deltaColor = deltaPositive ? "var(--th-success)" : "var(--th-danger)";
  const sentimentTotal = Object.values(metrics.sentiment).reduce((a, b) => a + b, 0) || 1;

  return (
    <div className="space-y-8">
      {/* ═════════ HERO — live visibility ticker ═════════════════ */}
      <section className="relative overflow-hidden rounded-2xl border border-th-border bg-gradient-to-br from-th-card to-th-card-alt p-6 md:p-8">
        {/* subtle accent grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(var(--th-accent) 1px, transparent 1px), linear-gradient(90deg, var(--th-accent) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          {/* left: number */}
          <div className="flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-th-text-muted">
                <span className="relative flex h-2 w-2">
                  <span
                    className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
                    style={{ backgroundColor: "var(--th-accent)" }}
                  />
                  <span
                    className="relative inline-flex h-2 w-2 rounded-full"
                    style={{ backgroundColor: "var(--th-accent)" }}
                  />
                </span>
                AI Visibility Index · Live
              </div>
              <div className="mt-3 flex items-end gap-3">
                <span className="text-[88px] font-black leading-none tabular-nums tracking-tighter text-th-text md:text-[112px]">
                  {Math.round(metrics.cur)}
                </span>
                <span className="mb-3 text-2xl font-medium text-th-text-muted">/100</span>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <span
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-bold tabular-nums"
                  style={{
                    color: deltaColor,
                    backgroundColor: deltaPositive
                      ? "var(--th-success-soft)"
                      : "var(--th-danger-soft)",
                  }}
                >
                  {deltaPositive ? "▲" : "▼"} {fmtPct(metrics.delta)}
                </span>
                <span className="text-th-text-muted">vs. prior period</span>
              </div>
            </div>

            {/* meta row */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <Meta label="Runs" value={metrics.totalRuns.toLocaleString()} />
              <Meta label="Models" value={metrics.providers.length.toString()} />
              <Meta
                label="Last run"
                value={
                  metrics.latest
                    ? new Date(metrics.latest.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })
                    : "—"
                }
              />
            </div>
          </div>

          {/* right: trend chart */}
          <div className="h-[220px] w-full md:h-[260px]">
            {data.length > 0 ? (
              <ResponsiveContainer>
                <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="visGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--th-accent)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--th-accent)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--th-chart-grid)" strokeDasharray="2 4" vertical={false} />
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "var(--th-chart-axis)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: "var(--th-chart-axis)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={32}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--th-card)",
                      border: "1px solid var(--th-border)",
                      borderRadius: 10,
                      fontSize: 12,
                      color: "var(--th-text)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="visibility"
                    name="Avg Visibility"
                    stroke="var(--th-accent)"
                    strokeWidth={2.5}
                    fill="url(#visGrad)"
                    dot={false}
                    activeDot={{ r: 4, fill: "var(--th-accent)" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-th-text-muted">
                Awaiting trend data…
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═════════ PROVIDER STRIP — sparkline ticker row ═════════ */}
      <section>
        <SectionLabel left="Models" right="ranked by current score" />
        <div className="grid gap-px overflow-hidden rounded-xl border border-th-border bg-th-border md:grid-cols-2 lg:grid-cols-5">
          {metrics.providers.map(({ provider, score, delta, runs: n, spark }) => {
            const tint = PROVIDER_TINT[provider];
            const up = delta >= 0;
            return (
              <div key={provider} className="relative flex flex-col gap-2 bg-th-card p-4">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: tint }}
                  />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-th-text-secondary">
                    {PROVIDER_LABELS[provider]}
                  </span>
                  <span className="ml-auto text-[10px] tabular-nums text-th-text-muted">
                    {n}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold tabular-nums leading-none text-th-text">
                    {score}
                  </span>
                  <span
                    className="text-xs font-bold tabular-nums"
                    style={{ color: up ? "var(--th-success)" : "var(--th-danger)" }}
                  >
                    {up ? "▲" : "▼"} {fmtPct(delta)}
                  </span>
                </div>
                <div className="h-10 -mx-1">
                  <ResponsiveContainer>
                    <LineChart data={spark}>
                      <Line
                        type="monotone"
                        dataKey="v"
                        stroke={tint}
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═════════ SENTIMENT BAR + MOVERS ════════════════════════ */}
      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        {/* Sentiment distribution bar */}
        <div>
          <SectionLabel left="Sentiment mix" right={`${runs.length} runs`} />
          <div className="rounded-xl border border-th-border bg-th-card p-4">
            <div className="flex h-3 w-full overflow-hidden rounded-full">
              {(["positive", "neutral", "negative", "not-mentioned"] as const).map((k) => {
                const v = metrics.sentiment[k];
                const pct = (v / sentimentTotal) * 100;
                const colors: Record<string, string> = {
                  positive: "var(--th-success)",
                  neutral: "var(--th-accent)",
                  negative: "var(--th-danger)",
                  "not-mentioned": "var(--th-text-muted)",
                };
                if (pct === 0) return null;
                return (
                  <div
                    key={k}
                    className="h-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: colors[k] }}
                    title={`${k}: ${v}`}
                  />
                );
              })}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(["positive", "neutral", "negative", "not-mentioned"] as const).map((k) => {
                const v = metrics.sentiment[k];
                const pct = ((v / sentimentTotal) * 100).toFixed(0);
                const colors: Record<string, string> = {
                  positive: "var(--th-success)",
                  neutral: "var(--th-accent)",
                  negative: "var(--th-danger)",
                  "not-mentioned": "var(--th-text-muted)",
                };
                return (
                  <div key={k} className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-sm"
                        style={{ backgroundColor: colors[k] }}
                      />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-th-text-muted">
                        {k.replace("-", " ")}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xl font-bold tabular-nums text-th-text">{v}</span>
                      <span className="text-xs text-th-text-muted">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Movers */}
        <div>
          <SectionLabel left="Drift watch" right="largest score shifts by prompt" />
          <div className="grid gap-px overflow-hidden rounded-xl border border-th-border bg-th-border md:grid-cols-2">
            <MoverList
              title="Gainers"
              icon="▲"
              tone="success"
              items={metrics.topGainers.filter((m) => m.delta > 0)}
            />
            <MoverList
              title="Losers"
              icon="▼"
              tone="danger"
              items={metrics.topLosers.filter((m) => m.delta < 0)}
            />
          </div>
        </div>
      </section>

      {/* ═════════ EXPORT BAR ════════════════════════════════════ */}
      <section className="flex flex-wrap items-center gap-2 border-t border-th-border pt-4">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-th-text-muted">
          Export
        </span>
        <button
          onClick={exportRunsCsv}
          disabled={runs.length === 0}
          className="rounded-md border border-th-border bg-th-card-alt px-3 py-1.5 text-xs font-medium text-th-text-secondary transition-colors hover:border-th-accent hover:text-th-text-accent disabled:opacity-40"
        >
          ↓ runs.csv
        </button>
        <button
          onClick={exportTrendCsv}
          disabled={data.length === 0}
          className="rounded-md border border-th-border bg-th-card-alt px-3 py-1.5 text-xs font-medium text-th-text-secondary transition-colors hover:border-th-accent hover:text-th-text-accent disabled:opacity-40"
        >
          ↓ trend.csv
        </button>
      </section>
    </div>
  );
}

/* ───────────────────────── sub-components ────────────────────── */

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-th-border bg-th-card-alt px-3 py-2">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-th-text-muted">
        {label}
      </div>
      <div className="mt-0.5 text-sm font-semibold tabular-nums text-th-text">{value}</div>
    </div>
  );
}

function SectionLabel({ left, right }: { left: string; right?: string }) {
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3">
      <h3 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-th-text">
        {left}
      </h3>
      {right && <span className="text-[11px] text-th-text-muted">{right}</span>}
    </div>
  );
}

function MoverList({
  title,
  icon,
  tone,
  items,
}: {
  title: string;
  icon: string;
  tone: "success" | "danger";
  items: { prompt: string; delta: number; current: number }[];
}) {
  const color = tone === "success" ? "var(--th-success)" : "var(--th-danger)";
  return (
    <div className="bg-th-card p-4">
      <div className="mb-3 flex items-center gap-1.5">
        <span style={{ color }} className="text-sm font-bold">{icon}</span>
        <span className="text-[11px] font-semibold uppercase tracking-wider text-th-text-secondary">
          {title}
        </span>
      </div>
      {items.length === 0 ? (
        <div className="py-2 text-xs text-th-text-muted">No significant {title.toLowerCase()}.</div>
      ) : (
        <ul className="space-y-2.5">
          {items.map((m, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="mt-0.5 shrink-0 text-xs font-bold tabular-nums tracking-tight"
                style={{ color, minWidth: 44 }}
              >
                {fmtPct(m.delta)}
              </span>
              <span className="line-clamp-2 flex-1 text-xs leading-snug text-th-text-secondary">
                {m.prompt}
              </span>
              <span className="shrink-0 text-xs tabular-nums text-th-text-muted">
                @ {m.current}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
