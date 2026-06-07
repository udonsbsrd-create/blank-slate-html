import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Search, BarChart3, Target, TrendingUp, Zap, Users, BrainCircuit } from "lucide-react";

export default function BrainstormLandingPage() {
  return (
    <div className="min-h-screen bg-[#fcfcfc] text-th-text font-sans selection:bg-th-accent selection:text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-th-accent flex items-center justify-center">
            <span className="text-white font-serif font-bold text-lg">A</span>
          </div>
          <span className="font-bold tracking-widest uppercase text-sm">Archdrift</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-th-text-secondary">
          <Link href="#how-it-works" className="hover:text-th-text transition-colors">How it Works</Link>
          <Link href="#features" className="hover:text-th-text transition-colors">Features</Link>
          <Link href="#pricing" className="hover:text-th-text transition-colors">Pricing</Link>
        </div>
        <div>
          <button className="bg-th-text text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-th-text-secondary transition-all">
            Book a Strategy Call <ArrowRight className="inline w-4 h-4 ml-1" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 pt-20 pb-24 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <div className="inline-block px-3 py-1 rounded-full border border-th-border text-xs font-bold tracking-widest text-th-accent bg-th-accent-soft uppercase">
            AI Visibility Intelligence
          </div>
          <h1 className="text-6xl md:text-7xl font-serif text-th-text leading-[1.1] tracking-tight">
            Know what AI <br/> says about <br/> your brand.
          </h1>
          <p className="text-lg text-th-text-secondary max-w-lg leading-relaxed">
            Archdrift doesn't just track your visibility—it builds your AEO strategy. Automatically generate buyer personas, discover high-intent prompts, and track how your brand appears across every major AI model.
          </p>
          <div className="flex items-center gap-4 pt-4">
            <button className="bg-th-accent text-white px-8 py-3.5 rounded-full font-medium hover:bg-[#08301F] transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
              Book a Strategy Call <ArrowRight className="w-4 h-4" />
            </button>
            <button className="text-th-text font-medium px-6 py-3.5 hover:text-th-accent transition-colors flex items-center gap-2">
              See How It Works <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-th-accent-soft to-transparent rounded-3xl transform rotate-3 scale-105 -z-10" />
          <div className="bg-white border border-th-border shadow-2xl rounded-2xl p-6 overflow-hidden">
            <div className="text-xs font-bold uppercase tracking-widest text-th-text-muted mb-2">Active Prompt</div>
            <div className="text-lg font-medium text-th-text mb-6">"Best digital marketing agencies in Mumbai"</div>
            
            <div className="flex justify-between items-center mb-4 text-xs font-medium text-th-text-secondary">
              <span>Running across 6 AI models</span>
              <span className="flex items-center gap-1 text-th-success"><CheckCircle2 className="w-3 h-3" /> Completed</span>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-8">
              {['ChatGPT', 'Gemini', 'Claude', 'Perplexity', 'Copilot'].map((model, i) => (
                <div key={model} className="border border-th-border rounded-lg p-3 text-center bg-th-bg">
                  <div className="w-6 h-6 mx-auto bg-th-border rounded mb-2"></div>
                  <div className="text-[10px] font-bold">{model}</div>
                  <div className={`text-[9px] mt-1 ${i < 3 ? 'text-th-success' : 'text-th-text-muted'}`}>
                    {i < 3 ? 'Mentioned' : 'Missed'}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-th-border pt-6">
              <div className="flex justify-between text-sm font-medium">
                <span>Archdrift</span>
                <span className="font-serif font-bold text-lg">92/100</span>
              </div>
              <div className="w-full bg-th-bg rounded-full h-2">
                <div className="bg-th-accent h-2 rounded-full w-[92%]"></div>
              </div>

              <div className="flex justify-between text-sm text-th-text-secondary pt-2">
                <span>Competitor A</span>
                <span className="font-serif font-bold text-lg">63/100</span>
              </div>
              <div className="w-full bg-th-bg rounded-full h-2">
                <div className="bg-th-border hover bg-th-text-muted h-2 rounded-full w-[63%]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Model Logos */}
      <section className="border-y border-th-border bg-white py-12">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-th-text-muted mb-8">Monitor every major AI Model</p>
          <div className="flex flex-wrap justify-center gap-12 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Using text placeholders since we don't have SVGs */}
            <span className="font-bold text-xl flex items-center gap-2"><div className="w-6 h-6 rounded-full bg-black"></div> ChatGPT</span>
            <span className="font-bold text-xl flex items-center gap-2"><div className="w-6 h-6 rounded bg-blue-500"></div> Gemini</span>
            <span className="font-bold text-xl flex items-center gap-2"><div className="w-6 h-6 rounded bg-orange-500"></div> Claude</span>
            <span className="font-bold text-xl flex items-center gap-2"><div className="w-6 h-6 rounded bg-cyan-500"></div> Perplexity</span>
          </div>
          <p className="text-sm font-medium text-th-text-secondary mt-8">One prompt. Infinite AI perspectives.</p>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-8 py-32">
        <div className="text-xs font-bold uppercase tracking-widest text-th-accent mb-12">How Archdrift Works</div>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            { icon: BrainCircuit, title: "1. Strategize", desc: "Our AI automatically generates buyer personas and discovers high-intent questions." },
            { icon: Search, title: "2. Analyze", desc: "We run those exact questions across all major AI models and collect every response." },
            { icon: BarChart3, title: "3. Understand", desc: "Get instant visibility scores, sentiment analysis, and competitor comparisons." },
            { icon: Target, title: "4. Improve", desc: "Use our AEO audits and citation mapping to increase your AI recommendations." }
          ].map((step, i) => (
            <div key={i} className="relative">
              <div className="w-12 h-12 rounded-2xl bg-th-brand-bg text-th-brand-text flex items-center justify-center mb-6">
                <step.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-th-text-secondary leading-relaxed">{step.desc}</p>
              {i < 3 && <ArrowRight className="hidden md:block absolute top-6 -right-6 text-th-border w-5 h-5" />}
            </div>
          ))}
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="bg-white border-y border-th-border py-20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-xs font-bold uppercase tracking-widest text-th-text-muted mb-12">What You Learn</div>
          <div className="grid md:grid-cols-4 gap-8 divide-x divide-th-border">
            {[
              { num: "78/100", label: "Average AI Visibility", sub: "Across all tracked models" },
              { num: "214", label: "Citation Opportunities", sub: "High-value domains to target" },
              { num: "7", label: "Competitors Outranking You", sub: "Across high-intent prompts" },
              { num: "12k+", label: "AI Responses Tracked", sub: "Historical drift data" }
            ].map((metric, i) => (
              <div key={i} className="pl-8 first:pl-0">
                <div className="font-serif text-5xl font-bold text-th-text mb-2">{metric.num}</div>
                <div className="font-bold text-sm text-th-text mb-1">{metric.label}</div>
                <div className="text-xs text-th-text-secondary">{metric.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-8 py-32">
        <div className="text-xs font-bold uppercase tracking-widest text-th-accent mb-12">Everything you need to win in AI Search</div>
        <div className="grid md:grid-cols-3 gap-x-8 gap-y-12">
          {[
            { icon: BrainCircuit, title: "Niche Explorer & Personas", desc: "Replace weeks of agency research. Let AI map your industry and generate targeted questions." },
            { icon: Search, title: "Prompt Hub", desc: "Track the exact questions your buyers are asking AI right now." },
            { icon: BarChart3, title: "Response Scoring", desc: "Auto-score every response for visibility, sentiment, and citations." },
            { icon: Users, title: "AI-Generated Battlecards", desc: "Stop reading endless responses. We reveal exactly why LLMs prefer your competitors." },
            { icon: Target, title: "Citations & Opportunities", desc: "See exactly which websites AI models cite—and find opportunities they don't." },
            { icon: Zap, title: "AEO Audit", desc: "Check if your site is structurally ready for AI ingestion (llms.txt, schema)." },
          ].map((feature, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-10 h-10 rounded-lg bg-th-bg flex items-center justify-center shrink-0">
                <feature.icon className="w-5 h-5 text-th-accent" />
              </div>
              <div>
                <h4 className="font-bold text-sm mb-2">{feature.title}</h4>
                <p className="text-xs text-th-text-secondary leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-th-accent text-white py-32 text-center">
        <div className="max-w-3xl mx-auto px-8">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">The AI visibility layer for modern brands.</h2>
          <p className="text-lg text-white/80 mb-10 max-w-xl mx-auto">
            Stop guessing what ChatGPT thinks of you. Track competitors, uncover opportunities, and influence the AI narrative.
          </p>
          <button className="bg-white text-th-accent px-8 py-4 rounded-full font-bold hover:bg-th-bg transition-all shadow-xl">
            Book a Strategy Call <ArrowRight className="inline w-4 h-4 ml-2" />
          </button>
          <p className="text-sm text-white/60 mt-6">No commitment. Just insights.</p>
        </div>
      </section>
    </div>
  );
}
