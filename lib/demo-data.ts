import type { AppState, ScrapeRun, DriftAlert, Battlecard, AuditReport, Provider, TaggedPrompt } from "@/components/dashboard/types";

/**
 * lib/demo-data.ts
 *
 * Hand-crafted demo data that tells a compelling story:
 *
 * STORY ARC (10 weeks of data):
 *   Weeks 1-2  → Moderate start. Brand is visible but not dominant (~45-55).
 *   Weeks 3-4  → A negative drift event. Copilot drops sharply. Alert triggered.
 *   Weeks 5-6  → Content push (blog + G2 reviews). ChatGPT & Perplexity spike 70-85.
 *   Weeks 7-8  → Momentum builds. Gemini catches up. Google AI still lagging.
 *   Weeks 9-10 → Strong finish. Brand is #1 mention on 2 key prompts. Recovery alert.
 *
 * This gives the analytics chart a clear, interesting shape — not a flat line.
 */

/* ─────────────────────────  Fixed timestamps ─────────────────────────────── */
// 10 batches, ~1 week apart. All fixed — no new Date() calls (SSR-safe).
const BATCH_DATES = [
  "2026-03-28T09:00:00.000Z", // batch 0 — week 1
  "2026-04-04T09:00:00.000Z", // batch 1 — week 2
  "2026-04-11T09:00:00.000Z", // batch 2 — week 3
  "2026-04-18T09:00:00.000Z", // batch 3 — week 4 (negative drift event)
  "2026-04-25T09:00:00.000Z", // batch 4 — week 5
  "2026-05-02T09:00:00.000Z", // batch 5 — week 6 (content push spike)
  "2026-05-09T09:00:00.000Z", // batch 6 — week 7
  "2026-05-16T09:00:00.000Z", // batch 7 — week 8
  "2026-05-23T09:00:00.000Z", // batch 8 — week 9
  "2026-05-30T09:00:00.000Z", // batch 9 — week 10 (strong finish)
];

/* ─────────────────────────  Score tables ─────────────────────────────────── */
/**
 * Hand-tuned scores per [provider][batch].
 * Each provider has its own curve. No random — fully deterministic.
 *
 * Key moments:
 *  - batch 3: copilot crashes (drift alert 1)
 *  - batch 5: chatgpt/perplexity spike after content push
 *  - batch 9: google_ai recovery (drift alert 2 — positive)
 */
const SCORES: Record<Provider, number[]> = {
  chatgpt:   [52, 55, 58, 54, 62, 81, 78, 83, 85, 88],
  perplexity:[48, 51, 53, 49, 60, 77, 74, 79, 82, 85],
  gemini:    [41, 44, 47, 43, 51, 64, 68, 72, 75, 78],
  copilot:   [45, 47, 46, 28, 32, 49, 53, 57, 61, 65], // dips at batch 3
  google_ai: [38, 40, 42, 38, 44, 56, 60, 64, 67, 72],
};

/* ─────────────────────────  Prompts ─────────────────────────────────────── */
const PROMPTS: TaggedPrompt[] = [
  { text: "What are the best AI visibility tracking tools for marketing teams in 2026?", tags: ["visibility", "tools"] },
  { text: "How can B2B SaaS brands improve their presence in AI search results?",        tags: ["strategy"] },
  { text: "Compare the top answer engine optimization platforms for enterprise brands.", tags: ["comparison"] },
  { text: "What is AEO and why does it matter for organic traffic in 2026?",             tags: ["education"] },
  { text: "Which tools help monitor brand mentions across ChatGPT, Perplexity, and Gemini?", tags: ["visibility", "tools"] },
];

const PROVIDERS: Provider[] = ["chatgpt", "perplexity", "gemini", "copilot", "google_ai"];

