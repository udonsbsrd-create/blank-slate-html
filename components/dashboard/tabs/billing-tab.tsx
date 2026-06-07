"use client";

import { useEffect, useState } from "react";
import { CreditCard, Clock, Activity } from "lucide-react";

type UsageEvent = {
  id: string;
  action: string;
  credits_cost: number;
  created_at: string;
  metadata?: any;
};

function formatActionInfo(event: UsageEvent) {
  let title = event.action.replace(/_/g, " ");
  let subtitle = "";

  switch (event.action) {
    case "analyze":
      title = "AI Model Generation";
      subtitle = event.metadata?.prompt ? `Prompt: "${event.metadata.prompt}"` : "";
      break;
    case "scrape":
      title = "SERP Target Analysis";
      subtitle = event.metadata?.prompt ? `Keyword: "${event.metadata.prompt}"` : "";
      break;
    case "unlocker":
      title = "Deep Content Extraction";
      if (event.metadata?.url) {
        try {
          subtitle = `Target: ${new URL(event.metadata.url).hostname}`;
        } catch {
          subtitle = `Target: ${event.metadata.url}`;
        }
      }
      break;
    case "brightdata_platforms":
      title = "Platform Discovery Scan";
      subtitle = "Identified external platform citations";
      break;
    case "audit":
      title = "AEO Readiness Audit";
      subtitle = event.metadata?.url ? `Analyzed: ${event.metadata.url}` : "";
      break;
    case "sro_pipeline":
      title = "SRO Pipeline Execution";
      subtitle = event.metadata?.prompt ? `Pipeline for: "${event.metadata.prompt}"` : "";
      break;
    case "battlecards":
      title = "Battlecard Generation";
      subtitle = event.metadata?.competitor ? `Competitor: ${event.metadata.competitor}` : "";
      break;
    case "niche_queries":
      title = "Niche Query Generation";
      subtitle = event.metadata?.niche ? `Niche: ${event.metadata.niche}` : "";
      break;
    default:
      title = event.action.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  }
  
  if (!subtitle && event.metadata?.provider) {
    subtitle = `Provider: ${event.metadata.provider}`;
  }
  
  return { title, subtitle };
}

export function BillingTab() {
  const [history, setHistory] = useState<UsageEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/usage-history")
      .then((res) => res.json())
      .then((data) => {
        if (data.history) setHistory(data.history);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bd-panel p-6 rounded-xl flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif text-th-text flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-th-accent" /> Billing & Usage
          </h2>
          <p className="text-th-text-secondary mt-1">Review your recent credit spending history.</p>
        </div>
      </div>

      <div className="bd-panel rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-th-border bg-th-card-alt flex items-center justify-between">
          <h3 className="font-medium text-th-text flex items-center gap-2">
            <Clock className="w-4 h-4 text-th-text-muted" /> Recent Activity
          </h3>
        </div>
        <div className="p-0">
          {loading ? (
            <div className="p-8 text-center text-th-text-muted">Loading history...</div>
          ) : history.length === 0 ? (
            <div className="p-8 text-center text-th-text-muted">No usage history found.</div>
          ) : (
            <div className="divide-y divide-th-border">
              {history.map((event) => {
                const { title, subtitle } = formatActionInfo(event);
                return (
                  <div key={event.id} className="p-4 px-6 flex items-center justify-between hover:bg-th-card-hover transition-colors">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-th-brand-bg flex-shrink-0 flex items-center justify-center text-th-brand-text">
                        <Activity className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 pr-4">
                        <p className="font-medium text-th-text capitalize truncate">{title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-sm text-th-text-muted whitespace-nowrap">{new Date(event.created_at).toLocaleString()}</p>
                          {subtitle && (
                            <>
                              <span className="text-th-border">•</span>
                              <p className="text-sm text-th-text-secondary truncate" title={subtitle}>{subtitle}</p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 pl-2">
                      <span className="font-mono text-th-danger-soft text-th-danger px-2.5 py-1 rounded-md text-sm font-semibold">
                        -{event.credits_cost} cr
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
