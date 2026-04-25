"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Cpu, Terminal, TrendingUp, Clock, Zap, ArrowRight } from 'lucide-react';

interface MarketEvent {
  id: string;
  headline: string;
  summary: string;
  sentiment: string;
  confidence: number;
  impact_assets: any;
  event_time: string;
  channel_handle: string;
}

export const DashboardPreview = ({ events }: { events: MarketEvent[] }) => {
  const [activeScenarioIndex, setActiveScenarioIndex] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const currentEvent = events[activeScenarioIndex] || {
    headline: "Awaiting Live Market Signals...",
    summary: "Connect to the network to stream the latest market intelligence.",
    sentiment: "Neutral",
    confidence: 0,
    impact_assets: [],
    channel_handle: "SYSTEM",
    event_time: new Date().toISOString()
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(s => (s + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative group">
      <div className="flex justify-center gap-2 mb-8 overflow-x-auto pb-2">
        {events.slice(0, 3).map((e, idx) => (
          <button
            key={e.id || idx}
            onClick={() => { setActiveScenarioIndex(idx); setCurrentStep(0); }}
            className={`px-4 py-2 rounded-lg font-mono text-[10px] font-bold tracking-widest transition-all whitespace-nowrap bg-transparent border-none cursor-pointer ${
              activeScenarioIndex === idx 
                ? 'bg-primary text-white shadow-[0_0_20px_rgba(91,46,255,0.3)]' 
                : 'bg-white/5 text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {e.headline.slice(0, 15)}...
          </button>
        ))}
      </div>

      <div className="bg-[#0b0f1a] border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.6)] relative z-10">
        <div className="h-[600px] grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          <div className="md:col-span-3 border-r border-white/5 bg-black/20 flex flex-col">
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-on-surface-variant tracking-widest italic">LIVE_FEED</span>
              <Activity className="w-3 h-3 text-primary animate-pulse" />
            </div>
            <div className="flex-1 overflow-hidden relative">
              <div className="p-4 space-y-4">
                {(events.length > 0 ? events : [...Array(6)]).slice(0, 6).map((e, i) => (
                  <motion.div 
                    key={typeof e === 'object' ? e.id : i}
                    initial={{ opacity: 0.3, x: -10 }}
                    animate={{ opacity: i === 0 && currentStep === 0 ? 1 : 0.4, x: 0 }}
                    className={`p-3 rounded-xl border border-white/5 bg-white/5 relative overflow-hidden text-left ${i === 0 && currentStep === 0 ? 'border-primary/50' : ''}`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[8px] font-mono text-on-surface-variant">
                        {typeof e === 'object' ? new Date(e.event_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : `07:4${i} AM`}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-on-surface leading-tight truncate">
                      {typeof e === 'object' ? e.headline : "Incoming market volatility signal..."}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="absolute inset-0 scanlines opacity-5 pointer-events-none" />
            </div>
          </div>

          <div className="md:col-span-6 bg-black/40 relative flex flex-col items-center justify-center p-8">
            <AnimatePresence mode="wait">
              {currentStep >= 1 && events.length > 0 ? (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full max-w-lg text-left"
                >
                  <div className="mb-8">
                    <span className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 rounded text-[9px] font-bold font-mono text-primary uppercase mb-4">MARKET_SIGNAL</span>
                    <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{currentEvent.headline}</h2>
                    <div className="text-[10px] font-mono text-on-surface-variant">PROCESSED AT {new Date(currentEvent.event_time).toLocaleTimeString()}</div>
                  </div>
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                    <div className="text-[9px] font-mono text-cyan-400 font-bold uppercase mb-2">AI SUMMARY</div>
                    <p className="text-on-surface leading-relaxed text-sm italic">"{currentEvent.summary}"</p>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center opacity-40">
                  <Cpu className="w-12 h-12 mb-4 mx-auto animate-spin-slow" />
                  <div className="text-[10px] font-mono tracking-widest uppercase">Awaiting Signal...</div>
                </div>
              )}
            </AnimatePresence>
          </div>

          <div className="md:col-span-3 border-l border-white/5 bg-black/20 flex flex-col p-6 text-left">
            <AnimatePresence mode="wait">
              {currentStep === 2 && events.length > 0 ? (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="text-center pb-6 border-b border-white/5">
                    <div className="text-[9px] font-mono text-on-surface-variant mb-3 uppercase">Confidence</div>
                    <div className="text-3xl font-bold text-primary">{Math.round((currentEvent.confidence || 0.85) * 100)}%</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="text-[8px] font-bold text-on-surface-variant uppercase mb-1">Sentiment</div>
                    <div className={`text-xl font-bold ${currentEvent.sentiment === 'Bullish' ? 'text-green-400' : 'text-red-400'}`}>{currentEvent.sentiment}</div>
                  </div>
                  <div className="p-4 bg-primary/20 rounded-2xl border border-primary/30">
                    <div className="text-[8px] font-bold text-primary uppercase mb-2">Decision</div>
                    <div className="text-[11px] font-mono leading-tight">{currentEvent.sentiment === "Bullish" ? "Accumulate relevant exposure." : "Reduce risk on affected assets."}</div>
                  </div>
                </motion.div>
              ) : (
                <div className="opacity-20 text-center flex flex-col items-center justify-center h-full">
                  <Terminal className="w-8 h-8 mb-4" />
                  <div className="text-[9px] font-mono uppercase">Strategy Engine</div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
