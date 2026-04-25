"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, ArrowRight } from 'lucide-react';

export const IntelligencePanel = () => {
  const [activeTab, setActiveTab] = useState<'raw' | 'summary' | 'insight'>('summary');
  
  const rawData = `{
  "id": "kb_9210x",
  "source": "market_feed_live",
  "raw_headline": "Sentiment shift detected in crypto majors",
  "timestamp": "${new Date().toISOString()}",
  "raw_content": "Volume spikes correlate with social sentiment flip..."
}`;

  const summaryData = {
    headline: "Sentiment shift detected in crypto majors",
    summary: "High volume and social momentum signal a potential breakout in the next 4-8 hours.",
    confidence: 92,
    detected_signals: ["Momentum", "Social", "Volume"]
  };

  const insightData = {
    marketImpact: "Bullish",
    affectedAssets: ["BTC", "ETH", "SOL"],
    suggestion: "Maintain long bias / Watch for $100k breakout",
    timeFrame: "Short-term (4-12 hours)"
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 relative">
      <div className="absolute inset-0 bg-primary/20 rounded-3xl translate-x-3 translate-y-3 blur-sm z-[-1]" />
      <div className="absolute inset-0 bg-surface-container/40 rounded-3xl -translate-x-2 -translate-y-2 border border-white/5 z-[-1]" />

      <div className="bg-surface-container-low border-2 border-white/10 rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
        <div className="bg-surface-container-high px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex gap-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-pink-500" />
              <div className="w-3 h-3 rounded-full bg-cyan-500" />
              <div className="w-3 h-3 rounded-full bg-primary" />
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              KARCHOG_CORE_9.1
            </div>
          </div>
          
          <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
            {(['raw', 'summary', 'insight'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-mono text-[10px] font-bold transition-all uppercase tracking-tighter ${
                  activeTab === tab 
                    ? 'bg-primary text-white shadow-[0_0_15px_rgba(91,46,255,0.4)]' 
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab === 'raw' ? 'Raw Data' : tab === 'summary' ? 'AI Summary' : 'Market Insight'}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8 min-h-[340px] bg-black/20 relative overflow-hidden">
          <div className="absolute inset-0 scanlines opacity-10 pointer-events-none" />
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-sm leading-relaxed"
            >
              {activeTab === 'raw' && (
                <div className="text-secondary/80 whitespace-pre-wrap">
                  {rawData}
                </div>
              )}

              {activeTab === 'summary' && (
                <div className="space-y-6 text-left">
                  <div className="group cursor-default">
                    <div className="text-[10px] text-primary font-bold uppercase mb-2 tracking-widest flex items-center gap-2">
                      <Zap className="w-3 h-3" /> Headline Detection
                    </div>
                    <div className="text-xl text-on-surface font-semibold group-hover:text-primary transition-colors">
                      {summaryData.headline}
                    </div>
                  </div>
                  
                  <div className="group cursor-default">
                    <div className="text-[10px] text-pink-400 font-bold uppercase mb-2 tracking-widest">Synthesis</div>
                    <div className="text-on-surface-variant border-l-2 border-pink-400/30 pl-4 py-1 italic">
                      {summaryData.summary}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    {summaryData.detected_signals.map(signal => (
                      <span key={signal} className="px-3 py-1 bg-white/5 border border-white/10 rounded-md text-[10px] text-on-surface-variant">
                        #{signal}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'insight' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-pink-400/30 transition-all group">
                      <div className="text-[9px] text-pink-400 font-bold uppercase mb-2">Market Impact</div>
                      <div className="text-2xl font-semibold text-on-surface flex items-center gap-3">
                        <ArrowRight className="w-5 h-5 text-pink-400 rotate-45" />
                        {insightData.marketImpact}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <div className="text-[9px] text-primary font-bold uppercase mb-2">Affected Assets</div>
                      <div className="flex gap-2 text-primary font-bold">
                        {insightData.affectedAssets.map(asset => (
                          <span key={asset}>{asset}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 flex flex-col justify-center">
                    <div className="text-[10px] text-accent font-bold uppercase mb-4 tracking-widest">AI Actionable Strategy</div>
                    <div className="text-lg text-on-surface leading-tight mb-4 italic">
                      "{insightData.suggestion}"
                    </div>
                    <div className="text-[11px] text-on-surface-variant opacity-60">
                      Window: {insightData.timeFrame}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
