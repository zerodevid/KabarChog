"use client";

import { motion } from 'motion/react';

export const DocsView = () => {
  const categories = [
    { name: "Getting Started", items: ["Introduction", "Quick Start", "x402 Protocol"] },
    { name: "Core APIs", items: ["Semantic News", "Technical Indicators", "Market Data"] },
    { name: "Authentication", items: ["Wallet Flow", "API Keys", "Security"] }
  ];

  return (
    <div className="pt-20 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 min-h-screen pb-32 text-left">
       <aside className="md:col-span-3">
          <div className="sticky top-32 space-y-10">
            {categories.map(cat => (
              <div key={cat.name}>
                <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4">{cat.name}</div>
                <ul className="space-y-3 font-mono text-xs list-none p-0">
                  {cat.items.map(item => (
                    <li key={item}>
                      <a href="#" className="text-on-surface-variant hover:text-white transition-colors block decoration-none">{item}</a>
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
            className="max-w-none"
          >
            <h1 className="font-display text-4xl md:text-6xl text-white mb-6">Documentation</h1>
            <p className="text-on-surface-variant text-lg mb-12 leading-relaxed">
              KabarChog is an autonomous intelligence layer built for machine economies. Integrate real-time market insights via the HTTP 402 protocol.
            </p>

            <div className="space-y-12">
               <section>
                  <h2 className="text-2xl font-display text-white mb-4">Authentication</h2>
                  <p className="text-on-surface-variant mb-6">KabarChog uses the x402 Protocol. No API keys are required for initial handshake; authentication happens via onchain balance verification.</p>
                  <div className="bg-black/60 rounded-2xl p-6 border border-white/10 font-mono text-sm leading-relaxed overflow-x-auto">
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
                        <div className="text-[10px] font-bold text-cyan-400 mb-3 uppercase tracking-widest">NPM INSTALL</div>
                        <div className="font-mono text-xs text-white">npm install @kabarchog/sdk</div>
                     </div>
                     <div className="bg-black/40 rounded-xl p-4 border border-white/10">
                        <div className="text-[10px] font-bold text-pink-400 mb-3 uppercase tracking-widest">CDN</div>
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