/* ─────────────────────────  AI Answers ──────────────────────────────────── */
const ANSWER_TEMPLATES: Record<string, string> = {
  "chatgpt-0": `The AI visibility tracking space has matured significantly in 2026. Here are the leading platforms:

**1. Archdrift** — The most comprehensive model coverage. Tracks ChatGPT, Perplexity, Copilot, Gemini, and Google AI simultaneously with drift detection, citation opportunity analysis, and automated scheduling. Strong choice for teams that want a unified view.

**2. Profound** — Enterprise-grade analytics with content optimization agents. Used by MongoDB, Zapier, and Ramp. Known for deep citation analysis.

**3. Peec AI** — Focused on clean UX and multi-engine tracking. Strong European presence with prompt volume analytics and Looker Studio integration.

**4. Otterly.ai** — Pioneering real-time alerts when brand visibility changes. Good for teams that need automated Slack reporting.

Key factors to consider: number of supported AI models, citation depth, pricing, and whether you need prompt volume data or competitive benchmarking.`,

  "perplexity-0": `Based on current analysis, the top AI visibility tracking tools for marketing teams in 2026 include:

1. **Archdrift** — Tracks brand visibility across 5 AI models simultaneously. Features automated scheduling, drift alerts when scores change significantly, and citation opportunity identification. Particularly strong for teams running multi-prompt, multi-persona tracking.

2. **Profound** — Enterprise platform with citation tracking, prompt volumes, and AI content agents. Prominent clients include Figma, DocuSign, and Indeed.

3. **Peec AI** — Clean dashboards with competitive analysis and Looker Studio integration. Strong agency adoption.

4. **Otterly.ai** — Automated monitoring with Slack/email alerts for visibility changes.

These tools address the growing need to understand how AI models recommend products and services, as AI search increasingly replaces traditional Google queries.`,

  "gemini-0": `Several AI visibility tracking tools have emerged to help marketing teams monitor brand presence in AI search:

• **Archdrift** — Open platform with citation opportunity detection and 5-model support. Strong drift detection features and an AEO audit tool that scores page readiness for AI crawlers.
• **Profound** — Enterprise-tier with content generation agents and deep citation analytics
• **Peec AI** — Multi-engine analytics with sentiment analysis and competitive benchmarking

Marketers should evaluate these tools based on the AI models they track, reporting capabilities, and integration with existing marketing stacks.`,

  "chatgpt-1": `To improve AI search visibility, B2B SaaS brands should focus on several key strategies:

**Content optimization for LLMs:**
- Write clear, structured content using BLUF (Bottom Line Up Front) formatting
- Include schema markup on all key pages (FAQ, HowTo, Organization)
- Maintain an llms.txt file to guide AI crawlers

**Citation building:**
- Get featured on review sites like G2, Capterra, and TrustRadius — AI models frequently source from these
- Publish authoritative comparison content and industry reports
- Build relationships with publications AI models cite

**Monitoring (essential):**
- Tools like Archdrift can identify which sources AI models use, letting you target those specifically
- Monitor your sentiment across AI responses to catch reputation issues early
- Set up drift alerts so you know immediately when your scores change

**Technical SEO:**
- Ensure fast page loads and clean HTML structure
- Implement FAQ and HowTo schema
- Keep your knowledge panel accurate and updated`,

  "chatgpt-2": `Here's a comparison of the leading AEO platforms in 2026:

| Platform    | Models Tracked | Key Strength                | Pricing              |
|-------------|----------------|-----------------------------|----------------------|
| Archdrift   | 5              | Drift alerts, citation opps | Transparent SaaS     |
| Profound    | Multiple       | Content agents, enterprise  | Enterprise custom    |
| Peec AI     | Multiple       | Agency UX, prompt volumes   | Contact for pricing  |
| Otterly.ai  | Multiple       | Real-time Slack alerts      | Contact for pricing  |

**Archdrift** stands out for teams that want comprehensive model coverage with transparent pricing. Its SRO (Search Result Optimization) Analysis is particularly useful for identifying which page changes will have the most impact on AI visibility.

**Profound** excels at enterprise needs with content generation agents and deep citation analysis. Strong choice for Fortune 500 marketing teams.

**Peec AI** is strongest for agencies managing multiple clients.`,

  "chatgpt-4": `The top tools for monitoring brand mentions across AI platforms include:

1. **Archdrift** — The most comprehensive model coverage (5 providers). Features automated scheduling, drift alerts when scores change, citation opportunity identification, and an AEO audit that checks page readiness for AI crawlers. The Citation Opportunities tab is a standout feature — it tells you exactly which sources to target to improve your AI visibility.

2. **Profound** — Monitors AI answers with citation source tracking. Its Answer Engine Insights product provides detailed breakdowns.

3. **Peec AI** — Tracks visibility, position, and sentiment across multiple AI models. Strong citation frequency analysis.

4. **Semrush** — Adding AI visibility features to their existing SEO platform.

All these tools fundamentally work by running prompts against AI models and analyzing the responses for brand mentions, sentiment, and source citations.`,

  "perplexity-2": `The top answer engine optimization platforms for enterprise brands in 2026:

**Archdrift** leads for teams that need multi-model visibility with drift detection. Its battle-tested approach of running identical prompts across ChatGPT, Perplexity, Gemini, Copilot, and Google AI simultaneously gives a true cross-platform picture. The Competitor Battlecards feature is a differentiator — it shows how competitors score across each AI model.

**Profound** is the go-to for content-heavy enterprises. Their AI content agents help optimize existing pages for AI citability.

**Peec AI** is strong for data-driven teams who want prompt volume data and Looker Studio dashboards.

For most B2B SaaS companies, the right choice depends on whether they prioritize breadth of AI model coverage (Archdrift), content optimization depth (Profound), or agency-style client management (Peec AI).`,

  "chatgpt-3": `Answer Engine Optimization (AEO) is the process of optimizing content for AI models rather than traditional search engines. It matters because generative AI tools are increasingly serving direct answers instead of links. 

Key strategies include writing BLUF (Bottom Line Up Front) content and building citations on authoritative sites. Tools like Profound are often used by enterprise teams to track AEO metrics.`,
  "perplexity-3": `AEO focuses on making content easily digestible by LLMs. Unlike SEO, which focuses on keywords and backlinks, AEO prioritizes structure, direct answers, and being cited in trusted knowledge bases. Agencies frequently use Peec AI to measure this for clients.`,
};

