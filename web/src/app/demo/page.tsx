"use client";

import { useState, useCallback, useEffect } from "react";
import { useAccount, useWalletClient, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { wrapFetchWithPayment } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm";
import { x402Client } from "@x402/core/client";

const ENDPOINTS = [
  { 
    name: "Live Feed", 
    path: "/api/feed/live", 
    method: "GET", 
    params: ["limit"],
    price: "$0.001",
    description: "Real-time stream of the latest market intelligence events from our monitoring engine."
  },
  { 
    name: "Ticker Feed", 
    path: "/api/feed/ticker/{symbol}", 
    method: "GET", 
    params: ["symbol"],
    price: "$0.002",
    description: "Targeted news flow specifically impacting your selected asset."
  },
  { 
    name: "Hourly Digest", 
    path: "/api/digest/hourly", 
    method: "GET", 
    params: [],
    price: "$0.003",
    description: "Narrative market summary of the last 60 minutes, synthesized by AI into a concise brief."
  },
  { 
    name: "Daily Digest", 
    path: "/api/digest/daily", 
    method: "GET", 
    params: [],
    price: "$0.005",
    description: "Comprehensive 24-hour market outlook and executive summary aggregated by AI."
  },
  { 
    name: "Sentiment Distribution", 
    path: "/api/ticker/{symbol}/sentiment", 
    method: "GET", 
    params: ["symbol"],
    price: "$0.002",
    description: "Statistical breakdown of market sentiment (Bullish vs Bearish) for specific assets."
  },
  { 
    name: "Trading Plan Analysis", 
    path: "/api/ticker/{symbol}/analysis", 
    method: "GET", 
    params: ["symbol"],
    price: "$0.01",
    description: "Pro-grade AI trading strategy with Entry, Take-Profit, and Stop-Loss levels."
  },
  { 
    name: "Custom Analysis", 
    path: "/api/analyze", 
    method: "POST", 
    params: ["text"],
    price: "$0.005",
    description: "Instant AI Market Analyst for any text, article, or social media post you provide."
  },
];

const x402Config = {
  chainId: "eip155:10143" as const,
  facilitator: "https://x402-facilitator.molandak.org",
};

export default function DemoPage() {
  const { isConnected, address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [selectedApi, setSelectedApi] = useState(ENDPOINTS[0]);
  const [params, setParams] = useState<Record<string, string>>({ symbol: "BTC", limit: "10", id: "", text: "" });
  const [tickers, setTickers] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch active tickers from DB
  useEffect(() => {
    async function fetchTickers() {
      try {
        const res = await fetch("/api/tickers");
        const data = await res.json();
        if (Array.isArray(data)) {
          setTickers(data);
          if (data.length > 0 && !params.symbol) {
            setParams(p => ({ ...p, symbol: data[0].symbol }));
          }
        }
      } catch (err) {
        console.error("Failed to fetch tickers", err);
      }
    }
    fetchTickers();
  }, []);

  const handleCall = useCallback(async () => {
    if (!walletClient || !address) return;

    setLoading(true);
    setError(null);
    setResult(null);

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

      let url = selectedApi.path;
      selectedApi.params.forEach(p => {
        if (url.includes(`{${p}}`)) {
          url = url.replace(`{${p}}`, params[p] || "");
        }
      });

      if (selectedApi.params.includes("limit") && params.limit) {
        url += `?limit=${params.limit}`;
      }

      const options: RequestInit = {
        method: selectedApi.method,
        headers: { "Content-Type": "application/json" },
      };

      if (selectedApi.method === "POST") {
        options.body = JSON.stringify({ text: params.text });
      }

      const response = await paymentFetch(url, options);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({ error: `Failed: ${response.status}` }));
        throw new Error(errData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [walletClient, address, selectedApi, params]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              API Explorer
            </h1>
            <p className="text-zinc-500">Test premium endpoints with gasless x402 micropayments.</p>
          </div>

          {!isConnected ? (
            <button
              onClick={() => connect({ connector: injected() })}
              className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all scale-105"
            >
              Connect Wallet
            </button>
          ) : (
            <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-xl">
              <div className="text-right">
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Active Account</p>
                <p className="text-sm font-bold font-mono">{address?.slice(0, 8)}...{address?.slice(-6)}</p>
              </div>
              <button onClick={() => disconnect()} className="text-red-500 hover:text-red-400 text-xs">OFF</button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Endpoints */}
          <div className="lg:col-span-4 space-y-3">
            <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Endpoints</h2>
            {ENDPOINTS.map((api) => (
              <button
                key={api.name}
                onClick={() => setSelectedApi(api)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedApi.name === api.name
                    ? "bg-indigo-600/10 border-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.1)]"
                    : "bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold">{api.name}</span>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      api.price === '$0.01'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : api.price === '$0.005'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : api.price === '$0.003'
                        ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                        : api.price === '$0.002'
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
                        : 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
                    }`}>
                      {api.price}
                    </span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${api.method === 'POST' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {api.method}
                    </span>
                  </div>
                </div>
                <code className="text-[10px] block opacity-50 truncate">{api.path}</code>
              </button>
            ))}
          </div>

          {/* Form & Playground */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 space-y-8">
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                      Playground: <span className="text-indigo-400">{(selectedApi as any).name}</span>
                    </h3>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-sm font-bold ${
                      (selectedApi as any).price === '$0.01'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        : (selectedApi as any).price === '$0.005'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                        : (selectedApi as any).price === '$0.003'
                        ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                        : (selectedApi as any).price === '$0.002'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                        : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                    }`}>
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                      </svg>
                      {(selectedApi as any).price} USDC
                    </div>
                  </div>
                  <p className="text-sm text-zinc-500 italic">
                    {(selectedApi as any).description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedApi.params.length === 0 && (
                    <div className="col-span-full py-4 text-zinc-500 italic text-sm">
                      No parameters required for this endpoint.
                    </div>
                  )}
                  {selectedApi.params.map(p => (
                    <div key={p} className="space-y-2">
                      <label className="text-xs text-zinc-500 font-mono uppercase">{p}</label>
                      {p === 'symbol' ? (
                        <select
                          value={params[p]}
                          onChange={(e) => setParams({ ...params, [p]: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                        >
                          {tickers.map(t => (
                            <option key={t.symbol} value={t.symbol}>{t.symbol} ({t.name})</option>
                          ))}
                          {tickers.length === 0 && <option disabled>Loading assets...</option>}
                        </select>
                      ) : p === 'text' ? (
                        <textarea
                          value={params[p]}
                          onChange={(e) => setParams({ ...params, [p]: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm focus:border-indigo-500 outline-none h-32 col-span-full"
                          placeholder="Enter text to analyze..."
                        />
                      ) : (
                        <input
                          type="text"
                          value={params[p]}
                          onChange={(e) => setParams({ ...params, [p]: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-sm focus:border-indigo-500 outline-none"
                          placeholder={`Enter ${p}...`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={handleCall}
                  disabled={loading || !isConnected}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 font-bold rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-[0.98]"
                >
                  {loading ? "Processing Micropayment..." : isConnected ? `Pay ${(selectedApi as any).price} & Call ${selectedApi.name}` : "Connect Wallet First"}
                </button>
              </div>

              {/* Result Area */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Response Body</h4>
                  {result && <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded italic">Payment Verified</span>}
                </div>
                
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                  <pre className="relative w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-xs font-mono overflow-auto max-h-[500px] scrollbar-thin scrollbar-thumb-zinc-800">
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                        <p className="text-zinc-500 animate-pulse">Awaiting signature & payment verification...</p>
                      </div>
                    ) : error ? (
                      <div className="text-red-400 bg-red-400/10 p-4 rounded-lg border border-red-400/20">
                        Error: {error}
                      </div>
                    ) : result ? (
                      JSON.stringify(result, null, 2)
                    ) : (
                      <div className="text-zinc-700 italic text-center py-12">
                        Execute a call to see live market data here.
                      </div>
                    )}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
