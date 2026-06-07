// Bento grid component

export function BentoGrid() {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Everything you need for AEO
          </h2>
          <p className="text-lg text-white/50 max-w-2xl mx-auto">
            Answer engines are the new search engines. Archdrift gives you the tools to monitor, audit, and optimize your brand&apos;s visibility across all of them.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          
          {/* Card 1: Multi-Model Tracking (Span 2) */}
          <div className="col-span-1 md:col-span-2 rounded-3xl border border-white/10 bg-[#111] p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 className="text-2xl font-bold text-white mb-2">Track 5 Models Simultaneously</h3>
            <p className="text-white/60 mb-8 max-w-md">
              Don&apos;t just rely on ChatGPT. Monitor how your brand performs across Perplexity, Gemini, Microsoft Copilot, and Google AI.
            </p>
            <div className="flex gap-4">
              {["chatgpt", "perplexity", "gemini", "copilot", "google_ai"].map((p) => (
                <div key={p} className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10 shadow-lg group-hover:border-white/20 transition-colors">
                  <span className="text-white text-xs font-bold uppercase">{p.slice(0,2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Drift Alerts */}
          <div className="col-span-1 rounded-3xl border border-white/10 bg-[#111] p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 className="text-2xl font-bold text-white mb-2">Drift Alerts</h3>
            <p className="text-white/60 mb-8">
              Get notified instantly via Slack or email when an AI model stops recommending your product.
            </p>
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-semibold text-red-400">Copilot Drift Detected</span>
              </div>
              <p className="text-xs text-white/70">Visibility score dropped from 85 to 42.</p>
            </div>
          </div>

          {/* Card 3: Citation Opportunities */}
          <div className="col-span-1 rounded-3xl border border-white/10 bg-[#111] p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h3 className="text-2xl font-bold text-white mb-2">Citation Opps</h3>
            <p className="text-white/60 mb-8">
              Discover which third-party sites AI models cite when they recommend your competitors instead of you.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-xs">
                <span className="text-white/80">g2.com</span>
                <span className="text-blue-400">12 citations</span>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2 text-xs">
                <span className="text-white/80">reddit.com</span>
                <span className="text-blue-400">8 citations</span>
              </div>
            </div>
          </div>

          {/* Card 4: SRO Analysis (Span 2) */}
          <div className="col-span-1 md:col-span-2 rounded-3xl border border-white/10 bg-[#111] p-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-white mb-2">Selection Rate Optimization</h3>
                <p className="text-white/60 mb-4">
                  Run our deep-dive SRO Analysis to see exactly how well your landing pages are grounded for AI. We check Gemini grounding, cross-platform SERP citations, and content gaps.
                </p>
                <div className="inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400 border border-green-500/20">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  88/100 SRO Score
                </div>
              </div>
              
              {/* Fake score ring */}
              <div className="w-32 h-32 relative flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#22c55e" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="30.14" strokeLinecap="round" />
                </svg>
                <span className="absolute text-3xl font-bold text-green-400">88</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
