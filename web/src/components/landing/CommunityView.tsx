"use client";

import { motion } from 'motion/react';
import { MessageCircle, Zap, MessageSquare, Globe } from 'lucide-react';

export const CommunityView = () => {
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
            { icon: MessageSquare, title: "X / Twitter", desc: "Follow for real-time protocol updates and market signals.", color: "text-blue-400", bg: "bg-blue-400/5" },
            { icon: MessageCircle, title: "Discord", desc: "Collaborate with developers and technical analysts.", color: "text-indigo-400", bg: "bg-indigo-400/5" },
            { icon: Globe, title: "GitHub", desc: "Contribute to our open-source agent integration kits.", color: "text-white", bg: "bg-white/5" }
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
               <button className="text-[10px] font-bold text-primary uppercase tracking-widest hover:text-white transition-colors bg-transparent border-none cursor-pointer">Join Now →</button>
            </motion.div>
          ))}
       </div>

       <div className="bg-primary/5 rounded-[48px] border border-primary/20 p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5"><Zap className="w-48 h-48 text-primary" /></div>
          <div className="max-w-2xl relative z-10 text-left">
             <h2 className="text-3xl font-display text-white mb-4 tracking-tight">KabarChog DAO</h2>
             <p className="text-on-surface-variant mb-8 leading-relaxed">
                Governance is evolving. Participate in the selection of news sources, intelligence weights, and protocol parameters via the KCHO token governance.
             </p>
             <button className="bg-primary text-white px-8 py-4 rounded-2xl font-mono text-sm font-bold shadow-[0_0_30px_rgba(91,46,255,0.3)] hover:bg-secondary transition-all cursor-pointer border-none">
                Access Governance
             </button>
          </div>
       </div>
    </div>
  );
};
