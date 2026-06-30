import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ArrowLeft, Globe, Zap, Search, Activity, AlertCircle } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";

// Placeholder for future Alpha Vantage API integration
const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;

export default function MarketNews() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  // Mock data to simulate API response before key is added
  const mockArticles = [
    {
      title: "Federal Reserve Signals Potential Rate Cuts by Year-End Amid Cooling Inflation Data",
      summary: "The latest core PCE data suggests inflation is finally reaching the Fed's 2% target, prompting markets to price in up to 50 bps in rate cuts.",
      source: "Macro Insights",
      time: "2 hours ago",
      tag: "MACRO"
    },
    {
      title: "Tech Giants See Massive Inflows Following AI Infrastructure Earnings Reports",
      summary: "Semiconductor and cloud service providers posted double-digit revenue growth, driving the Nasdaq to new all-time highs.",
      source: "Tech Finance Daily",
      time: "4 hours ago",
      tag: "EQUITY"
    },
    {
      title: "Gold Stabilizes Above $2,400 as Central Banks Continue Record Accumulation",
      summary: "Emerging market central banks added another 45 tonnes of gold to their reserves in the last quarter, providing strong support for bullion prices.",
      source: "Commodity Wrap",
      time: "5 hours ago",
      tag: "COMMODITIES"
    },
    {
      title: "SEBI Announces Strict New Guidelines for Derivative Trading Volumes",
      summary: "In a move to curb excessive retail speculation, the regulator has increased lot sizes and margin requirements for index options.",
      source: "Regulatory Update",
      time: "8 hours ago",
      tag: "REGULATION"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar (reused structure from Dashboard for consistency) */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-premium border-b border-surface-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-bold gradient-text-amber hover:brightness-125 transition-all text-premium">Ratio x</Link>
          <div className="flex items-center gap-6">
            <Link 
              to="/dashboard" 
              className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground hover:text-amber transition-colors"
            >
              Drift Engine
            </Link>
            <Link 
              to="/news" 
              className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-background hover:brightness-110 transition-premium border border-amber/20 bg-amber px-4 py-1.5 rounded-[4px] font-semibold shadow-glow-amber"
            >
              Market News
            </Link>
            <span className="text-xs text-muted-foreground font-body hidden sm:block text-premium">{user?.email}</span>
            <button
              onClick={() => { signOut(); navigate("/"); }}
              className="text-sm text-muted-foreground hover:text-foreground font-body transition-colors text-premium"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-16 max-w-4xl mx-auto px-6">
        
        {/* Header Section with Elite Typography */}
        <div className="mb-16 relative">
          <div className="absolute -top-32 -left-32 w-64 h-64 bg-amber/5 rounded-full blur-3xl pointer-events-none" />
          
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-amber transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          
          <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground heading-premium tracking-tight leading-[1.1] mb-6">
            Global Market <br /> Intelligence.
          </h1>
          
          <p className="font-body text-lg text-muted-foreground max-w-2xl leading-relaxed text-premium">
            Real-time macroeconomic updates and financial news to inform your rebalancing strategy. Curated insights without the noise.
          </p>
        </div>

        {/* API Key Notice */}
        {!API_KEY && (
          <div className="mb-12 p-4 rounded-lg bg-surface border border-surface-border flex items-start gap-4 shadow-sm">
            <AlertCircle className="w-5 h-5 text-amber shrink-0 mt-0.5" />
            <div>
              <h3 className="font-mono text-sm uppercase tracking-widest text-foreground font-medium mb-1">Alpha Vantage Integration Pending</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">
                You are currently viewing mock data. To activate live news, add your Alpha Vantage API key to the <code className="bg-background px-1.5 py-0.5 rounded border border-surface-border font-mono text-[11px] text-amber">.env</code> file under <code className="bg-background px-1.5 py-0.5 rounded border border-surface-border font-mono text-[11px] text-amber">VITE_ALPHA_VANTAGE_API_KEY</code>.
              </p>
            </div>
          </div>
        )}

        {/* News Feed */}
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-surface-border pb-4">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-amber" />
              <h2 className="font-display text-xl font-semibold text-foreground tracking-wide">Latest Headlines</h2>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">
              <Zap className="w-3.5 h-3.5 text-amber/70 animate-pulse" />
              Live Feed
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {mockArticles.map((article, i) => (
              <article 
                key={i} 
                className="group relative p-6 rounded-[12px] bg-card/20 border border-surface-border/50 hover:bg-card/40 hover:border-amber/20 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                {/* Decorative hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[10px] font-mono text-amber/80 uppercase tracking-widest border border-amber/20 bg-amber/5 px-2 py-0.5 rounded">
                        {article.tag}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                        {article.source} • {article.time}
                      </span>
                    </div>
                    
                    <h3 className="font-display text-2xl font-medium text-foreground/90 group-hover:text-amber transition-colors duration-300 leading-snug mb-3">
                      {article.title}
                    </h3>
                    
                    <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-2 md:line-clamp-3">
                      {article.summary}
                    </p>
                  </div>
                  
                  <div className="hidden md:flex shrink-0 w-12 h-12 rounded-full border border-surface-border items-center justify-center group-hover:border-amber/30 group-hover:bg-amber/5 transition-colors">
                    <ArrowLeft className="w-4 h-4 rotate-[135deg] text-muted-foreground group-hover:text-amber transition-colors" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}
