/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAccount, useConnect, useDisconnect, useWalletClient } from "wagmi";
import { injected } from "wagmi/connectors";
import { wrapFetchWithPayment } from "@x402/fetch";
import { x402Client } from "@x402/core/client";
import { ExactEvmScheme } from "@x402/evm";
import {
  Terminal,
  Wallet,
  Zap,
  Globe,
  Database,
  Cpu,
  ArrowRight,
  Layers,
  Clock,
  CheckCircle2,
  ChevronDown,
  Menu,
  X,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  Search,
  Filter,
  MoreVertical,
  Activity,
  Twitter,
  Github,
  Mail,
  MessageCircle,
  ArrowUp,
  Lock,
  Copy,
  Play,
  Shield,
  Code,
  Box,
  RefreshCw,
  ExternalLink,
  Check
} from 'lucide-react';

// --- Sub-components ---

const DashboardPreview = () => {
  const [activeScenario, setActiveScenario] = useState('CRYPTO');
  const [currentStep, setCurrentStep] = useState(0); // 0: Feed, 1: Process, 2: Result

  const scenarios = {
    MACRO: {
      tag: "MACRO EVENT",
      headline: "Federal Reserve hints at prolonged rates",
      summary: "FOMC minutes suggest 'higher for longer' stance as inflation remains sticky in service sectors.",
      sentiment: "Bearish",
      confidence: 88,
      impact: "High on Tech/Growth",
      suggestion: "Reduce exposure to high-multiplier equities.",
      affected: ["SPX", "NVDA", "QQQ"]
    },
    CRYPTO: {
      tag: "CRYPTO NEWS",
      headline: "SEC approves first spot ETH ETF variants",
      summary: "Regulatory breakthrough allows institutional flow into Ethereum-based instruments, potentially boosting L1/L2 liquidity.",
      sentiment: "Bullish",
      confidence: 94,
      impact: "Very High on Alts",
      suggestion: "Accumulate ETH and core L2 tokens (ARB, OP).",
      affected: ["ETH", "SOL", "OP"]
    },
    EARNINGS: {
      tag: "EARNINGS REPORT",
      headline: "Microsoft cloud growth exceeds guidance",
      summary: "Azure expansion driven by AI integration signals continued enterprise shift toward intelligent infrastructure.",
      sentiment: "Bullish",
      confidence: 91,
      impact: "Moderate on AI Sector",
      suggestion: "Hold MSFT; look for undervalued AI infrastructure providers.",
      affected: ["MSFT", "GOOGL", "AI"]
    }
  };

  const scenario = scenarios[activeScenario as keyof typeof scenarios];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep(s => (s + 1) % 3);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative group">
      {/* Scenario Tabs */}
      <div className="flex justify-center gap-2 mb-8">
        {Object.keys(scenarios).map((s) => (
          <button
            key={s}
            onClick={() => { setActiveScenario(s); setCurrentStep(0); }}
            className={`px-4 py-2 rounded-lg font-mono text-[10px] font-bold tracking-widest transition-all ${activeScenario === s
              ? 'bg-secondary text-on-surface shadow-[0_0_20px_rgba(196,181,253,0.3)]'
              : 'bg-surface-container-high text-on-surface-variant hover:text-on-surface'
              }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-[#0b0f1a] border border-white/10 rounded-[2rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.6)] relative z-10">
        <div className="h-[600px] grid grid-cols-12 overflow-hidden">
          {/* Left Panel: Live News Feed */}
          <div className="col-span-3 border-r border-white/5 bg-black/20 flex flex-col">
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold text-on-surface-variant tracking-widest italic">LIVE_FEED</span>
              <Activity className="w-3 h-3 text-secondary animate-pulse" />
            </div>
            <div className="flex-1 overflow-hidden relative">
              <div className="absolute inset-0 scanlines opacity-50 pointer-events-none" />
              <div className="p-4 space-y-4">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0.3, x: -10 }}
                    animate={{ opacity: i === 0 && currentStep === 0 ? 1 : 0.4, x: 0 }}
                    className={`p-3 rounded-xl border border-white/5 bg-white/5 relative overflow-hidden ${i === 0 && currentStep === 0 ? 'border-primary/50' : ''}`}
                  >
                    {i === 0 && currentStep === 0 && (
                      <motion.div layoutId="highlight" className="absolute inset-0 bg-primary/5 border border-primary/30" />
                    )}
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[8px] font-mono text-on-surface-variant">07:4{i} AM</span>
                      <span className="text-[7px] font-mono bg-white/5 px-1.5 py-0.5 rounded text-white/40">PRIORITY {i + 1}</span>
                    </div>
                    <div className="text-[10px] font-mono text-on-surface leading-tight truncate">
                      {i === 0 ? scenario.headline : "Incoming market volatility signal..."}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0b0f1a] to-transparent" />
            </div>
          </div>

          {/* Center Panel: AI Intelligence Workspace */}
          <div className="col-span-6 bg-black/40 relative flex flex-col">
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-center gap-4">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-red-500/40" />
                <div className="w-2 h-2 rounded-full bg-orange-500/40" />
                <div className="w-2 h-2 rounded-full bg-green-500/40" />
              </div>
              <span className="font-mono text-[10px] font-bold text-on-surface/60 tracking-[0.3em] uppercase">Intelligence Workspace</span>
              <div className="flex-1" />
              <Search className="w-3 h-3 text-on-surface-variant" />
            </div>

            <div className="flex-1 p-8 flex flex-col justify-center max-w-xl mx-auto w-full">
              <AnimatePresence mode="wait">
                {currentStep >= 1 ? (
                  <motion.div
                    key="processing"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="mb-8">
                      <span className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 rounded text-[9px] font-bold font-mono text-primary uppercase mb-4 tracking-tighter">
                        {scenario.tag}
                      </span>
                      <h2 className="text-2xl font-display text-white mb-2 leading-tight">
                        {scenario.headline}
                      </h2>
                      <div className="flex items-center gap-3 text-on-surface-variant">
                        <Clock className="w-3 h-3" />
                        <span className="text-[10px] font-mono tracking-widest">PROCESSED IN 142MS</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-surface-container-high/40 p-6 rounded-2xl border border-white/5 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-20"><Zap className="w-12 h-12 text-tertiary" /></div>
                        <div className="text-[9px] font-mono text-tertiary font-bold uppercase mb-2 tracking-widest">AI SUMMARY</div>
                        <p className="text-on-surface leading-relaxed text-sm italic">
                          "{scenario.summary}"
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                          <div className="text-[9px] font-mono text-on-surface-variant mb-1">RELEVANCE</div>
                          <div className="text-lg font-display text-secondary">High-Context</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                          <div className="text-[9px] font-mono text-on-surface-variant mb-1">REASONING</div>
                          <div className="text-[11px] font-mono text-on-surface/80">Sentiment-Aligned</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="waiting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    className="text-center"
                  >
                    <div className="w-12 h-12 bg-white/5 border border-dashed border-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin-slow">
                      <Cpu className="text-white/40 w-6 h-6" />
                    </div>
                    <div className="text-[10px] font-mono text-on-surface-variant tracking-widest">AWAITING SIGNAL PROCESSING...</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Panel: Decision Output */}
          <div className="col-span-3 border-l border-white/5 bg-black/20 flex flex-col p-6">
            <AnimatePresence mode="wait">
              {currentStep === 2 ? (
                <motion.div
                  key="output"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="text-center pb-6 border-b border-white/5">
                    <div className="text-[9px] font-mono text-on-surface-variant mb-3 uppercase tracking-widest">Confidence Score</div>
                    <div className="relative inline-flex items-center justify-center">
                      <svg className="w-32 h-32">
                        <circle cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="4" className="text-white/5" />
                        <motion.circle
                          cx="64" cy="64" r="58" fill="none" stroke="currentColor" strokeWidth="4"
                          strokeDasharray="364.4"
                          initial={{ strokeDashoffset: 364.4 }}
                          animate={{ strokeDashoffset: 364.4 * (1 - scenario.confidence / 100) }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="text-primary"
                          transform="rotate(-90 64 64)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-display text-white">{scenario.confidence}%</span>
                        <span className="text-[8px] font-bold text-primary">RELIABLE</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className={`p-4 rounded-2xl border ${scenario.sentiment === 'Bullish' ? 'bg-secondary/10 border-secondary/20' : 'bg-red-500/10 border-red-500/20'}`}>
                      <div className="text-[8px] font-bold font-mono text-on-surface-variant uppercase mb-1">Sentiment</div>
                      <div className={`text-xl font-display ${scenario.sentiment === 'Bullish' ? 'text-secondary' : 'text-red-400'}`}>
                        {scenario.sentiment}
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="text-[8px] font-bold font-mono text-on-surface-variant uppercase mb-2">Affected Assets</div>
                      <div className="flex flex-wrap gap-2">
                        {scenario.affected.map(a => (
                          <span key={a} className="px-2 py-1 bg-white/5 rounded text-[10px] font-mono font-bold text-white/80">{a}</span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-primary/20 rounded-2xl border border-primary/30 shadow-[0_0_30px_rgba(91,46,255,0.2)]">
                      <div className="text-[8px] font-bold font-mono text-primary uppercase mb-2">Recommendation</div>
                      <div className="text-[11px] text-on-surface font-mono leading-tight">
                        {scenario.suggestion}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center opacity-20">
                  <Terminal className="w-12 h-12 mb-4" />
                  <div className="text-[9px] font-mono text-center tracking-widest underline decoration-dashed">CALCULATING STRATEGY...</div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Ticker Bottom */}
        <div className="h-12 bg-white/5 border-t border-white/5 flex items-center overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap gap-12 items-center">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-12 items-center">
                <span className="font-mono text-[9px] text-on-surface-variant"><span className="text-secondary">#</span> SIGNAL_RESOLVED: MSFT_Earnings_Beat</span>
                <span className="font-mono text-[9px] text-on-surface-variant"><span className="text-primary">#</span> ALERT: BTC_Vol_Spike</span>
                <span className="font-mono text-[9px] text-on-surface-variant"><span className="text-tertiary">#</span> CONTEXT: ETH_ETF_Approval</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Insight Panels (Background Decorative) */}
      <div className="absolute -top-12 -left-20 pointer-events-none">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="bg-surface-container-high/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center"><TrendingUp className="w-4 h-4 text-secondary" /></div>
            <div>
              <div className="text-[8px] font-mono text-on-surface-variant">TREND DETECTED</div>
              <div className="text-[10px] font-bold text-secondary">BULLISH REVERSAL</div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute -bottom-12 -right-20 pointer-events-none">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="bg-surface-container-high/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center"><Cpu className="w-4 h-4 text-primary" /></div>
            <div>
              <div className="text-[8px] font-mono text-on-surface-variant">ENGINE_LOAD</div>
              <div className="text-[10px] font-bold text-primary">OPTIMAL (1ms)</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const IntelligencePanel = () => {
  const [activeTab, setActiveTab] = useState<'raw' | 'summary' | 'insight'>('summary');

  const rawData = `{
  "id": "kb_9210x",
  "source": "reuters_live",
  "raw_headline": "US CPI data exceeds expectations",
  "timestamp": "${new Date().toISOString()}",
  "raw_content": "Inflation remains elevated across core sectors..."
}`;

  const summaryData = {
    headline: "US CPI data exceeds expectations",
    summary: "Inflation remains elevated, signaling potential hawkish pivot from central banks.",
    confidence: 92,
    detected_signals: ["Inflation", "Interest Rates", "Volatility"]
  };

  const insightData = {
    marketImpact: "Bearish",
    affectedAssets: ["BTC", "ETH", "SPX"],
    suggestion: "Reduce leverage exposure / Hedge long positions",
    timeFrame: "Short-term (1-3 days)"
  };

  return (
    <div className="max-w-4xl mx-auto mt-20 relative">
      {/* Floating Tags */}
      <AnimatePresence>
        {activeTab === 'insight' && (
          <>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute -left-20 top-1/4 bg-[#FF4D9D]/20 text-[#FF4D9D] border border-[#FF4D9D]/30 px-3 py-1 rounded-full font-mono text-[10px] font-bold shadow-[0_0_20px_rgba(255,77,157,0.2)]"
            >
              Bearish Signal
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute -right-20 top-1/2 bg-accent/20 text-accent border border-accent/30 px-3 py-1 rounded-full font-mono text-[10px] font-bold shadow-[0_0_20px_rgba(196,181,253,0.2)]"
            >
              92% Confidence
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Layered Cards for Depth */}
      <div className="absolute inset-0 bg-primary/20 rounded-3xl translate-x-3 translate-y-3 blur-sm z-[-1]" />
      <div className="absolute inset-0 bg-surface-container/40 rounded-3xl -translate-x-2 -translate-y-2 border border-white/5 z-[-1]" />

      <div className="bg-surface-container-low border-2 border-white/10 rounded-3xl overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.5)]">
        {/* Header / Tabs */}
        <div className="bg-surface-container-high px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="flex gap-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-tertiary" />
              <div className="w-3 h-3 rounded-full bg-accent" />
              <div className="w-3 h-3 rounded-full bg-primary" />
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Intelligence_Flow_92.1
            </div>
          </div>

          <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
            {(['raw', 'summary', 'insight'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-mono text-[10px] font-bold transition-all uppercase tracking-tighter ${activeTab === tab
                  ? 'bg-primary text-on-surface shadow-[0_0_15px_rgba(91,46,255,0.4)]'
                  : 'text-on-surface-variant hover:text-on-surface'
                  }`}
              >
                {tab === 'raw' ? 'Raw Data' : tab === 'summary' ? 'AI Summary' : 'Market Insight'}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8 min-h-[340px] bg-black/20 relative scanlines overflow-hidden">
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
                <div className="text-accent/80 whitespace-pre-wrap">
                  {rawData.split("").map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.002 }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
              )}

              {activeTab === 'summary' && (
                <div className="space-y-6">
                  <div className="group cursor-default">
                    <div className="text-[10px] text-primary font-bold uppercase mb-2 tracking-widest flex items-center gap-2">
                      <Zap className="w-3 h-3" /> Headline Detection
                    </div>
                    <div className="text-xl text-on-surface font-display group-hover:text-primary transition-colors">
                      {summaryData.headline}
                    </div>
                  </div>

                  <div className="group cursor-default">
                    <div className="text-[10px] text-tertiary font-bold uppercase mb-2 tracking-widest">Synthesis</div>
                    <div className="text-on-surface-variant border-l-2 border-tertiary/30 pl-4 py-1 italic">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:border-tertiary/30 transition-all group">
                      <div className="text-[9px] text-tertiary font-bold uppercase mb-2">Market Impact</div>
                      <div className="text-2xl font-display text-on-surface flex items-center gap-3">
                        <ArrowRight className="w-5 h-5 text-tertiary rotate-45" />
                        {insightData.marketImpact}
                      </div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <div className="text-[9px] text-primary font-bold uppercase mb-2">Affected Assets</div>
                      <div className="flex gap-2">
                        {insightData.affectedAssets.map(asset => (
                          <span key={asset} className="text-primary font-bold">{asset}</span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-2xl p-6 border border-primary/20 flex flex-col justify-center">
                    <div className="text-[10px] text-accent font-bold uppercase mb-4 tracking-widest">AI Actionable Strategy</div>
                    <div className="text-lg text-on-surface leading-tight mb-4">
                      {insightData.suggestion}
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

const DocsView = () => {
  const categories = [
    { name: "Getting Started", items: ["Introduction", "Quick Start", "x402 Protocol"] },
    { name: "Core APIs", items: ["Semantic News", "Technical Indicators", "Market Data"] },
    { name: "Authentication", items: ["Wallet Flow", "API Keys", "Security"] }
  ];

  return (
    <div className="pt-20 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 min-h-screen pb-32">
      <aside className="md:col-span-3">
        <div className="sticky top-32 space-y-10">
          {categories.map(cat => (
            <div key={cat.name}>
              <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4">{cat.name}</div>
              <ul className="space-y-3 font-mono text-xs">
                {cat.items.map(item => (
                  <li key={item}>
                    <a href="#" className="text-on-surface-variant hover:text-white transition-colors block">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      <main className="md:col-span-9">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert max-w-none"
        >
          <h1 className="font-display text-4xl md:text-6xl text-white mb-6">Documentation</h1>
          <p className="text-on-surface-variant text-lg mb-12 leading-relaxed">
            KabarChog is an autonomous intelligence layer built for machine economies. Integrate real-time market insights via the HTTP 402 protocol.
          </p>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-display text-white mb-4">Authentication</h2>
              <p className="text-on-surface-variant mb-6">KabarChog uses the x402 Protocol. No API keys are required for initial handshake; authentication happens via onchain balance verification.</p>
              <div className="bg-black/60 rounded-2xl p-6 border border-white/10 font-mono text-sm leading-relaxed">
                <div className="text-primary opacity-60 mb-2">// Request Authorization</div>
                <div>GET /v1/news/intelligence HTTP/1.1</div>
                <div>Authorization: x402-AUTH identity=0x5b2eff...</div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-display text-white mb-4">Quick Start</h2>
              <p className="text-on-surface-variant mb-6">Connect your wallet and start streaming semantic news chunks directly to your agents.</p>
              <div className="bg-surface-container p-8 rounded-3xl border border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                  <div className="text-[10px] font-bold text-secondary mb-3 uppercase tracking-widest">NPM INSTALL</div>
                  <div className="font-mono text-xs text-white">npm install @kabarchog/sdk</div>
                </div>
                <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                  <div className="text-[10px] font-bold text-tertiary mb-3 uppercase tracking-widest">CDN</div>
                  <div className="font-mono text-xs text-white">script src="https://cdn.kabarchog.io/v1"</div>
                </div>
              </div>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

// --- DATA VISUALIZATION COMPONENTS ---
const VisualInspector = ({ data }: { data: any }) => {
  try {
    if (!data) return null;

    // Render an array of intelligence
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return <div className="text-on-surface-variant font-mono text-sm p-4">No data returned or array is empty.</div>;
      }
      
      // Check if it's a news/analysis feed
      if (data[0] && (data[0].headline || data[0].summary)) {
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-secondary" />
              <h3 className="text-white font-display font-medium text-lg">Market Intelligence Feed</h3>
              <span className="ml-auto text-[10px] font-mono font-bold px-2 py-1 bg-white/5 text-on-surface-variant rounded-md">
                {data.length} ITEMS
              </span>
            </div>
            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
              {data.map((item: any, idx: number) => (
                <div key={item.id || idx} className="bg-[#0a0a0f] border border-white/5 rounded-2xl p-5 hover:border-primary/50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="text-white font-display font-bold text-lg leading-snug">
                      {item.headline || 'Untitled Entry'}
                    </div>
                    {item.sentiment && (
                      <div className={`px-2 py-1 rounded text-[10px] font-mono font-bold tracking-widest uppercase border ${
                        item.sentiment === 'positive' || item.sentiment === 'bullish' ? 'text-green-400 bg-green-400/10 border-green-400/20' : 
                        item.sentiment === 'negative' || item.sentiment === 'bearish' ? 'text-red-400 bg-red-400/10 border-red-400/20' : 
                        'text-gray-400 bg-gray-400/10 border-gray-400/20'
                      }`}>
                        {item.sentiment}
                      </div>
                    )}
                  </div>
                  {item.summary && (
                    <p className="text-on-surface-variant text-sm leading-relaxed mb-4">
                      {item.summary}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-white/5">
                    {item.confidence !== undefined && (
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-on-surface-variant">
                        <Zap className="w-3 h-3 text-secondary" />
                        CONF: {!isNaN(item.confidence) ? (item.confidence * 100).toFixed(0) : 'N/A'}%
                      </div>
                    )}
                    {item.channel_handle && (
                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-on-surface-variant">
                        <Globe className="w-3 h-3 text-tertiary" />
                        {item.channel_handle}
                      </div>
                    )}
                    {(Array.isArray(item.impact_assets) && item.impact_assets.length > 0) && (
                      <div className="flex gap-2 ml-auto">
                        {item.impact_assets.map((asset: any, aIdx: number) => {
                          const ticker = typeof asset === 'object' && asset !== null ? asset.ticker : String(asset);
                          const isBullish = typeof asset === 'object' && asset !== null && asset.direction === 'bullish';
                          const isBearish = typeof asset === 'object' && asset !== null && asset.direction === 'bearish';
                          
                          return (
                            <span key={aIdx} className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full uppercase border ${
                              isBullish ? 'bg-green-400/10 border-green-400/20 text-green-400' :
                              isBearish ? 'bg-red-400/10 border-red-400/20 text-red-400' :
                              'bg-accent/10 border-accent/20 text-accent'
                            }`}>
                              {ticker}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      }
    }

    // Fallback / Single object renderer
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Database className="w-5 h-5 text-primary" />
          <h3 className="text-white font-display font-medium text-lg">Visual Data Inspector</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(data).map(([k, v]) => {
            if (typeof v === 'object' && v !== null) {
              return (
                <div key={k} className="bg-[#0a0a0f] border border-white/10 rounded-2xl p-4 md:col-span-2">
                  <div className="text-[10px] text-tertiary uppercase mb-2 font-mono tracking-widest font-bold">{k}</div>
                  <div className="text-white font-mono text-xs opacity-70 whitespace-pre-wrap leading-relaxed bg-black/40 p-3 rounded-xl border border-white/5">
                    {JSON.stringify(v, null, 2)}
                  </div>
                </div>
              );
            }
            return (
              <div key={k} className="bg-[#0a0a0f] border border-white/5 rounded-2xl p-4 hover:border-white/10 transition-colors">
                <div className="text-[10px] text-on-surface-variant uppercase mb-2 font-mono tracking-widest">{k}</div>
                <div className="text-white font-sans text-sm font-medium">{String(v)}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } catch (err: any) {
    return (
      <div className="text-red-400 font-mono text-sm p-8 bg-red-400/10 border border-red-400/20 rounded-2xl flex flex-col gap-4">
        <div><AlertTriangle className="inline-block mr-2 w-5 h-5" /> RECONSTRUCTION FAILED</div>
        <div className="text-xs break-all bg-black/40 p-4 rounded-xl">{err.toString()}</div>
      </div>
    );
  }
};

const DemoView = ({ onConnect, isConnected, walletAddress }: { onConnect: () => void; isConnected: boolean; walletAddress: string | null }) => {
  const [selectedId, setSelectedId] = useState('live-feed');
  const [callCount, setCallCount] = useState(0);
  const [isCalling, setIsCalling] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [inputs, setInputs] = useState<any>({ limit: 10, market: 'crypto', symbol: 'BTC', risk: 'moderate', selectedAsset: 'BTC', text: '' });
  const [activeTab, setActiveTab] = useState<'json' | 'visual' | 'logs'>('json');
  const [logs, setLogs] = useState<string[]>([]);
  const [assets, setAssets] = useState<string[]>(['BTC', 'ETH', 'SOL', 'MONAD']);

  // Fetch active tickers from DB
  useEffect(() => {
    async function fetchTickers() {
      try {
        const res = await fetch('/api/tickers');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setAssets(data);
          setInputs((prev: any) => ({ ...prev, selectedAsset: data[0] }));
        }
      } catch (err) {
        console.error('Failed to fetch tickers', err);
      }
    }
    fetchTickers();
  }, []);

  const endpoints = [
    { id: 'live-feed', name: 'Live Feed', path: '/api/feed/live', method: 'GET', price: '$0.001', desc: 'Real-time stream of market-impacting events from our monitoring engine.', params: ['limit'] },
    { id: 'ticker-feed', name: 'Ticker Feed', path: '/api/feed/ticker/{symbol}', method: 'GET', price: '$0.002', desc: 'Targeted news flow specifically impacting your selected asset.', params: ['symbol'] },
    { id: 'hourly-digest', name: 'Hourly Digest', path: '/api/digest/hourly', method: 'GET', price: '$0.003', desc: 'Narrative market summary of the last 60 minutes, synthesized by AI.', params: [] },
    { id: 'daily-digest', name: 'Daily Digest', path: '/api/digest/daily', method: 'GET', price: '$0.005', desc: 'Comprehensive 24-hour market outlook aggregated by AI.', params: [] },
    { id: 'sentiment', name: 'Sentiment Distribution', path: '/api/ticker/{symbol}/sentiment', method: 'GET', price: '$0.002', desc: 'Statistical breakdown of market sentiment for specific assets.', params: ['symbol'] },
    { id: 'trading-plan', name: 'Trading Plan Analysis', path: '/api/ticker/{symbol}/analysis', method: 'GET', price: '$0.01', desc: 'Pro-grade AI trading strategy with Entry, TP, and SL levels.', params: ['symbol'] },
    { id: 'custom-analysis', name: 'Custom Analysis', path: '/api/analyze', method: 'POST', price: '$0.005', desc: 'Instant AI Market Analyst for any text you provide.', params: ['text'] },
  ];

  const selectedEndpoint = endpoints.find(e => e.id === selectedId) || endpoints[0];

  const { data: walletClient } = useWalletClient();

  const handleCall = () => {
    if (callCount >= 5) return;
    confirmCall();
  };

  const confirmCall = async () => {
    setIsWalletPopupOpen(false);
    setIsCalling(true);
    setResponse(null);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Initializing x402 handshake...`, `[${new Date().toLocaleTimeString()}] Verified wallet signature: ${walletAddress?.slice(0, 10)}...`]);

    try {
      // Build real API URL from endpoint config
      let urlPath = selectedEndpoint.path;
      if (urlPath.includes('{symbol}')) {
        urlPath = urlPath.replace('{symbol}', inputs.selectedAsset || 'BTC');
      }
      if (selectedEndpoint.params?.includes('limit') && inputs.limit) {
        urlPath += `?limit=${inputs.limit}`;
      }

      // Use absolute URL to ensure consistent matching in x402 library
      const url = new URL(urlPath, window.location.origin).href;

      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Requesting: ${url}`, `[${new Date().toLocaleTimeString()}] x402 Settlement: ${selectedEndpoint.price}`]);

      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: { 'Content-Type': 'application/json' },
      };
      if (selectedEndpoint.method === 'POST') {
        options.body = JSON.stringify({ text: inputs.text || '' });
      }

      let paymentFetch = fetch;

      // Only apply payment wrapper if real wallet client is accessible
      if (walletClient && walletAddress) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Wallet ready, initializing x402 Client...`]);
        const evmSigner = {
          address: walletAddress as `0x${string}`,
          signTypedData: async (data: any) => {
            setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✍️ Requesting signature from wallet...`]);
            return walletClient.signTypedData({
              account: walletAddress as `0x${string}`,
              domain: data.domain,
              types: data.types,
              primaryType: data.primaryType,
              message: data.message,
            });
          },
        };
        const x402Config = { chainId: "eip155:10143", facilitator: "https://x402-facilitator.molandak.org" } as const;
        const client = new x402Client().register(x402Config.chainId, new ExactEvmScheme(evmSigner));
        paymentFetch = wrapFetchWithPayment(fetch, client);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] x402 fetch wrapper applied.`]);
      } else {
        const reason = !walletClient ? "walletClient is null" : "walletAddress is null";
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ⚠️ WARNING: ${reason}. Using raw fetch (payment will fail).`]);
      }

      const res = await paymentFetch(url, options);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
      const payloadSize = new Blob([JSON.stringify(data)]).size;
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Data stream established.`, `[${new Date().toLocaleTimeString()}] Received payload: ${(payloadSize / 1024).toFixed(1)}kb`]);
      setCallCount(prev => prev + 1);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err: any) {
      setResponse({ error: err.message || 'Failed to fetch data' });
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ERROR: ${err.message}`]);
    } finally {
      setIsCalling(false);
    }
  };

  const JsonHighlighter = ({ data }: { data: any }) => {
    const jsonString = JSON.stringify(data, null, 2);

    // Regex for basic JSON syntax highlighting
    const highlightJson = (json: string) => {
      json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'text-accent'; // numbers
        if (/^"/.test(match)) {
          if (/:$/.test(match)) {
            cls = 'text-primary'; // keys
          } else {
            cls = 'text-green-400'; // strings
          }
        } else if (/true|false/.test(match)) {
          cls = 'text-tertiary'; // booleans
        } else if (/null/.test(match)) {
          cls = 'text-red-400'; // null
        }
        return '<span class="' + cls + '">' + match + '</span>';
      });
    };

    const highlightedHTML = highlightJson(jsonString).split('\n');

    return (
      <div className="font-mono text-sm leading-relaxed overflow-x-auto text-white/80 pb-4">
        {highlightedHTML.map((line, i) => (
          <div key={i} className="flex gap-4 group hover:bg-white/5 px-2">
            <span className="opacity-20 text-right w-6 select-none shrink-0">{i + 1}</span>
            <span
              className="whitespace-pre"
              dangerouslySetInnerHTML={{ __html: line || ' ' }}
            />
          </div>
        ))}
      </div>
    );
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full text-center bg-surface-container border border-white/5 p-12 rounded-[48px] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full bg-primary/5 blur-[100px] pointer-events-none" />
          <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-4">Access Restricted</h1>
          <p className="text-on-surface-variant text-lg mb-10 leading-relaxed uppercase tracking-wide font-mono text-sm">
            To prevent silo state pollution, the API Explorer requires a valid wallet signature to initialize.
          </p>
          <button
            onClick={onConnect}
            className="w-full py-5 bg-primary text-white rounded-2xl font-mono text-sm font-black uppercase tracking-widest shadow-[0_0_40_rgba(91,46,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Connect Wallet to Enter Sandbox →
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] pt-24 pb-32 px-6 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />

      <div className="max-w-[1400px] mx-auto relative">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3 tracking-tight">API Explorer</h1>
            <p className="text-on-surface-variant text-lg">Test premium endpoints with gasless <span className="text-primary font-mono font-bold">x402 micropayments</span>.</p>
          </div>

          <div className="bg-surface-container-low border border-white/10 rounded-2xl p-5 w-full lg:w-auto flex items-center gap-6 shadow-2xl">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest leading-none mb-1">WALLET ADDR</div>
                <div className="text-white font-mono text-xs flex items-center gap-2">
                  {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)} <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                </div>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-left">
              <div className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest leading-none mb-1">NETWORK</div>
              <div className="text-white font-mono text-xs flex items-center gap-2 uppercase">
                <Box className="w-3 h-3 text-secondary" /> Monad Testnet
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-left">
              <div className="font-mono text-[10px] text-on-surface-variant uppercase tracking-widest leading-none mb-1">STATE</div>
              <div className="text-primary font-mono text-[10px] font-bold px-2 py-0.5 bg-primary/10 rounded border border-primary/20">LIVE_SANDBOX</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between mb-4 px-2">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">ENDPOINTS</span>
              <span className="text-[10px] font-mono text-on-surface-variant italic">AUTH REQUIRED</span>
            </div>

            {/* Global Asset Filter Dropdown */}
            <div className="px-2 mb-6">
              <div className="relative group">
                <select
                  value={inputs.selectedAsset}
                  onChange={(e) => setInputs({ ...inputs, selectedAsset: e.target.value })}
                  className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-xs focus:border-primary outline-none transition-all appearance-none cursor-pointer hover:border-white/20"
                >
                  <option value="ALL">ALL ASSETS</option>
                  {assets.map(asset => (
                    <option key={asset} value={asset}>{asset}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {endpoints.map((ep) => (
                <button
                  key={ep.id}
                  onClick={() => { setSelectedId(ep.id); setResponse(null); }}
                  className={`w-full group relative overflow-hidden text-left p-5 rounded-2xl border transition-all 
                    ${selectedId === ep.id
                      ? 'bg-primary/5 border-primary shadow-[0_0_30px_rgba(91,46,255,0.1)]'
                      : 'bg-[#0a0a0f] border-white/5 hover:border-white/10 hover:bg-white/[0.02]'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase
                      ${ep.method === 'GET' ? 'bg-secondary/10 text-secondary border-secondary/20' : 'bg-tertiary/10 text-tertiary border-tertiary/20'}`}>
                      {ep.method}
                    </span>
                    <span className="text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                      {ep.price}
                    </span>
                  </div>
                  <h3 className="text-white font-display font-medium text-lg mb-1 leading-tight tracking-tight group-hover:text-primary transition-colors">
                    {ep.name}
                  </h3>
                  <code className="text-[10px] font-mono text-on-surface-variant block truncate opacity-70 group-hover:opacity-100 transition-opacity">
                    {ep.path}
                  </code>

                  {selectedId === ep.id && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute right-0 top-0 bottom-0 w-1 bg-primary"
                    />
                  )}
                </button>
              ))}
            </div>
          </aside>

          <main className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-surface-container-low border border-white/5 rounded-[32px] p-8 lg:p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none group-hover:scale-110 transition-transform">
                <Code className="w-48 h-48 text-primary" />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-display font-bold text-white mb-2 flex items-center gap-3">
                      Playground: {selectedEndpoint.name}
                    </h2>
                    <p className="text-on-surface-variant text-sm max-w-md">{selectedEndpoint.desc}</p>
                  </div>
                  <div className="bg-primary/10 border border-primary/30 rounded-xl px-4 py-2 text-primary font-mono text-xs font-bold whitespace-nowrap">
                    COST: {selectedEndpoint.price}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  {selectedEndpoint.params.includes('symbol') && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">SELECT ASSET</label>
                      <select
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-primary outline-none transition-colors appearance-none"
                        value={inputs.selectedAsset}
                        onChange={(e) => setInputs({ ...inputs, selectedAsset: e.target.value })}
                      >
                        {assets.map(asset => (
                          <option key={asset} value={asset}>{asset}</option>
                        ))}
                        {assets.length === 0 && <option disabled>Loading assets...</option>}
                      </select>
                    </div>
                  )}

                  {selectedId === 'live-feed' && (
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">LIMIT (1-50)</label>
                      <input
                        type="number"
                        value={inputs.limit}
                        onChange={(e) => setInputs({ ...inputs, limit: parseInt(e.target.value) })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-primary outline-none transition-colors"
                      />
                    </div>
                  )}

                  {selectedId === 'custom-analysis' && (
                    <div className="space-y-2 col-span-full">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest ml-1">TEXT TO ANALYZE</label>
                      <textarea
                        value={inputs.text}
                        onChange={(e) => setInputs({ ...inputs, text: e.target.value })}
                        className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm focus:border-primary outline-none transition-colors h-32 resize-none"
                        placeholder="Enter market text, article, or social media post to analyze..."
                      />
                    </div>
                  )}
                </div>

                <div className="relative group">
                  <button
                    onClick={handleCall}
                    disabled={isCalling || callCount >= 5}
                    className={`w-full py-5 rounded-2xl font-mono text-sm font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 relative overflow-hidden
                      ${callCount >= 5
                        ? 'bg-white/5 border border-white/10 text-on-surface-variant cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-accent border shadow-[0_0_40px_rgba(91,46,255,0.3)] hover:scale-[1.02] active:scale-[0.98]'}`}
                  >
                    {isCalling ? (
                      <RefreshCw className="w-5 h-5 animate-spin" />
                    ) : callCount >= 5 ? (
                      <>
                        <Lock className="w-4 h-4" /> Usage Limit Reached
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" /> Pay {selectedEndpoint.price} & Call {selectedEndpoint.name}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#020205] border border-white/10 rounded-[32px] overflow-hidden flex flex-col min-h-[500px] shadow-inner">
              <div className="bg-white/5 px-6 py-4 border-b border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                  </div>
                  <div className="h-4 w-px bg-white/10" />
                  <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                    {(['json', 'visual'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-widest transition-all
                          ${activeTab === tab ? 'bg-primary text-white' : 'text-on-surface-variant hover:text-white'}`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                  <div className="text-[9px] font-mono text-on-surface-variant flex items-center gap-2">
                    <Activity className="w-3 h-3 text-secondary animate-pulse" /> LATENCY: <span className="text-white">4ms</span>
                  </div>
                  <button
                    onClick={() => {
                      if (response) {
                        navigator.clipboard.writeText(JSON.stringify(response, null, 2));
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 2000);
                      }
                    }}
                    className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg text-[9px] font-mono font-bold text-on-surface-variant hover:text-white hover:border-white/20 transition-all"
                  >
                    <Copy className="w-3 h-3" /> COPY RESPONSE
                  </button>
                </div>
              </div>

              <div className="flex-1 min-h-0 relative">
                <div className="absolute inset-0 overflow-auto p-8 custom-scrollbar">
                  {isCalling ? (
                    <div className="flex flex-col gap-3 py-4">
                      <div className="flex items-center gap-3 text-primary animate-pulse font-mono text-sm italic">
                        <RefreshCw className="w-4 h-4 animate-spin" /> ESTABLISHING SECURE TUNNEL...
                      </div>
                      <div className="text-[10px] text-on-surface-variant font-mono uppercase tracking-[0.2em]">Silo handshake in progress...</div>
                    </div>
                  ) : response ? (
                    <div className={callCount > 5 ? 'blur-md pointer-events-none grayscale' : ''}>
                      {activeTab === 'json' && <JsonHighlighter data={response} />}
                      {activeTab === 'visual' && <VisualInspector data={response} />}
                    </div>
                  ) : (
                    <div className="text-on-surface-variant/40 italic flex flex-col items-center justify-center h-full gap-4 py-20 border-2 border-dashed border-white/5 rounded-2xl">
                      <Terminal className="w-12 h-12 opacity-20" />
                      <span className="text-xs uppercase tracking-widest font-mono">Awaiting x402 Payment & Call...</span>
                    </div>
                  )}

                  {callCount >= 5 && (
                    <div className="absolute inset-0 bg-[#030712]/80 backdrop-blur-md flex items-center justify-center p-8 text-center z-20">
                      <div className="max-w-md">
                        <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mx-auto mb-6">
                          <Lock className="w-8 h-8 text-primary" />
                        </div>
                        <h4 className="text-2xl font-display font-bold text-white mb-3 tracking-tight">Silo Capacity Exhausted</h4>
                        <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                          Premium intelligence channels closed. Connect your enterprise wallet to resume real-time market data extraction.
                        </p>
                        <button
                          onClick={onConnect}
                          className="bg-primary text-white px-10 py-3.5 rounded-xl font-mono text-xs font-black uppercase tracking-widest shadow-xl hover:bg-accent transition-all hover:scale-105"
                        >
                          UPGRADE Pipeline →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between px-4 text-[10px] font-mono text-on-surface-variant gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  CALLS REMAINING: <span className={`text-[11px] font-bold ${5 - callCount <= 1 ? 'text-red-400' : 'text-primary'}`}>{5 - callCount}</span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-2">
                  ENGINE STATUS: <span className="text-green-500 font-bold">STABLE</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="opacity-60 italic">Refreshes every 60 minutes</span>
              </div>
            </div>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {isWalletPopupOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWalletPopupOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-surface-container-high border border-white/10 rounded-[32px] p-8 w-full max-w-sm relative z-10 shadow-2xl"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-primary/10 border border-primary/20 rounded-3xl flex items-center justify-center mb-6">
                  <Shield className="w-10 h-10 text-primary animate-pulse" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white mb-2">Approve Micropayment</h3>
                <p className="text-on-surface-variant text-sm mb-8">
                  KabarChog is requesting an x402 settlement of <span className="text-white font-bold">{selectedEndpoint.price}</span> for <span className="text-white font-bold">1 SILO ACCESS UNIT</span>.
                </p>

                <div className="w-full space-y-3 mb-8">
                  <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                    <span className="text-[10px] font-mono text-on-surface-variant uppercase">Method</span>
                    <span className="text-[11px] font-mono text-white">x402 Micropayment</span>
                  </div>
                  <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/5">
                    <span className="text-[10px] font-mono text-on-surface-variant uppercase">Network</span>
                    <span className="text-[11px] font-mono text-secondary">Monad Mainnet</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full">
                  <button
                    onClick={() => setIsWalletPopupOpen(false)}
                    className="py-4 border border-white/10 rounded-2xl font-mono text-xs text-on-surface-variant hover:bg-white/5 transition-all"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={confirmCall}
                    className="py-4 bg-primary text-white rounded-2xl font-mono text-xs font-bold hover:bg-accent ring-2 ring-primary/20 transition-all"
                  >
                    APPROVE
                  </button>
                </div>

                <div className="mt-6 flex items-center gap-2 text-[9px] font-mono text-on-surface-variant uppercase tracking-widest opacity-60">
                  <Lock className="w-3 h-3" /> Secure Handshake Active
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[150] flex items-center gap-4 bg-green-500/10 border border-green-500/20 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-2xl"
          >
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <Check className="w-4 h-4 text-green-500" />
            </div>
            <div>
              <div className="text-[11px] font-black text-green-500 uppercase tracking-widest leading-none mb-1">Execution Success</div>
              <div className="text-[10px] text-white font-mono opacity-80 uppercase">Data retrieved from encrypted silo</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CommunityView = () => {
  return (
    <div className="pt-20 px-6 max-w-7xl mx-auto min-h-screen pb-32">
      <div className="text-center mb-20">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="font-display text-4xl md:text-7xl text-white mb-6"
        >
          The Intelligence <span className="text-primary italic">Network</span>
        </motion.h1>
        <p className="text-on-surface-variant text-lg max-w-2xl mx-auto leading-relaxed">
          Join the decentralized community of traders, developers, and autonomous agents building the future of market context.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        {[
          { icon: Twitter, title: "X / Twitter", desc: "Follow for real-time protocol updates and market signals.", color: "text-blue-400", bg: "bg-blue-400/5" },
          { icon: MessageCircle, title: "Discord", desc: "Collaborate with developers and technical analysts.", color: "text-indigo-400", bg: "bg-indigo-400/5" },
          { icon: Github, title: "GitHub", desc: "Contribute to our open-source agent integration kits.", color: "text-white", bg: "bg-white/5" }
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="bg-surface-container-high border border-white/5 p-8 rounded-[40px] hover:border-primary/30 transition-all group text-center"
          >
            <div className={`w-16 h-16 rounded-2xl ${item.bg} flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
              <item.icon className={`w-8 h-8 ${item.color}`} />
            </div>
            <h3 className="text-2xl font-display text-white mb-3 tracking-tight">{item.title}</h3>
            <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">{item.desc}</p>
            <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:text-white transition-colors">Join Now →</button>
          </motion.div>
        ))}
      </div>

      <div className="bg-primary/5 rounded-[48px] border border-primary/20 p-8 md:p-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5"><Zap className="w-48 h-48 text-primary" /></div>
        <div className="max-w-2xl relative z-10">
          <h2 className="text-3xl font-display text-white mb-4 tracking-tight">KabarChog DAO</h2>
          <p className="text-on-surface-variant mb-8 leading-relaxed">
            Governance is evolving. Participate in the selection of news sources, intelligence weights, and protocol parameters via the KCHO token governance.
          </p>
          <button className="bg-primary text-white px-8 py-4 rounded-2xl font-mono text-sm font-bold shadow-[0_0_30px_rgba(91,46,255,0.3)] hover:bg-accent transition-all">
            Access Governance
          </button>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: any, title: string, description: string }) => (
  <div className="bg-surface-container-low border border-white/10 p-6 rounded-xl hover:border-secondary transition-colors group">
    <Icon className="text-secondary w-8 h-8 mb-4 group-hover:scale-110 transition-transform" />
    <h3 className="font-display text-xl text-white mb-2">{title}</h3>
    <p className="text-sm text-on-surface-variant">{description}</p>
  </div>
);

const ApiCard = ({ borderColor, tag, title, description, latency, uptime, price }: any) => (
  <div className={`relative overflow-hidden group h-full`}>
    <div className={`bg-surface-container-high border-t-4 ${borderColor} p-8 rounded-xl h-full flex flex-col`}>
      <span className={`${borderColor.replace('border-', 'bg-')}/10 ${borderColor.replace('border-', 'text-')} px-3 py-1 rounded-full font-mono text-[10px] font-bold mb-6 inline-block w-fit`}>
        {tag}
      </span>
      <h3 className="font-display text-2xl text-white mb-4">{title}</h3>
      <p className="text-on-surface-variant mb-8 text-sm flex-grow">{description}</p>
      <div className="space-y-2 mb-8">
        <div className="flex justify-between font-mono text-[11px] text-on-surface-variant">
          <span>LATENCY</span>
          <span className={borderColor.replace('border-', 'text-')}>{latency}</span>
        </div>
        <div className="flex justify-between font-mono text-[11px] text-on-surface-variant">
          <span>UPTIME</span>
          <span className={borderColor.replace('border-', 'text-')}>{uptime}</span>
        </div>
      </div>
      <div className={`${borderColor.replace('border-', 'bg-')}/10 border ${borderColor.replace('border-', 'border-')}/20 p-3 rounded-lg text-center font-mono text-xs font-bold ${borderColor.replace('border-', 'text-')}`}>
        {price}
      </div>
    </div>
  </div>
);

const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const baseStyles = "px-6 py-3 rounded-xl font-mono text-sm font-bold transition-all flex items-center gap-2 justify-center";
  const variants: any = {
    primary: "bg-primary text-on-surface hover:shadow-[0_0_30px_rgba(91,46,255,0.4)] hover:bg-accent hover:text-background",
    secondary: "bg-surface-container-high text-on-surface border border-white/10 hover:border-accent hover:text-accent",
    outline: "border border-white/10 text-on-surface-variant hover:border-primary hover:text-primary bg-transparent"
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
};

const ParticleNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
    }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };

    const initParticles = () => {
      const count = Math.floor((canvas.width * canvas.height) / 15000);
      particles = Array.from({ length: Math.min(count, 120) }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 1,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = '#5B2EFF'; // primary
        ctx.globalAlpha = 0.3;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 180) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = '#C4B5FD'; // accent
            ctx.globalAlpha = (1 - dist / 180) * 0.12;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};

export default function App() {
  const [callsPerDay, setCallsPerDay] = useState(100000);
  const [activeFeed, setActiveFeed] = useState('TECHNICAL');
  const [currentView, setCurrentView] = useState('product');

  const { isConnected, address } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const navigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWalletConnect = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect({ connector: injected() });
    }
  };

  return (
    <div className="min-h-screen bg-background selection:bg-secondary/30 selection:text-white overflow-x-hidden">
      <ParticleNetwork />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="aurora-blob top-[-10%] left-[-5%] w-[600px] h-[600px] bg-primary/10" />
        <div className="aurora-blob bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-secondary/10" />
        <div className="perspective-grid absolute top-0 left-0 w-full h-[800px] opacity-[0.03]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#060211] via-transparent to-[#060211] opacity-60" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 w-full z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        <div className="flex justify-between items-center h-16 px-6 max-w-[1440px] mx-auto">
          <button
            onClick={() => navigate('product')}
            className="flex items-center gap-3 cursor-pointer bg-transparent border-none p-0 group"
          >
            <img
              alt="Logo"
              className="h-10 w-auto group-hover:scale-110 transition-transform"
              src="https://lh3.googleusercontent.com/aida/ADBb0ugomR1opaiB7fBL3L0d90eh9DO-zm5qWRHCgwPa6mI9YBuXFC3XrGYSkdo7qNhli86J5U6BjphKq9-Xfr1vR1oaCe4-1-lE0xQw_ZEUEFiteZ00LOxjrKEgRdDWjCiQQdkrZUAyt9oWTRBT3eRlshRG1VUoEGMReNLV50ZX_-7xHaMKTGQzFbkxXlMewDZEIBlaeY2iTSjL1uU0crsz_t_EZ4cApjhUH3qOs9ZuInQck8AswNtjlzk5l1rvM20glakQ1GjlReRENw"
            />
            <div className="text-xl font-black text-on-surface font-mono tracking-tighter after:content-['_'] after:animate-pulse after:text-primary">KabarChog_</div>
          </button>

          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => navigate('product')}
              className={`font-mono text-sm transition-colors cursor-pointer ${currentView === 'product' ? 'text-primary border-b border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Home
            </button>
            <button
              onClick={() => navigate('demo')}
              className={`font-mono text-sm transition-colors cursor-pointer ${currentView === 'demo' ? 'text-primary border-b border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Demo
            </button>
            <button
              onClick={() => navigate('docs')}
              className={`font-mono text-sm transition-colors cursor-pointer ${currentView === 'docs' ? 'text-primary border-b border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Docs
            </button>
            <button
              onClick={() => navigate('community')}
              className={`font-mono text-sm transition-colors cursor-pointer ${currentView === 'community' ? 'text-primary border-b border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
            >
              Community
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:flex items-center gap-2 bg-secondary/10 border border-secondary/30 text-secondary px-3 py-1 rounded-full font-mono text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              {isConnected ? 'CONNECTED' : 'x402 Badge'}
            </span>
            <Button
              onClick={handleWalletConnect}
              className={`px-5 py-2 !text-[11px] ${isConnected ? '!bg-green-500/10 !text-green-500 !border-green-500/30' : ''}`}
            >
              {isConnected ? `${address?.slice(0, 5)}...${address?.slice(-2)}` : 'Connect Wallet'}
            </Button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {currentView === 'product' && (
            <motion.div
              key="product"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Ticker */}
              <div className="bg-surface-container py-4 border-b border-white/5 overflow-hidden relative z-40">
                <div className="flex animate-marquee whitespace-nowrap gap-12 items-center w-max">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex gap-12 items-center">
                      <span className="flex items-center gap-2 font-mono text-sm">
                        <span className="bg-tertiary/10 text-tertiary px-2 py-0.5 rounded text-[10px] font-bold">BULLISH</span> BTC +4.2%
                      </span>
                      <span className="flex items-center gap-2 font-mono text-sm">
                        <span className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded text-[10px] font-bold">BEARISH</span> SOL -1.8%
                      </span>
                      <span className="flex items-center gap-2 font-mono text-sm">
                        <span className="bg-tertiary/10 text-tertiary px-2 py-0.5 rounded text-[10px] font-bold">BULLISH</span> ETH +2.1%
                      </span>
                      <span className="flex items-center gap-2 font-mono text-sm">
                        <span className="bg-tertiary/10 text-tertiary px-2 py-0.5 rounded text-[10px] font-bold">BULLISH</span> PEPE +12.4%
                      </span>
                      <span className="flex items-center gap-2 font-mono text-sm">
                        <span className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded text-[10px] font-bold">BEARISH</span> ARB -0.4%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Hero Section */}
              <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto text-center overflow-hidden">
                {/* Floating Background Code Snippets */}
                <div className="absolute inset-0 pointer-events-none z-[-1]">
                  {[
                    "agent.pay(402, 0.001 SAT)",
                    "GET /v1/market/depth HTTP/402",
                    "tx: 0x5b2eff...c4b5fd",
                    "RSI(BTC, 1H) -> 64.2",
                    "wallet_bal: 1.42 BTC",
                    "autonomous_mode: ENABLED",
                    "stream.connect('kabarchog')",
                    "HTTP 402: RELOAD_LIQUIDITY",
                    "fetch(api, key=x402_prod)",
                    "LOB_FLUX_DELTA: +0.002",
                    "sentiment_index: 0.82",
                    "agent_id: kabar_091x"
                  ].map((snippet, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{
                        opacity: [0, 0.12, 0],
                        y: [0, -100, 0],
                        x: [0, (i % 2 === 0 ? 20 : -20), 0]
                      }}
                      transition={{
                        duration: 8 + Math.random() * 10,
                        repeat: Infinity,
                        delay: i * 0.8,
                        ease: "easeInOut"
                      }}
                      className="absolute font-mono text-[9px] md:text-[11px] text-accent whitespace-nowrap opacity-0"
                      style={{
                        left: `${(i * 15) % 100}%`,
                        top: `${(i * 20) % 80 + 10}%`,
                      }}
                    >
                      {snippet}
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: [0, -10, 0],
                  }}
                  transition={{
                    opacity: { duration: 0.5 },
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="mb-6 flex justify-center"
                >
                  <img
                    src="https://lh3.googleusercontent.com/aida/ADBb0ugomR1opaiB7fBL3L0d90eh9DO-zm5qWRHCgwPa6mI9YBuXFC3XrGYSkdo7qNhli86J5U6BjphKq9-Xfr1vR1oaCe4-1-lE0xQw_ZEUEFiteZ00LOxjrKEgRdDWjCiQQdkrZUAyt9oWTRBT3eRlshRG1VUoEGMReNLV50ZX_-7xHaMKTGQzFbkxXlMewDZEIBlaeY2iTSjL1uU0crsz_t_EZ4cApjhUH3qOs9ZuInQck8AswNtjlzk5l1rvM20glakQ1GjlReRENw"
                    alt="Mascot Reading News"
                    className="w-20 h-20 md:w-24 md:h-24 drop-shadow-[0_0_20px_rgba(91,46,255,0.3)] object-contain"
                    referrerPolicy="no-referrer"
                  />
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="font-display text-[48px] md:text-[72px] text-on-surface leading-[1.1] mb-6 tracking-tight relative"
                >
                  <motion.span
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-tertiary bg-[length:200%_auto]"
                  >
                    Real-Time News, Structured for Smarter Decisions
                  </motion.span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-on-surface-variant text-lg max-w-3xl mx-auto mb-8"
                >
                  AI transforms breaking headlines into machine-readable insights, market signals, and actionable recommendations.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap justify-center gap-4 mb-16"
                >
                  <Button className="px-8 py-4 text-base">
                    <Wallet className="w-5 h-5" />
                    Connect Wallet
                  </Button>
                  <Button variant="secondary" className="px-8 py-4 text-base">
                    <Terminal className="w-5 h-5" />
                    View Demo
                  </Button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <IntelligencePanel />
                </motion.div>

                {/* Scroll Indicator */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 2, duration: 1 }}
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                  <span className="text-[9px] font-mono text-on-surface-variant uppercase tracking-widest opacity-60">Scroll to Explore</span>
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-1 h-3 rounded-full bg-primary/40"
                  />
                </motion.div>
              </section>

              {/* Problem / Why It Matters Section */}
              <section className="relative py-32 px-6 max-w-7xl mx-auto overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  {/* Left Side: Narrative */}
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary/10 border border-tertiary/20 text-tertiary text-[10px] font-bold uppercase tracking-widest mb-6">
                      <AlertTriangle className="w-3 h-3" /> The Context Gap
                    </div>
                    <h2 className="font-display text-4xl md:text-5xl text-on-surface mb-6 leading-tight">
                      Why Most Traders <br />
                      <span className="text-tertiary">React Too Late</span>
                    </h2>
                    <p className="text-on-surface-variant text-lg mb-12 max-w-lg leading-relaxed">
                      Markets don’t wait. News spreads instantly, sentiment shifts in seconds, and decisions made without context can become costly.
                    </p>

                    <div className="space-y-10">
                      {[
                        {
                          title: "Too Much Noise, Too Little Time",
                          desc: "Traders face endless streams of news and social updates, making it difficult to identify what truly matters.",
                          label: "High Noise",
                          color: "text-primary",
                          extra: (
                            <div className="mt-2 flex items-center gap-2 group-hover:text-primary transition-colors">
                              <motion.div
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-[10px] font-mono bg-primary/20 px-2 py-0.5 rounded"
                              >
                                942 irrelevant signals detected
                              </motion.div>
                            </div>
                          )
                        },
                        {
                          title: "The Market Moves Before You Do",
                          desc: "By the time you process a headline, sentiment has already shifted and prices have reacted.",
                          label: "Late Reaction",
                          color: "text-secondary",
                          extra: (
                            <div className="mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                              <span className="text-[10px] font-mono text-secondary">Delayed by 142ms</span>
                            </div>
                          )
                        },
                        {
                          title: "Insight-Free Headlines",
                          desc: "Knowing the news is not enough. You need to understand impact, confidence, and actionable paths.",
                          label: "Context Gap",
                          color: "text-accent",
                          extra: (
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              className="mt-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FF4D9D]/20 border border-[#FF4D9D]/30 text-[#FF4D9D] text-[10px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                            >
                              <AlertTriangle className="w-3 h-3" /> Warning: Insufficient Context
                            </motion.button>
                          )
                        }
                      ].map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.2 }}
                          className="group flex gap-6"
                        >
                          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-mono text-sm text-on-surface-variant group-hover:border-primary/50 group-hover:text-primary transition-all">
                            0{i + 1}
                          </div>
                          <div>
                            <div className={`text-[9px] font-bold uppercase tracking-[0.2em] mb-1 ${item.color}`}>
                              {item.label}
                            </div>
                            <h3 className="text-xl font-display text-on-surface mb-2 tracking-tight group-hover:translate-x-1 transition-transform">
                              {item.title}
                            </h3>
                            <p className="text-on-surface-variant text-sm leading-relaxed max-w-sm">
                              {item.desc}
                            </p>
                            {item.extra}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Right Side: Visual Chaos */}
                  <div className="relative h-[600px] flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/5 rounded-full blur-[120px] animate-pulse-slow" />

                    {/* Floating Chaos Elements */}
                    <div className="relative w-full max-w-md h-full space-y-4">
                      {[
                        { text: "$BTC -5.2% IN 2 MINS", color: "bg-[#FF4D9D]", top: "10%", left: "5%", rotate: -5 },
                        { text: "BREAKING: FED STATEMENT...", color: "bg-primary", top: "25%", right: "-10%", rotate: 3 },
                        { text: "SOCIAL SENTIMENT: CRITICAL", color: "bg-tertiary", bottom: "30%", left: "-15%", rotate: -8 },
                        { text: "INSUFFICIENT CONTEXT DETECTED", color: "bg-surface-container-highest", top: "45%", left: "20%", rotate: 2 },
                        { text: "ERROR: DELAYED SIGNAL", color: "bg-white/10", bottom: "15%", right: "0%", rotate: 12 },
                      ].map((alert, i) => (
                        <motion.div
                          key={i}
                          animate={{
                            y: [0, -20, 0],
                            x: [0, 10, 0],
                            rotate: [alert.rotate, alert.rotate + 5, alert.rotate]
                          }}
                          transition={{
                            duration: 4 + i,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.5
                          }}
                          className={`absolute p-4 rounded-xl border border-white/20 shadow-2xl backdrop-blur-md font-mono text-[10px] font-bold text-white whitespace-nowrap pointer-events-none`}
                          style={{
                            top: alert.top,
                            left: alert.left,
                            right: alert.right,
                            bottom: alert.bottom,
                            backgroundColor: `${alert.color}33`,
                            borderColor: alert.color
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full animate-ping`} style={{ backgroundColor: alert.color }} />
                            {alert.text}
                          </div>
                        </motion.div>
                      ))}

                      {/* Central "Pressure" Visual */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center z-[-1]"
                        animate={{ opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <div className="w-[300px] h-[300px] border-[0.5px] border-white/10 rounded-full flex items-center justify-center">
                          <div className="w-[200px] h-[200px] border-[0.5px] border-white/20 rounded-full flex items-center justify-center">
                            <div className="w-[100px] h-[100px] border-[0.5px] border-white/30 rounded-full" />
                          </div>
                        </div>
                      </motion.div>

                      {/* Overlapping Fake Chart Fragments */}
                      <motion.div
                        animate={{ opacity: [0.4, 0.6, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] opacity-20 pointer-events-none"
                      >
                        <svg viewBox="0 0 400 200" className="w-full h-full">
                          <path
                            d="M 0 100 Q 50 20, 100 150 T 200 80 T 300 180 T 400 50"
                            fill="none"
                            stroke="#5B2EFF"
                            strokeWidth="2"
                          />
                          <path
                            d="M 0 120 Q 80 50, 150 180 T 250 100 T 400 150"
                            fill="none"
                            stroke="#FF4D9D"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                          />
                        </svg>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Solution / Core Value Section */}
              <section className="relative py-32 px-6 max-w-7xl mx-auto overflow-hidden">
                <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                  <div className="w-[800px] h-[800px] bg-primary/5 rounded-full blur-[150px] animate-pulse-slow" />
                </div>

                <div className="relative z-10 text-center mb-24">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6"
                  >
                    <Zap className="w-3 h-3" /> The Transition
                  </motion.div>
                  <h2 className="font-display text-4xl md:text-6xl text-on-surface mb-6 leading-tight">
                    From Headlines to <br />
                    <span className="text-secondary">Actionable Intelligence</span>
                  </h2>
                  <p className="text-on-surface-variant text-lg max-w-2xl mx-auto leading-relaxed">
                    KabarChog transforms fast-moving news into structured insights that help traders and analysts act with speed and confidence.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative">
                  {/* Center Intelligence Hub (Visual Only for Radial feel in Grid) */}
                  <div className="order-1 lg:order-2 flex items-center justify-center p-8 bg-surface-container-high/40 rounded-[2rem] border-2 border-white/5 relative group overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-24 h-24 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center mb-6 relative">
                        <div className="absolute inset-0 rounded-full animate-ping bg-primary/20" />
                        <Cpu className="w-10 h-10 text-primary" />
                      </div>
                      <div className="font-mono text-xs font-bold text-on-surface tracking-widest uppercase mb-2">Central Core</div>
                      <div className="text-xl font-display text-primary text-center">KabarChog Engine</div>

                      {/* Simulated Processing Effect */}
                      <div className="mt-8 space-y-2 w-full max-w-[160px]">
                        {[0, 1, 2].map(i => (
                          <motion.div
                            key={i}
                            animate={{ opacity: [0.2, 1, 0.2], x: [-5, 5, -5] }}
                            transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                            className="h-1 bg-white/5 rounded-full overflow-hidden"
                          >
                            <motion.div
                              animate={{ width: ["0%", "100%", "0%"] }}
                              transition={{ duration: 3, delay: i * 0.7, repeat: Infinity }}
                              className="h-full bg-primary"
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Orbiting Modules */}
                  <div className="order-2 lg:order-1 space-y-8">
                    {/* Module 1: Real-Time Updates */}
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-surface-container-low/40 p-8 rounded-3xl border border-white/5 hover:border-primary/30 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex gap-1">
                          {["Always On", "Instant"].map(l => (
                            <span key={l} className="px-2 py-0.5 bg-white/5 rounded text-[8px] text-on-surface-variant font-mono uppercase">{l}</span>
                          ))}
                        </div>
                      </div>
                      <h3 className="text-2xl font-display text-on-surface mb-3 tracking-tight">Stay Ahead of Breaking Signals</h3>
                      <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                        KabarChog continuously monitors high-impact sources and delivers news the moment it happens.
                      </p>
                      <div className="bg-black/20 rounded-xl p-3 border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                          <span className="text-[10px] font-mono text-primary font-bold">LIVE FEED</span>
                        </div>
                        <div className="text-[10px] font-mono text-on-surface-variant italic truncate">
                          {">> "} New signal detected: $NVDA earnings impact...
                        </div>
                      </div>
                    </motion.div>

                    {/* Module 2: AI Summary */}
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-surface-container-low/40 p-8 rounded-3xl border border-white/5 hover:border-secondary/30 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center">
                          <Zap className="w-6 h-6 text-secondary" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-display text-on-surface mb-3 tracking-tight">Understand Faster</h3>
                      <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                        Complex reports and breaking stories are condensed into clear, digestible summaries in seconds.
                      </p>
                      <div className="relative h-24 bg-black/20 rounded-xl border border-white/5 overflow-hidden group-hover:border-secondary/20 transition-colors px-4 py-3">
                        <motion.div
                          initial={{ y: 0 }}
                          animate={{ y: [0, -10, 0] }}
                          transition={{ duration: 4, repeat: Infinity }}
                          className="text-[10px] font-mono text-secondary/60 leading-relaxed mb-2"
                        >
                          The FOMC minutes indicated that governors are increasingly concerned about inflation persistence...
                        </motion.div>
                        <div className="h-px bg-white/10 my-2" />
                        <div className="text-[10px] font-mono text-on-surface font-bold">
                          [AI RECAP]: Hawkish tilt, inflation remains priority.
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <div className="order-3 space-y-8">
                    {/* Module 3: Sentiment & Impact */}
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-surface-container-low/40 p-8 rounded-3xl border border-white/5 hover:border-accent/30 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                          <Database className="w-6 h-6 text-accent" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-display text-on-surface mb-3 tracking-tight">Sentiment & Impact</h3>
                      <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                        Know how the market feels and see what moves before prices react through asset-node correlation.
                      </p>
                      <div className="flex items-center gap-6 bg-black/20 rounded-xl p-4 border border-white/5">
                        <div className="flex-1">
                          <div className="text-[9px] font-mono text-accent mb-2 uppercase">Sentiment Polarity</div>
                          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              animate={{ width: ["10%", "85%", "60%"] }}
                              transition={{ duration: 5, repeat: Infinity }}
                              className="h-full bg-accent"
                            />
                          </div>
                        </div>
                        <div className="text-xl font-display text-accent">82%</div>
                      </div>
                    </motion.div>

                    {/* Module 4: Actionable Strategy */}
                    <motion.div
                      whileHover={{ y: -5 }}
                      className="bg-surface-container-low/40 p-8 rounded-3xl border border-white/5 hover:border-tertiary/30 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center">
                          <ArrowRight className="w-6 h-6 text-tertiary" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-display text-on-surface mb-3 tracking-tight">Turn Insight into Strategy</h3>
                      <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                        Receive clear next-step recommendations based on market conditions and technical relevance.
                      </p>
                      <div className="p-4 bg-tertiary/5 border border-tertiary/20 rounded-xl">
                        <div className="text-[9px] font-bold text-tertiary uppercase tracking-widest mb-2">Automated Strategy</div>
                        <div className="text-[11px] text-on-surface font-mono leading-tight">
                          SUGGESTION: Hedging long positions recommended due to high volatility detected in sector.
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* How It Works Section */}
              <section className="py-32 px-6 max-w-7xl mx-auto overflow-hidden">
                <div className="text-center mb-20">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest mb-6"
                  >
                    <Layers className="w-3 h-3" /> The Process
                  </motion.div>
                  <h2 className="font-display text-4xl md:text-6xl text-on-surface mb-6 leading-tight">
                    How Intelligence <br />
                    <span className="text-secondary">Becomes Action</span>
                  </h2>
                  <p className="text-on-surface-variant text-lg max-w-2xl mx-auto leading-relaxed">
                    From raw headlines to strategic recommendations — every signal passes through a structured AI-powered pipeline.
                  </p>
                </div>

                <div className="relative flex flex-col items-center">
                  {/* Pipeline Container (Desktop: Horizontal, Mobile: Vertical) */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-4 relative w-full">
                    {/* Connection Lines (Desktop) */}
                    <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] h-px bg-white/5 z-0">
                      <motion.div
                        animate={{ left: ["0%", "100%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute top-1/2 -translate-y-1/2 w-48 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent"
                      />
                    </div>

                    {[
                      {
                        title: "Collect",
                        desc: "Continuously gather high-impact news, financial reports, and market signals from trusted global sources in real time.",
                        icon: Globe,
                        color: "text-primary",
                        bg: "bg-primary/10",
                        labels: ["Live Feeds", "Global Sources", "Instant Capture"],
                        visual: (
                          <div className="flex gap-1 justify-center">
                            {[0, 1, 2].map(i => (
                              <motion.div
                                key={i}
                                animate={{ opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                                className="w-1.5 h-1.5 rounded-full bg-primary"
                              />
                            ))}
                          </div>
                        )
                      },
                      {
                        title: "Analyze",
                        desc: "AI engines summarize content, detect sentiment, evaluate relevance, and identify potential market impact.",
                        icon: Cpu,
                        color: "text-secondary",
                        bg: "bg-secondary/10",
                        labels: ["Summarization", "Sentiment", "Impact Detection"],
                        visual: (
                          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              animate={{ width: ["10%", "90%", "40%"] }}
                              transition={{ duration: 4, repeat: Infinity }}
                              className="h-full bg-secondary"
                            />
                          </div>
                        )
                      },
                      {
                        title: "x402 Payment Core Agent",
                        desc: "Autonomous payment routing enables secure access to premium intelligence modules and services on demand.",
                        icon: Wallet,
                        color: "text-accent",
                        bg: "bg-accent/10",
                        labels: ["Autonomous", "Modular Access", "Secure"],
                        visual: (
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="w-4 h-4 rounded border-2 border-accent/40"
                          />
                        )
                      },
                      {
                        title: "Suggest",
                        desc: "Deliver clear recommendations, risk context, and timing guidance so users can act with confidence.",
                        icon: CheckCircle2,
                        color: "text-tertiary",
                        bg: "bg-tertiary/10",
                        labels: ["Actionable", "Confidence", "Decision Support"],
                        visual: (
                          <div className="flex flex-col gap-1 w-full max-w-[40px] mx-auto">
                            <div className="h-1 bg-tertiary/40 rounded-full" />
                            <div className="h-1 bg-tertiary/20 rounded-full w-2/3" />
                          </div>
                        )
                      }
                    ].map((step, i) => (
                      <motion.div
                        key={step.title}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 }}
                        className="relative z-10 flex flex-col items-center text-center group"
                      >
                        {/* Step Node */}
                        <div className={`w-24 h-24 rounded-3xl ${step.bg} border border-white/5 flex flex-col items-center justify-center mb-8 group-hover:border-${step.color.split('-')[1]}/30 transition-all shadow-xl backdrop-blur-md`}>
                          <step.icon className={`w-8 h-8 ${step.color} mb-2`} />
                          <div className="h-6 flex items-center justify-center w-full px-4">
                            {step.visual}
                          </div>
                        </div>

                        {/* Step Info */}
                        <div className="font-mono text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Step 0{i + 1}</div>
                        <h3 className="text-2xl font-display text-on-surface mb-4 tracking-tight">{step.title}</h3>
                        <p className="text-on-surface-variant text-sm leading-relaxed mb-8 max-w-[200px]">
                          {step.desc}
                        </p>

                        {/* Micro Labels */}
                        <div className="flex flex-wrap justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          {step.labels.map(label => (
                            <span key={label} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-[7px] font-mono text-on-surface-variant uppercase whitespace-nowrap">
                              {label}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>



              {/* Product Showcase / Dashboard Preview Section */}
              <section id="demo" className="py-32 px-6 max-w-7xl mx-auto relative">
                <div className="text-center mb-20 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6"
                  >
                    <Cpu className="w-3 h-3" /> Live Demo
                  </motion.div>
                  <h2 className="font-display text-4xl md:text-6xl text-on-surface mb-6 leading-tight">
                    See Intelligence <br />
                    <span className="text-secondary">in Action</span>
                  </h2>
                  <p className="text-on-surface-variant text-lg max-w-2xl mx-auto leading-relaxed">
                    Explore how KabarChog transforms market-moving events into actionable insights in real time.
                  </p>
                </div>

                <DashboardPreview />

                {/* Decorative background flare */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
              </section>


              {/* API Marketplace Section */}
              <section id="api-access" className="py-32 px-6 max-w-7xl mx-auto">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                  {[
                    {
                      id: 'NEWS',
                      title: 'News API',
                      price: 0.50,
                      description: 'Structured news intelligence and sentiment extraction.',
                      color: '#FF4D9D',
                      latency: '120ms',
                      endpoint: 'GET /v1/news/intelligence'
                    },
                    {
                      id: 'TECHNICAL',
                      title: 'Technical Analysis API',
                      price: 0.30,
                      description: 'Trend detection and chart-based context.',
                      color: '#7DD3FC',
                      latency: '45ms',
                      endpoint: 'GET /v1/market/technical'
                    },
                    {
                      id: 'MARKET',
                      title: 'Market Data API',
                      price: 0.01,
                      description: 'Lightweight real-time asset pricing.',
                      color: '#34D399',
                      latency: '12ms',
                      endpoint: 'GET /v1/market/pricing'
                    }
                  ].map((api, i) => (
                    <motion.div
                      key={api.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setActiveFeed(api.id)}
                      className={`group bg-surface-container border rounded-[32px] overflow-hidden transition-all flex flex-col cursor-pointer relative ${activeFeed === api.id ? 'border-primary shadow-[0_0_30px_rgba(91,46,255,0.1)]' : 'border-white/5 hover:border-white/10'
                        }`}
                    >
                      {activeFeed === api.id && (
                        <div className="absolute top-4 right-4 animate-pulse">
                          <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_#5B2EFF]" />
                        </div>
                      )}
                      <div className="p-8 flex-1">
                        <div className="flex justify-between items-start mb-6">
                          <div className="flex items-center gap-3">
                            <h3 className="font-display text-2xl text-white">{api.title}</h3>
                          </div>
                        </div>
                        <div className="flex items-baseline gap-1 mb-6">
                          <span className="text-3xl font-mono text-white tracking-tighter">${api.price}</span>
                          <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest opacity-50">/ unit</span>
                        </div>
                        <p className="text-on-surface-variant text-sm mb-8 leading-relaxed">
                          {api.description}
                        </p>

                        <div className="space-y-4">
                          <div className="flex justify-between items-center bg-white/5 rounded-2xl px-4 py-3">
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Avg Latency</span>
                            <span className="font-mono text-xs text-on-surface">{api.latency}</span>
                          </div>
                          <div className="bg-black/40 rounded-2xl p-5 border border-white/5">
                            <div className="text-[9px] font-mono text-on-surface-variant mb-3 uppercase tracking-widest opacity-40">ENDPOINT Preview</div>
                            <div className="font-mono text-[11px] text-secondary truncate">{api.endpoint}</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-t border-white/5 bg-white/[0.02] flex justify-center group-hover:bg-primary/5 transition-colors">
                        <button className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest hover:text-white transition-colors">View Documentation →</button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Calculator Integrated */}
                <div className="bg-surface-container rounded-[40px] border border-white/10 p-8 md:p-16 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Cpu className="w-48 h-48 text-secondary" />
                  </div>
                  <div className="max-w-3xl mx-auto relative z-10 text-center">
                    <h3 className="font-display text-4xl text-white mb-4">Cost Estimator</h3>
                    <p className="text-on-surface-variant mb-12">See how your consumption scales with autonomous agents.</p>

                    <div className="space-y-16">
                      <div>
                        <div className="flex justify-between items-center mb-6">
                          <div className="text-left">
                            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-1">CALLS PER DAY</label>
                            <div className="text-2xl font-mono text-white">{callsPerDay.toLocaleString()}</div>
                          </div>
                          <div className="flex gap-2">
                            {[10000, 100000, 500000, 1000000].map(val => (
                              <button
                                key={val}
                                onClick={() => setCallsPerDay(val)}
                                className={`px-3 py-1 rounded-full font-mono text-[10px] border transition-all ${callsPerDay === val ? 'bg-secondary/20 border-secondary text-secondary' : 'bg-white/5 border-white/10 text-on-surface-variant hover:border-white/20'
                                  }`}
                              >
                                {val >= 1000000 ? '1M' : val >= 1000 ? `${val / 1000}K` : val}
                              </button>
                            ))}
                          </div>
                        </div>
                        <input
                          type="range"
                          min="1000"
                          max="1000000"
                          step="1000"
                          value={callsPerDay}
                          onChange={(e) => setCallsPerDay(Number(e.target.value))}
                          className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-secondary"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                        <div className="md:col-span-2 text-left">
                          <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest block mb-4">PAYMENT FLOW</span>
                          <div className="bg-black/60 rounded-2xl p-6 border border-white/5 font-mono text-[12px] leading-loose">
                            <div className="flex justify-between items-center text-primary mb-2">
                              <span>HTTP 402 Payment Required</span>
                              <span className="bg-primary/20 text-[9px] px-2 py-0.5 rounded">SYNC</span>
                            </div>
                            <div className="text-on-surface-variant opacity-60">
                              &gt; Authorization: x402-SAT {Math.round((callsPerDay / 1000) * (activeFeed === 'NEWS' ? 0.5 : activeFeed === 'TECHNICAL' ? 0.3 : 0.01) * 1540)}<br />
                              &gt; Receipt: {(Math.random() * 1000000000).toString(16)}<br />
                              &gt; Status: 200 OK
                            </div>
                          </div>
                        </div>
                        <div className="text-center md:text-right">
                          <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest block mb-1">DAILY ESTIMATE</span>
                          <div className="text-5xl font-display text-white tracking-tighter mb-2">
                            {Math.round((callsPerDay / 1000) * (activeFeed === 'NEWS' ? 0.5 : activeFeed === 'TECHNICAL' ? 0.3 : 0.01) * 1540).toLocaleString()} <span className="text-secondary text-2xl">SATS</span>
                          </div>
                          <span className="text-on-surface-variant opacity-50 text-sm font-mono block">
                            ≈ ${((callsPerDay / 1000) * (activeFeed === 'NEWS' ? 0.5 : activeFeed === 'TECHNICAL' ? 0.3 : 0.01)).toFixed(2)} USD
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>


              {/* Stats */}
              <section className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mb-20">
                  <div>
                    <div className="text-5xl font-display text-white mb-2 tracking-tight">500+</div>
                    <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">ACTIVE AGENTS</div>
                  </div>
                  <div>
                    <div className="text-5xl font-display text-white mb-2 tracking-tight">&lt;30ms</div>
                    <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">AVG LATENCY</div>
                  </div>
                  <div>
                    <div className="text-5xl font-display text-white mb-2 tracking-tight">10+</div>
                    <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">L1/L2 SUPPORTED</div>
                  </div>
                  <div>
                    <div className="text-5xl font-display text-white mb-2 tracking-tight">$0.01</div>
                    <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">MINIMUM SPEND</div>
                  </div>
                </div>


              </section>

              {/* Final CTA Section */}
              <section className="py-24 px-6 max-w-7xl mx-auto relative overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="relative z-10 text-center"
                >
                  {/* Background Access Frame - Portal Metaphor */}
                  <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none overflow-hidden h-[600px] -mt-40">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                      transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                      className="w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]"
                    />
                  </div>

                  <div className="max-w-4xl mx-auto bg-surface-container-high/40 p-12 md:p-24 rounded-[64px] border border-white/5 relative overflow-hidden group">
                    {/* Central Portal Metaphor elements */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden">
                      <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent -translate-x-1/2" />
                      <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent -translate-y-1/2" />

                      {/* Orbiting nodes effect */}
                      {[0, 1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "linear" }}
                          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[400px] h-[300px] md:h-[400px]"
                        >
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary/40 shadow-[0_0_10px_#5B2EFF]" />
                        </motion.div>
                      ))}
                    </div>

                    <div className="relative z-20">
                      <h2 className="font-display text-5xl md:text-7xl text-white mb-8 tracking-tighter leading-tight">
                        Your Edge Starts <span className="text-primary italic">Onchain</span>.
                      </h2>
                      <p className="text-on-surface-variant text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
                        Connect your wallet to access real-time intelligence, AI-powered insights, and modular market data services.
                      </p>

                      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            className="px-12 py-6 !text-lg shadow-[0_0_40px_rgba(91,46,255,0.4)] relative group overflow-hidden"
                          >
                            <span className="relative z-10">Connect Wallet Now</span>
                            <motion.div
                              initial={{ left: '-100%' }}
                              animate={{ left: '100%' }}
                              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                              className="absolute top-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                            />
                          </Button>
                        </motion.div>

                        <button className="px-12 py-6 border border-white/10 hover:border-white/20 text-white font-bold rounded-2xl transition-all font-mono text-sm tracking-widest uppercase bg-white/5 active:scale-95">
                          Explore API Access
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-white/5">
                        {[
                          { text: "No account required", color: "text-primary" },
                          { text: "Onchain-ready infrastructure", color: "text-secondary" },
                          { text: "Instant access to intelligence", color: "text-tertiary" }
                        ].map((item, i) => (
                          <div key={i} className="flex flex-col items-center gap-2">
                            <span className={`${item.color} text-lg`}>✦</span>
                            <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest font-bold">{item.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 0.4 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                    className="mt-20"
                  >
                    <span className="font-display text-2xl md:text-4xl text-on-surface-variant italic leading-tight block">
                      The market moves fast.<br />Your intelligence should move faster.
                    </span>
                  </motion.div>
                </motion.div>
              </section>
            </motion.div>
          )}

          {currentView === 'demo' && (
            <motion.div
              key="demo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DemoView
                onConnect={handleWalletConnect}
                isConnected={isConnected}
                walletAddress={address as string | null}
              />
            </motion.div>
          )}

          {currentView === 'docs' && (
            <motion.div
              key="docs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DocsView />
            </motion.div>
          )}

          {currentView === 'community' && (
            <motion.div
              key="community"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <CommunityView />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-surface-container-low border-t border-white/5 pt-24 pb-12 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-24">
            {/* Column 1: Brand Identity */}
            <div className="lg:col-span-4">
              <button
                onClick={() => navigate('product')}
                className="flex items-center gap-3 mb-6 bg-transparent border-none p-0 cursor-pointer text-left"
              >
                <img
                  alt="Logo"
                  className="h-10 w-auto"
                  src="https://lh3.googleusercontent.com/aida/ADBb0ugomR1opaiB7fBL3L0d90eh9DO-zm5qWRHCgwPa6mI9YBuXFC3XrGYSkdo7qNhli86J5U6BjphKq9-Xfr1vR1oaCe4-1-lE0xQw_ZEUEFiteZ00LOxjrKEgRdDWjCiQQdkrZUAyt9oWTRBT3eRlshRG1VUoEGMReNLV50ZX_-7xHaMKTGQzFbkxXlMewDZEIBlaeY2iTSjL1uU0crsz_t_EZ4cApjhUH3qOs9ZuInQck8AswNtjlzk5l1rvM20glakQ1GjlReRENw"
                />
                <div className="text-xl font-black text-on-surface font-mono tracking-tighter after:content-['_'] after:animate-pulse after:text-primary">KabarChog_</div>
              </button>
              <p className="text-on-surface-variant text-sm mb-8 leading-relaxed max-w-sm">
                AI-powered market intelligence for real-time decision makers. Structured intelligence layer for autonomous machine economies.
              </p>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold text-green-500 uppercase tracking-widest">System Active</span>
                </div>
                <div className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest opacity-40">
                  v2.4.0-stable
                </div>
              </div>
            </div>

            {/* Column 2: Product */}
            <div className="lg:col-span-2">
              <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-8">Product</h4>
              <ul className="space-y-4">
                {[
                  { name: 'Features', action: () => navigate('product') },
                  { name: 'Dashboard', action: () => { navigate('product'); setTimeout(() => scrollToSection('demo'), 100); } },
                  { name: 'API Access', action: () => { navigate('product'); setTimeout(() => scrollToSection('api-access'), 100); } },
                  { name: 'Intelligence Engine', action: () => navigate('product') }
                ].map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={link.action}
                      className="text-on-surface-variant hover:text-primary text-sm transition-all hover:translate-x-1 inline-block cursor-pointer bg-transparent border-none p-0"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Resources */}
            <div className="lg:col-span-2">
              <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-8">Resources</h4>
              <ul className="space-y-4">
                {[
                  { name: 'Documentation', action: () => navigate('docs') },
                  { name: 'Developer Guide', action: () => navigate('docs') },
                  { name: 'Community', action: () => navigate('community') },
                  { name: 'Changelog', action: () => navigate('docs') }
                ].map((link) => (
                  <li key={link.name}>
                    <button
                      onClick={link.action}
                      className="text-on-surface-variant hover:text-primary text-sm transition-all hover:translate-x-1 inline-block cursor-pointer bg-transparent border-none p-0 text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Company */}
            <div className="lg:col-span-2">
              <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-8">Ecosystem</h4>
              <ul className="space-y-4">
                {['About', 'Privacy Policy', 'Terms of Service', 'Security'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-on-surface-variant hover:text-primary text-sm transition-all hover:translate-x-1 inline-block">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 5: Connect & Newsletter */}
            <div className="lg:col-span-2">
              <h4 className="text-white text-xs font-bold uppercase tracking-[0.2em] mb-8">Connect</h4>
              <div className="flex gap-4 mb-8">
                {[
                  { Icon: Twitter, label: 'X' },
                  { Icon: MessageCircle, label: 'Discord' },
                  { Icon: Github, label: 'GitHub' },
                  { Icon: Mail, label: 'Email' }
                ].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-on-surface-variant hover:text-white hover:border-white/20 hover:bg-white/10 transition-all"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Network Updates</p>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="agent@wallet.eth"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-xs font-mono text-white placeholder:text-on-surface-variant/30 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <button className="absolute right-2 top-1.5 p-1.5 text-primary hover:text-white transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center py-12 border-t border-white/5 gap-8">
            <div className="flex flex-col md:flex-row items-center gap-4 text-[10px] font-mono text-on-surface-variant uppercase tracking-widest font-bold">
              <span>© 2026 KabarChog</span>
              <span className="hidden md:block opacity-20">|</span>
              <span>Built for the decentralized intelligence era</span>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 font-mono text-[9px] text-on-surface-variant uppercase tracking-widest">
                UPTIME: <span className="text-green-500">99.98%</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[9px] font-black text-secondary tracking-widest uppercase">
                Powered on Monad
              </div>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="group flex items-center gap-2 font-mono text-[10px] text-on-surface-variant hover:text-white transition-colors uppercase tracking-widest"
              >
                Back to top <ArrowUp className="w-3 h-3 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