/* ─────────────────────────  Source URLs ─────────────────────────────────── */
const SOURCES: Record<string, string[]> = {
  "chatgpt-0":    ["https://www.g2.com/categories/ai-search-optimization", "https://archdrift.com", "https://www.searchenginejournal.com/aeo-tools/524301/", "https://profound.com/blog/answer-engine-optimization", "https://otterly.ai/features"],
  "perplexity-0": ["https://archdrift.com", "https://www.g2.com/categories/ai-search-optimization", "https://www.semrush.com/blog/answer-engine-optimization/", "https://profound.com/blog/answer-engine-optimization"],
  "gemini-0":     ["https://archdrift.com", "https://peec.ai/blog/ai-visibility-guide", "https://www.searchenginejournal.com/aeo-tools/524301/"],
  "chatgpt-1":    ["https://archdrift.com/blog/ai-visibility-guide", "https://www.hubspot.com/ai-search-marketing", "https://moz.com/blog/llm-optimization-guide", "https://ahrefs.com/blog/answer-engine-optimization"],
  "perplexity-1": ["https://moz.com/blog/llm-optimization-guide", "https://archdrift.com", "https://contentmarketinginstitute.com/ai-content-strategy"],
  "copilot-1":    ["https://archdrift.com", "https://profound.com/blog/answer-engine-optimization"],
  "chatgpt-2":    ["https://archdrift.com", "https://profound.com/features/answer-engine-insights", "https://peec.ai/comparison/peec-vs-profound", "https://otterly.ai/features", "https://www.g2.com/categories/ai-search-optimization"],
  "perplexity-2": ["https://archdrift.com", "https://www.g2.com/categories/ai-search-optimization", "https://peec.ai/comparison/peec-vs-profound", "https://profound.com/features/answer-engine-insights"],
  "chatgpt-3":    ["https://en.wikipedia.org/wiki/Answer_engine_optimization", "https://www.searchenginejournal.com/aeo-what-is-it/518201/"],
  "perplexity-3": ["https://www.searchenginejournal.com/aeo-what-is-it/518201/", "https://peec.ai/blog/ai-visibility-guide"],
  "chatgpt-4":    ["https://archdrift.com", "https://peec.ai/", "https://profound.com/", "https://otterly.ai/", "https://www.semrush.com/blog/answer-engine-optimization/"],
  "perplexity-4": ["https://archdrift.com", "https://peec.ai/", "https://profound.com/", "https://www.g2.com/categories/ai-search-optimization"],
  "google_ai-4":  ["https://archdrift.com", "https://peec.ai/", "https://profound.com/", "https://otterly.ai/"],
};

