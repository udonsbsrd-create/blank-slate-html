"use client";

import { useMemo, useState } from "react";
import type { ScrapeRun, RunDelta } from "@/components/dashboard/types";
import { ALL_PROVIDERS, PROVIDER_LABELS, type Provider } from "@/components/dashboard/types";

/* ───────────────────────── types ────────────────────────────── */

type Props = {
  runs: ScrapeRun[];
  brandTerms: string[];
  competitorTerms: string[];
  runDeltas?: RunDelta[];
  onDeleteRun?: (index: number) => void;
};

const PROVIDER_TINT: Record<Provider, string> = {
  chatgpt: "#10a37f",
  perplexity: "#1ba1e3",
  copilot: "#7c5bbf",
  gemini: "#4285f4",
  google_ai: "#ea4335",
};

const SENTIMENT_TINT: Record<string, string> = {
  positive: "var(--th-success)",
  neutral: "var(--th-text-accent)",
  negative: "var(--th-danger)",
  "not-mentioned": "var(--th-text-muted)",
};

/* ───────────────────────── utilities ────────────────────────── */

function normalize(answer: string): string {
  let text = answer;
  if (/^\s*[{\[]/.test(text)) {
    try {
      const parsed = JSON.parse(text);
      const extract = (obj: unknown): string => {
        if (typeof obj === "string") return obj;
        if (Array.isArray(obj)) return obj.map(extract).filter(Boolean).join("\n\n");
        if (obj && typeof obj === "object") {
          const rec = obj as Record<string, unknown>;
          for (const k of ["answer", "response", "output", "text", "content", "message", "body"]) {
            if (typeof rec[k] === "string" && (rec[k] as string).trim()) return (rec[k] as string).trim();
          }
          return Object.values(rec).map(extract).filter(Boolean).join("\n\n");
        }
        return String(obj ?? "");
      };
      const out = extract(parsed);
      if (out.trim().length > 20) text = out;
    } catch {
      text = text.replace(/[{}\[\]"]/g, " ").replace(/\\n/g, "\n").replace(/\\t/g, " ");
    }
  }
  return text
    .replace(/\r\n?/g, "\n")
    .replace(/```[\s\S]*?```/g, (b) => b.replace(/```/g, ""))
    .replace(/<br\s*\/?\s*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function Highlight({
  text,
  brand,
  competitor,
}: {
  text: string;
  brand: string[];
  competitor: string[];
}) {
  if (brand.length === 0 && competitor.length === 0) return <>{text}</>;
  const all = [
    ...brand.map((t) => ({ term: t, type: "brand" as const })),
    ...competitor.map((t) => ({ term: t, type: "competitor" as const })),
  ].sort((a, b) => b.term.length - a.term.length);
  const escaped = all.map((t) => ({
    ...t,
    p: t.term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  }));
  const re = new RegExp(`(${escaped.map((e) => e.p).join("|")})`, "gi");
  const parts = text.split(re);
  return (
    <>
      {parts.map((part, i) => {
        const hit = all.find((t) => t.term.toLowerCase() === part.toLowerCase());
        if (!hit) return <span key={i}>{part}</span>;
        return (
          <mark
            key={i}
            className={
              hit.type === "brand"
                ? "rounded-sm bg-th-brand-bg px-0.5 font-semibold text-th-brand-text"
                : "rounded-sm bg-th-competitor-bg px-0.5 font-semibold text-th-competitor-text"
            }
          >
            {part}
          </mark>
        );
      })}
    </>
  );
}

function relTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

/* ───────────────────────── main ─────────────────────────────── */

export function ReputationSourcesTab({
  runs,
  brandTerms,
  competitorTerms,
  runDeltas = [],
  onDeleteRun,
}: Props) {
  const [query, setQuery] = useState("");
  const [filterProvider, setFilterProvider] = useState<Provider | "all">("all");
  const [filterSentiment, setFilterSentiment] = useState<string>("all");
  const [sort, setSort] = useState<"date" | "score">("date");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  /* delta lookup */
  const deltaMap = useMemo(() => {
    const m = new Map<string, number>();
    runDeltas.forEach((d) => m.set(`${d.prompt}|||${d.provider}`, d.delta));
    return m;
  }, [runDeltas]);

  /* original index lookup for delete callback */
  const indexMap = useMemo(() => {
    const m = new Map<ScrapeRun, number>();
    runs.forEach((r, i) => m.set(r, i));
    return m;
  }, [runs]);

  /* filtered + sorted runs */
  const visibleRuns = useMemo(() => {
    let list = runs;
    if (filterProvider !== "all") list = list.filter((r) => r.provider === filterProvider);
    if (filterSentiment !== "all") list = list.filter((r) => r.sentiment === filterSentiment);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (r) =>
          r.prompt.toLowerCase().includes(q) ||
          (r.answer ?? "").toLowerCase().includes(q),
      );
    }
    const copy = [...list];
    if (sort === "score") {
      copy.sort((a, b) => (b.visibilityScore ?? 0) - (a.visibilityScore ?? 0));
    } else {
      copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return copy;
  }, [runs, filterProvider, filterSentiment, query, sort]);

  /* group by prompt for the rail */
  const promptStats = useMemo(() => {
    const m = new Map<string, { count: number; avg: number; latest: string }>();
    runs.forEach((r) => {
      const cur = m.get(r.prompt) ?? { count: 0, avg: 0, latest: r.createdAt };
      const newCount = cur.count + 1;
      const newAvg = (cur.avg * cur.count + (r.visibilityScore ?? 0)) / newCount;
      const newer = new Date(r.createdAt) > new Date(cur.latest) ? r.createdAt : cur.latest;
      m.set(r.prompt, { count: newCount, avg: newAvg, latest: newer });
    });
    return [...m.entries()]
      .map(([prompt, s]) => ({ prompt, ...s }))
      .sort((a, b) => new Date(b.latest).getTime() - new Date(a.latest).getTime());
  }, [runs]);

  /* hero metrics */
  const hero = useMemo(() => {
    if (runs.length === 0) return null;
    const avg = Math.round(runs.reduce((a, r) => a + (r.visibilityScore ?? 0), 0) / runs.length);
    const mentioned = runs.filter((r) => (r.brandMentions?.length ?? 0) > 0).length;
    return {
      avg,
      mentioned,
      coverage: Math.round((mentioned / runs.length) * 100),
      sources: runs.reduce((a, r) => a + r.sources.length, 0),
    };
  }, [runs]);

  if (runs.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3 text-center">
        <div className="text-6xl font-black tracking-tighter text-th-text-muted">—</div>
        <div className="text-sm uppercase tracking-[0.2em] text-th-text-muted">
          No responses captured
        </div>
        <div className="max-w-sm text-sm text-th-text-secondary">
          Run prompts to start streaming AI model responses with brand-aware analysis.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ════════ HEADER STRIP ════════════════════════════════ */}
      {hero && (
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-th-border bg-th-border md:grid-cols-4">
          <HeroStat label="Avg Visibility" value={`${hero.avg}`} suffix="/100" big />
          <HeroStat
            label="Brand Coverage"
            value={`${hero.coverage}%`}
            sub={`${hero.mentioned} of ${runs.length}`}
          />
          <HeroStat label="Responses" value={runs.length.toLocaleString()} />
          <HeroStat label="Sources Cited" value={hero.sources.toLocaleString()} />
        </div>
      )}

      {/* ════════ COMMAND BAR ════════════════════════════════ */}
      <div className="sticky top-0 z-10 -mx-1 flex flex-col gap-2 rounded-xl border border-th-border bg-th-card/95 px-3 py-2.5 backdrop-blur">
        <div className="flex flex-wrap items-center gap-2">
          {/* search */}
          <div className="relative flex-1 min-w-[180px]">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-th-text-muted">
              ⌕
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search prompts, answers…"
              className="w-full rounded-lg border border-th-border bg-th-card-alt py-1.5 pl-8 pr-3 text-xs text-th-text outline-none placeholder:text-th-text-muted focus:border-th-accent focus:ring-2 focus:ring-th-ring"
            />
          </div>

          {/* provider pills */}
          <div className="flex flex-wrap gap-1">
            <FilterPill
              active={filterProvider === "all"}
              onClick={() => setFilterProvider("all")}
              label="All"
            />
            {ALL_PROVIDERS.map((p) => (
              <FilterPill
                key={p}
                active={filterProvider === p}
                onClick={() => setFilterProvider(p)}
                label={PROVIDER_LABELS[p]}
                dot={PROVIDER_TINT[p]}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-th-border-subtle pt-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-th-text-muted">
            Sentiment
          </span>
          {(["all", "positive", "neutral", "negative", "not-mentioned"] as const).map((s) => (
            <FilterPill
              key={s}
              active={filterSentiment === s}
              onClick={() => setFilterSentiment(s)}
              label={s.replace("-", " ")}
              dot={s !== "all" ? SENTIMENT_TINT[s] : undefined}
            />
          ))}
          <div className="ml-auto flex items-center gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-th-text-muted">
              Sort
            </span>
            <FilterPill
              active={sort === "date"}
              onClick={() => setSort("date")}
              label="Newest"
            />
            <FilterPill
              active={sort === "score"}
              onClick={() => setSort("score")}
              label="Top score"
            />
          </div>
        </div>

        <div className="text-[11px] tabular-nums text-th-text-muted">
          Streaming <span className="font-bold text-th-text">{visibleRuns.length}</span> of{" "}
          {runs.length} responses across {promptStats.length} prompts
        </div>
      </div>

      {/* ════════ FEED ════════════════════════════════════════ */}
      <div className="overflow-hidden rounded-xl border border-th-border bg-th-card">
        {visibleRuns.length === 0 ? (
          <div className="p-8 text-center text-sm text-th-text-muted">
            No responses match these filters.
          </div>
        ) : (
          <ul className="divide-y divide-th-border-subtle">
            {visibleRuns.map((run) => {
              const key = `${run.createdAt}|${run.provider}|${indexMap.get(run)}`;
              const isOpen = expanded.has(key);
              const tint = PROVIDER_TINT[run.provider];
              const delta = deltaMap.get(`${run.prompt}|||${run.provider}`);
              const text = normalize(run.answer ?? "");
              const isGarbage =
                !text ||
                text.toLowerCase().trim() === run.prompt.toLowerCase().trim() ||
                /^https?:\/\/\S+$/i.test(text.trim());
              const display = isGarbage ? "" : text;
              const preview = display.length > 220 ? display.slice(0, 220) + "…" : display;
              const uniqueSources = [...new Set(run.sources)];

              return (
                <li
                  key={key}
                  className="group relative transition-colors hover:bg-th-card-hover"
                >
                  {/* left accent strip */}
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-[3px]"
                    style={{ backgroundColor: tint }}
                  />
                  <button
                    onClick={() =>
                      setExpanded((prev) => {
                        const next = new Set(prev);
                        if (next.has(key)) next.delete(key);
                        else next.add(key);
                        return next;
                      })
                    }
                    className="flex w-full items-start gap-4 px-5 py-4 text-left"
                  >
                    {/* score column */}
                    <div className="flex w-14 shrink-0 flex-col items-start">
                      <span className="text-2xl font-bold tabular-nums leading-none text-th-text">
                        {run.visibilityScore ?? 0}
                      </span>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-th-text-muted">
                        /100
                      </span>
                      {delta != null && delta !== 0 && (
                        <span
                          className="mt-1 text-[11px] font-bold tabular-nums"
                          style={{
                            color: delta > 0 ? "var(--th-success)" : "var(--th-danger)",
                          }}
                        >
                          {delta > 0 ? "▲" : "▼"} {Math.abs(delta)}
                        </span>
                      )}
                    </div>

                    {/* main content */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span
                          className="rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                          style={{ backgroundColor: tint + "22", color: tint }}
                        >
                          {PROVIDER_LABELS[run.provider]}
                        </span>
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider"
                          style={{ color: SENTIMENT_TINT[run.sentiment ?? "neutral"] }}
                        >
                          <span
                            className="h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: SENTIMENT_TINT[run.sentiment ?? "neutral"] }}
                          />
                          {(run.sentiment ?? "neutral").replace("-", " ")}
                        </span>
                        {(run.brandMentions?.length ?? 0) > 0 && (
                          <span className="text-[10px] font-medium uppercase tracking-wider text-th-brand-text">
                            {run.brandMentions.length}× brand
                          </span>
                        )}
                        {(run.competitorMentions?.length ?? 0) > 0 && (
                          <span className="text-[10px] font-medium uppercase tracking-wider text-th-competitor-text">
                            {run.competitorMentions.length}× comp
                          </span>
                        )}
                        {uniqueSources.length > 0 && (
                          <span className="text-[10px] uppercase tracking-wider text-th-text-muted">
                            {uniqueSources.length} src
                          </span>
                        )}
                        <span className="ml-auto text-[10px] tabular-nums text-th-text-muted">
                          {relTime(run.createdAt)}
                        </span>
                      </div>

                      <div className="mb-1.5 line-clamp-1 text-sm font-semibold text-th-text">
                        {run.prompt}
                      </div>

                      {!isOpen && preview && (
                        <p className="line-clamp-2 text-[13px] leading-snug text-th-text-secondary">
                          <Highlight text={preview} brand={brandTerms} competitor={competitorTerms} />
                        </p>
                      )}
                    </div>
                  </button>

                  {/* expanded body */}
                  {isOpen && (
                    <div className="border-t border-th-border-subtle bg-th-card-alt px-5 py-4 pl-[88px]">
                      {display ? (
                        <div className="max-h-[440px] overflow-auto whitespace-pre-wrap break-words pr-2 text-[13.5px] leading-7 text-th-text">
                          <Highlight text={display} brand={brandTerms} competitor={competitorTerms} />
                        </div>
                      ) : (
                        <div className="italic text-sm text-th-text-muted">
                          No response text captured. Re-run the prompt to fetch fresh data.
                        </div>
                      )}

                      {uniqueSources.length > 0 && (
                        <div className="mt-4">
                          <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-th-text-muted">
                            Cited sources · {uniqueSources.length}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {uniqueSources.map((s) => {
                              let host = s;
                              try {
                                host = new URL(s).host.replace(/^www\./, "");
                              } catch {
                                /* keep raw */
                              }
                              return (
                                <a
                                  key={s}
                                  href={s}
                                  target="_blank"
                                  rel="noreferrer"
                                  title={s}
                                  className="inline-flex max-w-[260px] items-center gap-1 truncate rounded-md border border-th-border bg-th-card px-2 py-1 text-xs text-th-text-secondary transition-colors hover:border-th-accent hover:text-th-text-accent"
                                >
                                  <span className="text-th-text-muted">↗</span>
                                  <span className="truncate">{host}</span>
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {onDeleteRun && (
                        <div className="mt-4 flex justify-end">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const idx = indexMap.get(run);
                              if (idx == null) return;
                              if (window.confirm("Delete this response? This cannot be undone.")) {
                                onDeleteRun(idx);
                              }
                            }}
                            className="rounded-md border border-th-border bg-th-card px-2.5 py-1 text-[11px] font-medium text-th-text-muted transition-colors hover:border-th-danger hover:text-th-danger"
                          >
                            Delete response
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────── sub-components ─────────────────── */

function HeroStat({
  label,
  value,
  suffix,
  sub,
  big,
}: {
  label: string;
  value: string;
  suffix?: string;
  sub?: string;
  big?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 bg-th-card p-4">
      <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-th-text-muted">
        {label}
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className={`font-bold tabular-nums leading-none text-th-text ${
            big ? "text-4xl" : "text-2xl"
          }`}
        >
          {value}
        </span>
        {suffix && (
          <span className="text-sm font-medium text-th-text-muted">{suffix}</span>
        )}
      </div>
      {sub && <div className="text-[11px] text-th-text-muted">{sub}</div>}
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
  dot,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  dot?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize transition-colors ${
        active
          ? "border-th-accent bg-th-accent text-th-text-inverse"
          : "border-th-border bg-th-card-alt text-th-text-secondary hover:border-th-accent/40 hover:text-th-text"
      }`}
    >
      {dot && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: active ? "currentColor" : dot }}
        />
      )}
      {label}
    </button>
  );
}
