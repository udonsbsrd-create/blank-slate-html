import { useState } from "react";
import type { TaggedPrompt } from "../types";

type PromptHubTabProps = {
  customPrompts: TaggedPrompt[];
  brandName?: string;
  busy: boolean;
  activeProviderCount: number;
  onAddCustomPrompt: (value: string) => void;
  onRemoveCustomPrompt: (value: string, deleteResponses?: boolean) => void;
  onUpdatePromptTags: (text: string, tags: string[]) => void;
  onRunPrompt: (prompt: string) => void;
  onBatchRunAll: () => void;
};

export function PromptHubTab({
  customPrompts,
  brandName,
  busy,
  activeProviderCount,
  onAddCustomPrompt,
  onRemoveCustomPrompt,
  onUpdatePromptTags,
  onRunPrompt,
  onBatchRunAll,
}: PromptHubTabProps) {
  const [newPrompt, setNewPrompt] = useState("");
  const [tagDrafts, setTagDrafts] = useState<Record<string, string>>({});
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [openTagFor, setOpenTagFor] = useState<string | null>(null);

  const interpolateBrand = (value: string) => {
    if (!brandName?.trim()) return value;
    return value.replaceAll("{brand}", brandName.trim());
  };

  const allTags = Array.from(new Set(customPrompts.flatMap((p) => p.tags))).sort();
  const filteredPrompts = filterTag
    ? customPrompts.filter((p) => p.tags.includes(filterTag))
    : customPrompts;

  const totalRuns = customPrompts.length * activeProviderCount;

  function handleAddTag(promptText: string, tags: string[]) {
    const draft = (tagDrafts[promptText] ?? "").trim();
    if (!draft) return;
    if (!tags.includes(draft)) onUpdatePromptTags(promptText, [...tags, draft]);
    setTagDrafts((prev) => ({ ...prev, [promptText]: "" }));
  }

  function handleRemoveTag(promptText: string, tags: string[], tagToRemove: string) {
    onUpdatePromptTags(promptText, tags.filter((t) => t !== tagToRemove));
  }

  // Color-hash a tag deterministically
  const tagHue = (tag: string) => {
    let h = 0;
    for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) % 360;
    return h;
  };

  return (
    <div className="space-y-4">
      {/* ── Command header ── */}
      <div className="overflow-hidden rounded-2xl border border-th-border bg-gradient-to-br from-th-card via-th-card to-th-card-alt">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-th-border px-5 py-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-th-text-muted">
              Hunt Board · Tracking Prompts
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="font-mono text-4xl font-bold tabular-nums text-th-text">
                {customPrompts.length.toString().padStart(2, "0")}
              </span>
              <span className="text-sm text-th-text-muted">prompts ×</span>
              <span className="font-mono text-2xl font-semibold tabular-nums text-th-text-accent">
                {activeProviderCount}
              </span>
              <span className="text-sm text-th-text-muted">
                model{activeProviderCount > 1 ? "s" : ""} =
              </span>
              <span className="font-mono text-2xl font-bold tabular-nums text-th-text">
                {totalRuns}
              </span>
              <span className="text-sm text-th-text-muted">queries / sweep</span>
            </div>
          </div>
          {customPrompts.length > 0 && (
            <button
              disabled={busy}
              onClick={onBatchRunAll}
              className="group relative overflow-hidden rounded-xl bg-th-accent px-5 py-3 text-sm font-bold uppercase tracking-wider text-th-text-inverse shadow-lg transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-current" />
                Execute Sweep
                <span className="font-mono text-xs opacity-70">↵</span>
              </span>
            </button>
          )}
        </div>

        {/* Compose bar */}
        <div className="relative px-5 py-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-th-text-muted">+</span>
            <input
              value={newPrompt}
              onChange={(e) => setNewPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && newPrompt.trim()) {
                  onAddCustomPrompt(newPrompt);
                  setNewPrompt("");
                }
              }}
              placeholder="What query do you want to dominate? e.g. Best alternatives to {brand}"
              className="flex-1 border-0 border-b border-th-border bg-transparent py-2 text-sm text-th-text placeholder:text-th-text-muted focus:border-th-accent focus:outline-none focus:ring-0"
            />
            <button
              onClick={() => {
                if (!newPrompt.trim()) return;
                onAddCustomPrompt(newPrompt);
                setNewPrompt("");
              }}
              className="rounded-lg border border-th-border bg-th-card px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-th-text hover:border-th-accent hover:text-th-accent"
            >
              Track
            </button>
          </div>
          <p className="mt-2 pl-5 text-[11px] text-th-text-muted">
            Use <code className="rounded bg-th-card px-1 font-mono text-th-text-accent">{"{brand}"}</code> to auto-inject your brand name. Press <kbd className="rounded border border-th-border bg-th-card px-1 font-mono text-[10px]">↵</kbd> to add.
          </p>
        </div>

        {/* Tag rail */}
        {allTags.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto border-t border-th-border px-5 py-3">
            <span className="shrink-0 text-[10px] font-bold uppercase tracking-[0.2em] text-th-text-muted">Filter</span>
            <button
              onClick={() => setFilterTag(null)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                filterTag === null
                  ? "bg-th-text text-th-text-inverse"
                  : "border border-th-border text-th-text-secondary hover:border-th-text"
              }`}
            >
              ALL · {customPrompts.length}
            </button>
            {allTags.map((tag) => {
              const active = filterTag === tag;
              const hue = tagHue(tag);
              const count = customPrompts.filter((p) => p.tags.includes(tag)).length;
              return (
                <button
                  key={tag}
                  onClick={() => setFilterTag(active ? null : tag)}
                  className="shrink-0 rounded-full px-3 py-1 text-xs font-semibold transition-all"
                  style={{
                    background: active ? `hsl(${hue} 70% 50%)` : `hsl(${hue} 70% 50% / 0.08)`,
                    color: active ? "white" : `hsl(${hue} 70% 45%)`,
                    border: `1px solid hsl(${hue} 70% 50% / ${active ? 1 : 0.3})`,
                  }}
                >
                  #{tag} · {count}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Prompt cards ── */}
      {filteredPrompts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-th-border bg-th-card-alt/40 px-6 py-16 text-center">
          <div className="font-mono text-4xl text-th-text-muted opacity-30">⌖</div>
          <div className="mt-3 text-sm font-semibold text-th-text">
            {customPrompts.length === 0 ? "No targets locked." : "No prompts match this filter."}
          </div>
          <div className="mt-1 text-xs text-th-text-muted">
            {customPrompts.length === 0 ? "Add your first query above to start tracking." : "Clear the filter to see the full board."}
          </div>
        </div>
      ) : (
        <div className="grid gap-2">
          {filteredPrompts.map((item, index) => {
            const interpolated = interpolateBrand(item.text);
            const isOpen = openTagFor === item.text;
            return (
              <div
                key={`${item.text}-${index}`}
                className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-xl border border-th-border bg-th-card px-4 py-3 transition-all hover:border-th-accent/60 hover:shadow-md"
              >
                {/* Index */}
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-th-card-alt font-mono text-xs font-bold tabular-nums text-th-text-muted">
                  {(index + 1).toString().padStart(2, "0")}
                </div>

                {/* Body */}
                <div className="min-w-0">
                  <div className="line-clamp-2 text-sm font-medium leading-snug text-th-text">
                    {interpolated}
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                    {item.tags.map((tag) => {
                      const hue = tagHue(tag);
                      return (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{
                            background: `hsl(${hue} 70% 50% / 0.1)`,
                            color: `hsl(${hue} 70% 40%)`,
                          }}
                        >
                          #{tag}
                          <button
                            onClick={() => handleRemoveTag(item.text, item.tags, tag)}
                            className="opacity-50 hover:opacity-100"
                          >
                            ×
                          </button>
                        </span>
                      );
                    })}
                    {isOpen ? (
                      <input
                        autoFocus
                        value={tagDrafts[item.text] ?? ""}
                        onChange={(e) => setTagDrafts((p) => ({ ...p, [item.text]: e.target.value }))}
                        onBlur={() => {
                          handleAddTag(item.text, item.tags);
                          setOpenTagFor(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddTag(item.text, item.tags);
                            setOpenTagFor(null);
                          } else if (e.key === "Escape") setOpenTagFor(null);
                        }}
                        placeholder="tag"
                        className="w-20 rounded-full border border-th-accent bg-transparent px-2 py-0.5 text-[10px] font-semibold text-th-text focus:outline-none"
                      />
                    ) : (
                      <button
                        onClick={() => setOpenTagFor(item.text)}
                        className="text-[10px] font-semibold text-th-text-muted opacity-0 transition-opacity hover:text-th-text-accent group-hover:opacity-100"
                      >
                        + tag
                      </button>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onRunPrompt(interpolated)}
                    title="Run this prompt now"
                    className="rounded-lg bg-th-accent px-3 py-2 text-xs font-bold uppercase tracking-wider text-th-text-inverse transition-all hover:scale-105"
                  >
                    ▶ Fire
                  </button>
                  <button
                    onClick={() => onRemoveCustomPrompt(item.text)}
                    title="Remove from library"
                    className="rounded-lg border border-th-border px-2 py-2 text-xs text-th-text-muted opacity-0 transition-all hover:border-th-danger hover:text-th-danger group-hover:opacity-100"
                  >
                    ✕
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Remove this prompt AND delete all collected responses?")) {
                        onRemoveCustomPrompt(item.text, true);
                      }
                    }}
                    title="Remove + purge response data"
                    className="rounded-lg border border-th-border px-2 py-2 text-xs text-th-danger/60 opacity-0 transition-all hover:border-th-danger hover:bg-th-danger-soft hover:text-th-danger group-hover:opacity-100"
                  >
                    ⌫
                  </button>
                </div>

                {/* left accent strip */}
                <div className="pointer-events-none absolute left-0 top-2 bottom-2 w-0.5 rounded-r bg-gradient-to-b from-th-accent/0 via-th-accent to-th-accent/0 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