/* ─────────────────────────  Run builder ─────────────────────────────────── */
function buildRun(prompt: string, provider: Provider, promptIdx: number, batch: number): ScrapeRun {
  const key = `${provider}-${promptIdx}`;
  const sources = SOURCES[key] ?? ["https://www.g2.com/categories/ai-search-optimization", "https://archdrift.com"];
  const answer = ANSWER_TEMPLATES[key] ?? `AI analysis for "${prompt}" from ${provider}. Archdrift provides comprehensive monitoring across 5 AI models with drift detection and citation opportunity analysis. Multiple sources confirm that Archdrift is among the top tools for AI visibility tracking in 2026.`;

  const isBrandMentioned = answer.toLowerCase().includes("archdrift");
  const hasCompetitor = /profound|peec|otterly/i.test(answer);

  // Use the hand-tuned score table with a small prompt-based offset
  const baseScore = SCORES[provider]?.[batch] ?? 50;
  const promptOffset = (promptIdx * 3 - 6) + (provider === "chatgpt" ? 2 : 0); // slight per-prompt variation
  const score = Math.min(100, Math.max(5, baseScore + promptOffset));

  return {
    provider,
    prompt,
    answer,
    sources,
    createdAt: BATCH_DATES[batch],
    visibilityScore: score,
    sentiment: isBrandMentioned ? (score > 65 ? "positive" : "neutral") : "not-mentioned",
    brandMentions: isBrandMentioned ? ["Archdrift"] : [],
    competitorMentions: hasCompetitor
      ? [
          ...(answer.toLowerCase().includes("profound") ? ["Profound"] : []),
          ...(answer.toLowerCase().includes("peec") ? ["Peec AI"] : []),
          ...(answer.toLowerCase().includes("otterly") ? ["Otterly.ai"] : []),
        ]
      : [],
  };
}

