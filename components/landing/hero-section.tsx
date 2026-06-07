import { ArrowRight, Sparkles, BarChart3, Target } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-orange-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm text-purple-300 mb-8 backdrop-blur-sm">
          <Sparkles className="w-4 h-4" />
          <span>The visibility tracker for the AI era</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
          Track how AI models <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400">
            see your brand.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Stop guessing. Archdrift tracks your visibility score, citations, and sentiment across ChatGPT, Claude, and Gemini in real-time. Benchmark against competitors and own your presence in AI answers.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
            Start tracking for free
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white rounded-full font-semibold hover:bg-white/10 transition-colors">
            Book a Demo
          </button>
        </div>

        {/* Floating Feature Pills */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2"><BarChart3 className="w-4 h-4" /> 0-100 Visibility Scoring</div>
          <div className="flex items-center gap-2"><Target className="w-4 h-4" /> Competitor Benchmarking</div>
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            Cross-Model Tracking
          </div>
        </div>
      </div>
    </section>
  );
}
