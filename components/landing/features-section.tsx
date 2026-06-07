import { LineChart, Search, Link2, ShieldAlert } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: <LineChart className="w-6 h-6 text-purple-400" />,
      title: "Visibility Analytics",
      description: "Get a clear 0-100 visibility score across ChatGPT, Claude, and Gemini. Track how often you are recommended for commercial keywords over time."
    },
    {
      icon: <Link2 className="w-6 h-6 text-orange-400" />,
      title: "Citation Opportunities",
      description: "See exactly which domains AI models are citing when they mention your competitors. Find the gaps and prioritize your PR and SEO outreach."
    },
    {
      icon: <Search className="w-6 h-6 text-blue-400" />,
      title: "SRO & Prompt Tracking",
      description: "Deploy automated prompts daily or weekly. Track exact responses and identify when AI hallucinates or drops your brand from the list."
    },
    {
      icon: <ShieldAlert className="w-6 h-6 text-pink-400" />,
      title: "Competitor Battlecards",
      description: "Benchmark your sentiment and share of voice directly against your top 3 competitors in real-time."
    }
  ];

  return (
    <section id="features" className="py-24 bg-white/[0.02] border-y border-white/5 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to master AI search</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Traditional SEO tools don&apos;t work for LLMs. Archdrift is built specifically for Answer Engine Optimization (AEO).
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group cursor-default">
              <div className="w-12 h-12 rounded-xl bg-black/50 flex items-center justify-center border border-white/5 mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