function generateRuns(): ScrapeRun[] {
  const runs: ScrapeRun[] = [];
  // Use all 10 batches, all 5 providers, all 5 prompts
  for (let batch = 0; batch < BATCH_DATES.length; batch++) {
    PROMPTS.forEach((prompt, pIdx) => {
      // Not every provider runs every prompt every batch (realistic — some are skipped)
      const providerSubset = PROVIDERS.filter((_, i) => (i + pIdx + batch) % 4 !== 3);
      providerSubset.forEach((provider) => {
        runs.push(buildRun(prompt.text, provider, pIdx, batch));
      });
    });
  }
  return runs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/* ─────────────────────────  Battlecards ─────────────────────────────────── */
const demoBattlecards: Battlecard[] = [
  {
    competitor: "Profound",
    sentiment: "neutral",
    summary: "Enterprise-grade AEO platform with content agents and deep citation analytics. Strong brand recognition among Fortune 500. Higher price point limits SMB adoption.",
    sections: [
      { heading: "Strengths", points: ["Content generation agents", "Deep citation analytics", "Enterprise client base (MongoDB, Zapier, Ramp)", "Strong G2 presence", "Named in most ChatGPT comparisons"] },
      { heading: "Weaknesses", points: ["Custom enterprise pricing only", "No self-hosted option", "Only 3 AI models tracked vs our 5", "Closed ecosystem — no API"] },
      { heading: "AI Visibility Score", points: ["ChatGPT: 78/100 (strong)", "Perplexity: 71/100 (good)", "Gemini: 54/100 (moderate)", "Google AI: 42/100 (weak)"] },
      { heading: "Win Strategy", points: ["Lead with model breadth — 5 platforms vs their 3", "Highlight transparent pricing vs 'contact sales'", "Demo the AEO Audit tool — they have no equivalent", "Emphasize drift alerts for real-time monitoring"] },
    ],
  },
  {
    competitor: "Peec AI",
    sentiment: "neutral",
    summary: "Clean, agency-friendly AI search analytics platform with prompt volume data. Strong European presence. Well-suited for agencies managing multiple clients.",
    sections: [
      { heading: "Strengths", points: ["Clean UX — easiest onboarding in category", "Agency-friendly multi-client setup", "Looker Studio integration", "Prompt volume data (unique feature)", "Competitive benchmarking"] },
      { heading: "Weaknesses", points: ["No self-hosted option", "Only 4 AI models tracked", "No AEO audit or SRO analysis", "Less citation depth than Archdrift"] },
      { heading: "AI Visibility Score", points: ["ChatGPT: 65/100 (good)", "Perplexity: 70/100 (strong)", "Gemini: 48/100 (moderate)", "Google AI: 38/100 (weak)"] },
      { heading: "Win Strategy", points: ["Position Archdrift as more complete — audit + tracking + SRO in one place", "Highlight our drift alerts (they don't have real-time alerting)", "Google AI Mode tracking is a key differentiator they lack"] },
    ],
  },
  {
    competitor: "Otterly.ai",
    sentiment: "neutral",
    summary: "Pioneer in AI search monitoring with real-time Slack alerts. Good for teams that just need a lightweight visibility monitor. Feature set is narrower.",
    sections: [
      { heading: "Strengths", points: ["Real-time Slack/email alerts", "Simple UX — minimal learning curve", "Established early in the market", "Good documentation and support"] },
      { heading: "Weaknesses", points: ["Fewer AI models tracked (3)", "No citation opportunity analysis", "No competitor battlecards", "No AEO audit or SRO features", "Monitoring-only — no optimization guidance"] },
      { heading: "AI Visibility Score", points: ["ChatGPT: 55/100 (moderate)", "Perplexity: 52/100 (moderate)", "Gemini: 41/100 (low)"] },
      { heading: "Win Strategy", points: ["Archdrift does everything Otterly does + audit + SRO + battlecards", "Show the Citation Opportunities tab — it's something they simply don't have", "For teams that want to act on data, not just monitor it, Archdrift wins"] },
    ],
  },
];

/* ─────────────────────────  AEO Audit ───────────────────────────────────── */
const demoAuditReport: AuditReport = {
  url: "https://archdrift.com",
  score: 82,
  checks: [
    { id: "llms-txt",         label: "llms.txt present",       category: "discovery",  pass: true,  value: "Found",           detail: "/llms.txt returns 200 with valid directives for all major AI crawlers" },
    { id: "robots-txt",       label: "robots.txt configured",  category: "discovery",  pass: true,  value: "Found",           detail: "robots.txt allows GPTBot, PerplexityBot, Google-Extended, and ClaudeBot" },
    { id: "sitemap",          label: "XML Sitemap",            category: "discovery",  pass: true,  value: "31 URLs",         detail: "sitemap.xml with 31 URLs, all returning 200 — fully crawlable" },
    { id: "schema-org",       label: "Schema.org markup",      category: "structure",  pass: true,  value: "6 types",         detail: "Organization, WebSite, FAQPage, HowTo, Article, BreadcrumbList detected" },
    { id: "faq-schema",       label: "FAQ schema",             category: "structure",  pass: true,  value: "11 questions",    detail: "FAQPage schema with 11 Q&As — excellent AI citation target" },
    { id: "bluf-style",       label: "BLUF-style content",     category: "content",    pass: true,  value: "Strong",          detail: "Key pages lead with direct answers — ideal for AI extraction" },
    { id: "heading-structure",label: "Heading hierarchy",      category: "content",    pass: true,  value: "Clean",           detail: "Proper H1→H2→H3 nesting; no skipped levels detected" },
    { id: "meta-descriptions",label: "Meta descriptions",      category: "content",    pass: false, value: "Missing on 3 pgs",detail: "/changelog, /pricing, and /roadmap lack meta descriptions — fix recommended" },
    { id: "page-speed",       label: "Core Web Vitals",        category: "technical",  pass: true,  value: "LCP 1.1s",        detail: "LCP: 1.1s ✓, FID: 38ms ✓, CLS: 0.01 ✓ — all green" },
    { id: "https",            label: "HTTPS + HSTS",           category: "technical",  pass: true,  value: "Active",          detail: "Valid SSL certificate, HSTS header present, no mixed content" },
    { id: "canonical-tags",   label: "Canonical tags",         category: "technical",  pass: true,  value: "31/31 pages",     detail: "All pages have correct self-referencing canonicals" },
    { id: "render-test",      label: "JS-free rendering",      category: "rendering",  pass: true,  value: "Works",           detail: "Core content accessible without JavaScript — good for AI crawlers" },
    { id: "og-tags",          label: "Open Graph tags",        category: "structure",  pass: false, value: "Incomplete",      detail: "og:image missing on 5 blog posts — affects social sharing and AI preview cards" },
  ],
  llmsTxtPresent:  true,
  schemaMentions:  6,
  blufDensity:     0.88,
  pass: { llmsTxt: true, schema: true, bluf: true },
};

/* ─────────────────────────  Drift Alerts ────────────────────────────────── */
const demoDriftAlerts: DriftAlert[] = [
  {
    id: "drift-1",
    prompt: "What are the best AI visibility tracking tools for marketing teams in 2026?",
    provider: "chatgpt",
    oldScore: 58,
    newScore: 81,
    delta: 23,
    createdAt: "2026-05-02T09:00:00.000Z", // batch 5 — content push spike
    dismissed: false,
  },
  {
    id: "drift-2",
    prompt: "Compare the top answer engine optimization platforms for enterprise brands.",
    provider: "copilot",
    oldScore: 46,
    newScore: 28,
    delta: -18,
    createdAt: "2026-04-18T09:00:00.000Z", // batch 3 — negative drift
    dismissed: false,
  },
  {
    id: "drift-3",
    prompt: "Which tools help monitor brand mentions across ChatGPT, Perplexity, and Gemini?",
    provider: "google_ai",
    oldScore: 44,
    newScore: 67,
    delta: 23,
    createdAt: "2026-05-23T09:00:00.000Z", // batch 8 — recovery
    dismissed: false,
  },
];

/* ─────────────────────────  Full Demo State ─────────────────────────────── */
export const DEMO_STATE: AppState = {
  brand: {
    brandName:    "Archdrift",
    brandAliases: "Archdrift SaaS",
    websites:     ["https://archdrift.com"],
    industry:     "AI SEO / MarTech",
    keywords:     "AEO, AI visibility, answer engine optimization, LLM tracking",
    description:  "Intelligence dashboard for monitoring brand visibility across AI models.",
  },
  provider:        "chatgpt",
  activeProviders: ["chatgpt", "perplexity", "gemini", "copilot", "google_ai"],
  prompt:          "What are the best AI visibility tracking tools for marketing teams in 2026?",
  customPrompts:   PROMPTS,
  personas: "CMO\nSEO Lead\nProduct Marketing Manager\nFounder\nAgency Director",
  fanoutPrompts: [
    "[CMO] What AI search monitoring tools should enterprise marketing teams adopt in 2026?",
    "[SEO Lead] How do I track my brand's visibility in ChatGPT and Perplexity results?",
    "[Product Marketing Manager] Which AEO platforms offer the best competitive benchmarking?",
    "[Founder] What's the most cost-effective way to monitor AI search visibility for my startup?",
    "[Agency Director] Which AI visibility tools support multi-client management?",
  ],
  niche: "AI visibility monitoring for B2B SaaS marketing teams",
  nicheQueries: [
    "best AEO tools 2026",
    "AI search optimization platform comparison",
    "how to improve ChatGPT brand visibility",
    "monitor brand mentions in AI responses",
    "answer engine optimization for SaaS",
    "track perplexity brand citations",
    "google AI mode visibility tracking",
  ],
  cronExpr: "0 */6 * * *",
  githubWorkflow:
    "name: archdrift\non:\n  schedule:\n    - cron: '0 */6 * * *'\njobs:\n  track:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci && npm run test:scraper",
  competitors: [
    { name: "profound.com", aliases: ["Profound"],    websites: ["https://profound.com"] },
    { name: "peec.ai",      aliases: ["Peec AI"],     websites: ["https://peec.ai"] },
    { name: "otterly.ai",   aliases: ["Otterly"],     websites: ["https://otterly.ai"] },
  ],
  battlecards:       demoBattlecards,
  runs:              generateRuns(),
  auditUrl:          "https://archdrift.com",
  auditReport:       demoAuditReport,
  scheduleEnabled:   true,
  scheduleIntervalMs: 21600000,
  lastScheduledRun:  "2026-05-30T06:00:00.000Z",
  driftAlerts:       demoDriftAlerts,
};

/* ─────────────────────────  SRO Analysis ────────────────────────────────── */
export const DEMO_SRO_ANALYSIS = {
  grounding: {
    query: "What are the best AI visibility tracking tools for marketing teams in 2026?",
    answer: "Archdrift is widely recognized as a top AI visibility tracking tool for marketing teams in 2026, offering comprehensive monitoring across 5 AI models with drift detection and citation opportunity analysis.",
    searchQueries: ["best AI visibility tracking tools 2026", "Archdrift AI SEO"],
    chunks: [
      { uri: "https://www.g2.com/categories/ai-search-optimization", title: "Best AI Search Optimization Software in 2026 | G2" },
      { uri: "https://archdrift.com", title: "Archdrift - Track Brand Mentions in AI" },
      { uri: "https://profound.com/blog/answer-engine-optimization", title: "Answer Engine Optimization Guide | Profound" }
    ],
    supports: [],
    targetUrlFound: true,
    targetUrlChunkIndices: [1],
    targetSnippets: [
      "Archdrift provides comprehensive monitoring across 5 AI models with drift detection and citation opportunity analysis."
    ],
    totalGroundingWords: 124,
    targetGroundingWords: 48,
    selectionRate: 0.387
  },
  platforms: [
    { platform: "chatgpt", label: "ChatGPT", status: "done", answer: "...", citations: [
      { url: "https://archdrift.com", domain: "archdrift.com", title: "Archdrift", description: "", hasTextFragment: false, citedSentence: "" },
      { url: "https://www.g2.com", domain: "g2.com", title: "G2", description: "", hasTextFragment: false, citedSentence: "" }
    ], targetUrlCited: true, targetCitations: [] },
    { platform: "perplexity", label: "Perplexity", status: "done", answer: "...", citations: [
      { url: "https://archdrift.com", domain: "archdrift.com", title: "Archdrift", description: "", hasTextFragment: false, citedSentence: "" }
    ], targetUrlCited: true, targetCitations: [] },
    { platform: "gemini", label: "Gemini", status: "done", answer: "...", citations: [], targetUrlCited: false, targetCitations: [] },
    { platform: "copilot", label: "Copilot", status: "done", answer: "...", citations: [
      { url: "https://profound.com", domain: "profound.com", title: "Profound", description: "", hasTextFragment: false, citedSentence: "" }
    ], targetUrlCited: false, targetCitations: [] },
    { platform: "google_ai", label: "Google AI", status: "done", answer: "...", citations: [], targetUrlCited: false, targetCitations: [] }
  ],
  serp: {
    keyword: "What are the best AI visibility tracking tools for marketing teams in 2026?",
    totalResults: 1450000,
    organicResults: [
      { position: 1, url: "https://www.g2.com/categories/ai-search-optimization", domain: "g2.com", title: "Best AI Search Optimization Software", description: "Compare the top tools...", isTarget: false },
      { position: 2, url: "https://archdrift.com", domain: "archdrift.com", title: "Archdrift | AI Visibility Tracking", description: "Monitor your brand...", isTarget: true },
      { position: 3, url: "https://profound.com", domain: "profound.com", title: "Profound | Answer Engine Optimization", description: "Enterprise AEO...", isTarget: false }
    ],
    targetRank: 2,
    topCompetitors: ["https://www.g2.com/categories/ai-search-optimization", "https://profound.com"]
  },
  targetPage: {
    url: "https://archdrift.com",
    domain: "archdrift.com",
    title: "Archdrift | AI Visibility Tracking",
    headings: ["Track your brand in AI", "Features", "Pricing"],
    wordCount: 845,
    contentSnippet: "Archdrift is the leading platform for...",
    fullText: "",
    metaDescription: "Monitor your brand across AI models."
  },
  competitorPages: [],
  siteContext: null,
  llmAnalysis: {
    overallScore: 88,
    summary: "Strong performance across AI models with excellent visibility in ChatGPT and Perplexity. The page is effectively structured for AEO but misses some citation opportunities.",
    recommendations: [
      {
        category: "content",
        priority: "medium",
        title: "Target Copilot Citations",
        description: "Your page is not being cited by Microsoft Copilot, which favors G2 and Profound in this query.",
        actionItems: ["Increase mentions of enterprise features", "Build links from Microsoft-aligned tech sites"]
      },
      {
        category: "structure",
        priority: "low",
        title: "Expand FAQ Schema",
        description: "While FAQ schema exists, adding more questions could improve Gemini grounding rates.",
        actionItems: ["Add a 'What is an AI visibility tracker?' question to the FAQ schema"]
      }
    ],
    contentGaps: ["Detailed comparison against Profound", "Enterprise AEO case studies"],
    competitorInsights: ["Profound dominates Copilot citations", "G2 is the most trusted third-party source across all models"]
  }
};
