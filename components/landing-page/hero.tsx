import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-600/20 rounded-full blur-[120px] -z-10 opacity-50 mix-blend-screen pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -z-10 opacity-50 mix-blend-screen pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-500 text-xs font-semibold tracking-wide uppercase mb-8">
          <span className="flex h-2 w-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-pulse" />
          The new standard for Answer Engine Optimization
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-4xl mx-auto">
          Stop flying blind in the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600">
            AI search era.
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
          Monitor how your brand is perceived across ChatGPT, Perplexity, Gemini, and Copilot. Detect drift, find citation opportunities, and optimize for Answer Engines.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
          <Link
            href="/sign-up"
            className="w-full sm:w-auto rounded-full bg-white text-black px-8 py-3.5 text-sm font-bold hover:bg-gray-100 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_35px_rgba(255,255,255,0.5)]"
          >
            Start tracking free
          </Link>
          <Link
            href="/demo"
            className="w-full sm:w-auto rounded-full border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors backdrop-blur-sm"
          >
            View interactive demo
          </Link>
        </div>

        {/* Dashboard Preview Mock */}
        <div className="relative mx-auto max-w-5xl rounded-2xl border border-white/10 bg-[#111] p-2 shadow-2xl shadow-black/50">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10 pointer-events-none" />
          <div className="rounded-xl border border-white/5 bg-[#0a0a0a] overflow-hidden relative">
            {/* Mock Header */}
            <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.02] px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <div className="mx-auto flex h-6 w-64 items-center justify-center rounded bg-white/5 text-[10px] text-white/40">
                app.archdrift.com
              </div>
            </div>
            
            {/* Mock Content */}
            <div className="p-6 md:p-10">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-white">AI Visibility Trend</h3>
                  <p className="text-sm text-white/50">Cross-platform brand perception</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#10a37f]"></span><span className="text-xs text-white/70">ChatGPT</span></div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#1ba1e3]"></span><span className="text-xs text-white/70">Perplexity</span></div>
                </div>
              </div>
              
              {/* Fake Chart Grid */}
              <div className="relative h-64 w-full border-b border-l border-white/10">
                <div className="absolute bottom-0 left-0 w-full h-full flex flex-col justify-between">
                  <div className="w-full border-t border-white/5 h-0" />
                  <div className="w-full border-t border-white/5 h-0" />
                  <div className="w-full border-t border-white/5 h-0" />
                  <div className="w-full border-t border-white/5 h-0" />
                </div>
                
                {/* Fake lines (SVG) */}
                <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,80 L20,70 L40,40 L60,45 L80,20 L100,10" fill="none" stroke="#10a37f" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  <path d="M0,90 L20,85 L40,60 L60,30 L80,25 L100,15" fill="none" stroke="#1ba1e3" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
