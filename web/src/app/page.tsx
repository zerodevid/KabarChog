"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, Wallet, Zap, Globe, Database, Cpu, ArrowRight, Layers, Clock, 
  AlertTriangle, TrendingUp, Search, MessageSquare, MessageCircle, Mail, ArrowUp 
} from 'lucide-react';

import { useAccount, useWalletClient, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { wrapFetchWithPayment } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm";
import { x402Client } from "@x402/core/client";

import { ParticleNetwork } from '@/components/landing/ParticleNetwork';
import { IntelligencePanel } from '@/components/landing/IntelligencePanel';
import { DashboardPreview } from '@/components/landing/DashboardPreview';
import { CommunityView } from '@/components/landing/CommunityView';
import { DocsView } from '@/components/landing/DocsView';

// --- Types ---
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

// --- Config ---
const x402Config = {
  chainId: "eip155:10143" as const,
  usdcAddress: "0x534b2f3A21130d7a60830c2Df862319e593943A3",
  facilitator: "https://x402-facilitator.molandak.org",
  price: "0.001",
};

const Button = ({ children, variant = 'primary', className = '', ...props }: any) => {
  const baseStyles = "px-6 py-3 rounded-xl font-mono text-sm font-bold transition-all flex items-center gap-2 justify-center cursor-pointer border-none";
  const variants: any = {
    primary: "bg-primary text-white hover:shadow-[0_0_30px_rgba(91,46,255,0.4)] hover:bg-secondary",
    secondary: "bg-white/5 text-on-surface border border-white/10 hover:border-secondary hover:text-secondary",
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

export default function Home() {
  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [events, setEvents] = useState<MarketEvent[]>([]);
  const [tickers, setTickers] = useState<any[]>([]);
  const [currentView, setCurrentView] = useState('product');
  const [unlockStatus, setUnlockStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("Pay $0.001 USDC to unlock premium content");

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const navigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWalletAction = () => {
    if (isConnected) disconnect();
    else connect({ connector: injected() });
  };

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        if (Array.isArray(data)) setEvents(data);
      } catch (err) {
        console.error("Failed to fetch events", err);
      }
    }
    async function fetchTickers() {
      try {
        const res = await fetch("/api/tickers");
        const data = await res.json();
        if (Array.isArray(data)) setTickers(data);
      } catch (err) {
        console.error("Failed to fetch tickers", err);
      }
    }
    fetchEvents();
    fetchTickers();
  }, []);

  const handleUnlock = useCallback(async () => {
    if (!walletClient || !address) {
        connect({ connector: injected() });
        return;
    }
    setUnlockStatus("loading");
    setMessage("Processing payment via x402...");
    try {
      const evmSigner = {
        address: address as `0x${string}`,
        signTypedData: async (data: any) => {
          return walletClient.signTypedData({
            domain: data.domain,
            types: data.types,
            primaryType: data.primaryType,
            message: data.message,
          });
        },
      };
      const client = new x402Client().register(x402Config.chainId, new ExactEvmScheme(evmSigner));
      const paymentFetch = wrapFetchWithPayment(fetch, client);
      const response = await paymentFetch("/premium", { method: "GET" });
      if (!response.ok) throw new Error(`Unlock failed: ${response.status}`);
      const data = await response.json();
      setMessage("Successfully Unlocked: " + data.content);
      setUnlockStatus("success");
    } catch (err: any) {
      setUnlockStatus("error");
      setMessage(err.message || "Failed to unlock content");
    }
  }, [walletClient, address, connect]);

  return (
    <div className="min-h-screen bg-background selection:bg-secondary/30 selection:text-white overflow-x-hidden text-on-surface">
      <ParticleNetwork />

      {/* Navigation */}
      <nav className="sticky top-0 w-full z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl">
        <div className="flex justify-between items-center h-16 px-6 max-w-[1440px] mx-auto">
          <button onClick={() => navigate('product')} className="flex items-center gap-3 cursor-pointer bg-transparent border-none p-0 group">
            <img alt="Logo" className="h-10 w-auto group-hover:scale-110 transition-transform" src="https://lh3.googleusercontent.com/aida/ADBb0ugomR1opaiB7fBL3L0d90eh9DO-zm5qWRHCgwPa6mI9YBuXFC3XrGYSkdo7qNhli86J5U6BjphKq9-Xfr1vR1oaCe4-1-lE0xQw_ZEUEFiteZ00LOxjrKEgRdDWjCiQQdkrZUAyt9oWTRBT3eRlshRG1VUoEGMReNLV50ZX_-7xHaMKTGQzFbkxXlMewDZEIBlaeY2iTSjL1uU0crsz_t_EZ4cApjhUH3qOs9ZuInQck8AswNtjlzk5l1rvM20glakQ1GjlReRENw" />
            <div className="text-xl font-black text-on-surface font-mono tracking-tighter after:content-['_'] after:animate-pulse after:text-primary">KabarChog_</div>
          </button>
          <div className="hidden md:flex items-center gap-6">
            {['product', 'docs', 'community'].map(v => (
              <button key={v} onClick={() => navigate(v)} className={`font-mono text-sm transition-colors cursor-pointer bg-transparent border-none uppercase ${currentView === v ? 'text-primary border-b border-primary' : 'text-on-surface-variant hover:text-on-surface'}`}>
                {v}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Button onClick={handleWalletAction} className={`px-5 py-2 !text-[11px] ${isConnected ? '!bg-green-500/10 !text-green-500 !border-green-500/30' : ''}`}>
              {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-2)}` : 'Connect Wallet'}
            </Button>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {currentView === 'product' && (
            <motion.div key="product" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="bg-surface-container py-4 border-b border-white/5 overflow-hidden relative z-40">
                <div className="flex animate-marquee whitespace-nowrap gap-12 items-center w-max">
                    {[...Array(2)].map((_, i) => (
                    <div key={i} className="flex gap-12 items-center">
                        {tickers.length > 0 ? tickers.map((t, idx) => (
                            <span key={idx} className="flex items-center gap-2 font-mono text-sm">
                                <span className={`${t.sentiment === 'BULLISH' ? 'bg-tertiary/10 text-tertiary' : 'bg-red-500/10 text-red-400'} px-2 py-0.5 rounded text-[10px] font-bold`}>
                                    {t.sentiment}
                                </span> 
                                {t.symbol} {t.change}
                            </span>
                        )) : (
                            <>
                                <span className="flex items-center gap-2 font-mono text-sm"><span className="bg-tertiary/10 text-tertiary px-2 py-0.5 rounded text-[10px] font-bold">BULLISH</span> BTC +4.2%</span>
                                <span className="flex items-center gap-2 font-mono text-sm"><span className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded text-[10px] font-bold">BEARISH</span> SOL -1.8%</span>
                                <span className="flex items-center gap-2 font-mono text-sm"><span className="bg-tertiary/10 text-tertiary px-2 py-0.5 rounded text-[10px] font-bold">BULLISH</span> ETH +2.1%</span>
                                <span className="flex items-center gap-2 font-mono text-sm"><span className="bg-red-500/10 text-red-400 px-2 py-0.5 rounded text-[10px] font-bold">BEARISH</span> ARB -0.4%</span>
                            </>
                        )}
                    </div>
                    ))}
                </div>
              </div>

              <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto text-center overflow-hidden">
                <motion.h1 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="font-display text-[48px] md:text-[72px] text-on-surface leading-[1.1] mb-6 tracking-tight">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-tertiary">Real-Time News, Structured for Smarter Decisions</span>
                </motion.h1>
                <p className="text-on-surface-variant text-lg max-w-3xl mx-auto mb-8">AI transforms breaking headlines into machine-readable insights and actionable recommendations.</p>
                <div className="flex flex-wrap justify-center gap-4 mb-16">
                    <Button onClick={handleWalletAction} className="px-8 py-4 text-base"><Wallet className="w-5 h-5" /> {isConnected ? "Connected" : "Connect Wallet"}</Button>
                    <Button onClick={() => scrollToSection('demo')} variant="secondary" className="px-8 py-4 text-base"><Terminal className="w-5 h-5" /> View Live Feed</Button>
                </div>
                <IntelligencePanel event={events[0]} />
              </section>

              <section id="demo" className="py-32 px-6 max-w-7xl mx-auto text-center">
                <h2 className="font-display text-4xl md:text-6xl text-on-surface mb-12">See Intelligence in Action</h2>
                <DashboardPreview events={events} />
              </section>

              <section id="api-access" className="py-32 px-6 max-w-7xl mx-auto">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {['News API', 'Technical Indicators', 'Market Data'].map(title => (
                        <div key={title} className="bg-surface-container border border-white/5 p-8 rounded-[32px] text-left hover:border-primary/30 transition-all">
                            <h3 className="font-display text-2xl text-white mb-4">{title}</h3>
                            <p className="text-on-surface-variant text-sm mb-6">Autonomous intelligence modules for your agents.</p>
                            <Button variant="secondary" className="w-full">Access Module</Button>
                        </div>
                    ))}
                 </div>
                 <div className="bg-surface-container rounded-[40px] border border-white/10 p-12 text-left">
                    <h3 className="font-display text-4xl text-white mb-6">Premium AI Reports</h3>
                    <Button onClick={handleUnlock} className="mb-4">{unlockStatus === "loading" ? "Unlocking..." : "Unlock with x402"}</Button>
                    <p className="text-on-surface-variant italic text-sm">{message}</p>
                 </div>
              </section>
            </motion.div>
          )}
          {currentView === 'docs' && <DocsView />}
          {currentView === 'community' && <CommunityView />}
        </AnimatePresence>
      </main>

      <footer className="bg-surface-container-low border-t border-white/5 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-left">
                <div className="text-xl font-black text-on-surface font-mono tracking-tighter mb-2 italic">KabarChog_</div>
                <p className="text-on-surface-variant text-xs">AI-powered market intelligence for the decentralized era.</p>
            </div>
            <div className="flex gap-4">
                <MessageSquare className="w-5 h-5 text-on-surface-variant cursor-pointer hover:text-white" />
                <Globe className="w-5 h-5 text-on-surface-variant cursor-pointer hover:text-white" />
            </div>
        </div>
      </footer>
    </div>
  );
}
