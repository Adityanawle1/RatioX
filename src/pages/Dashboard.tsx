import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getHoldings, getAssetTargets, getUserPortfolios, createPortfolio, deleteHolding, getUserProfile, getRebalanceLogs } from "@/api/portfolio";
import { calculateDrift, calculateHealthScore, HoldingWithValue, AssetClass, enrichHoldingsWithMarketData, DriftResult } from "@/lib/drift-engine";
import { refreshPrices } from "@/lib/market-data";
import { supabase, type Database } from "@/lib/supabase";

type PortfolioRow = Database['public']['Tables']['portfolios']['Row'];
type HoldingRow = Database['public']['Tables']['holdings']['Row'];
import AddHoldingModal from "@/components/AddHoldingModal";
import ImportCSVModal from "@/components/ImportCSVModal";
import RebalanceModal from "@/components/RebalanceModal";
import SharePortfolioModal from "@/components/SharePortfolioModal";
import { format } from "date-fns";
import { Share2, Lock } from "lucide-react";
import Disclaimer from "@/components/Disclaimer";

const statusColor = { healthy: "text-drift-green", drifting: "text-amber", critical: "text-drift-red" };
const statusBg = { healthy: "bg-drift-green", drifting: "bg-amber", critical: "bg-drift-red" };
const statusLabel = { healthy: "On Target", drifting: "Drifting", critical: "Critical" };

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState<PortfolioRow | null>(null);
  const [holdings, setHoldings] = useState<HoldingRow[]>([]);
  const [holdingsWithValues, setHoldingsWithValues] = useState<HoldingWithValue[]>([]);
  const [assetTargets, setAssetTargets] = useState<AssetClass[]>([]);
  const [driftResults, setDriftResults] = useState<DriftResult[]>([]);
  const [healthScore, setHealthScore] = useState(0);
  const [totalValue, setTotalValue] = useState(0);
  const [totalInvested, setTotalInvested] = useState(0);
  const [overallPnl, setOverallPnl] = useState(0);
  const [overallPnlPct, setOverallPnlPct] = useState(0);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [importCSVModalOpen, setImportCSVModalOpen] = useState(false);
  const [rebalanceModalOpen, setRebalanceModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [minsAgo, setMinsAgo] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [failedPriceSymbols, setFailedPriceSymbols] = useState<string[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [rebalanceLogs, setRebalanceLogs] = useState<any[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const calculatePortfolioMetrics = useCallback(async (rawHoldings: HoldingRow[], targets: AssetClass[]) => {
    // Fetch live prices with proper error handling
    const { prices, failedSymbols } = await refreshPrices(rawHoldings);
    setFailedPriceSymbols(failedSymbols || []);

    // Enrich holdings with market data, PnL, tax status, CAGR
    const enrichedHoldings = enrichHoldingsWithMarketData(rawHoldings, prices);
    setHoldingsWithValues(enrichedHoldings);

    // Calculate total portfolio value using market values
    const total = enrichedHoldings.reduce((s, h) => s + h.marketValue, 0);
    setTotalValue(total);

    const invested = enrichedHoldings.reduce((s, h) => s + h.costBasis, 0);
    setTotalInvested(invested);

    const pnl = total - invested;
    setOverallPnl(pnl);

    const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;
    setOverallPnlPct(pnlPct);

    // Calculate drift using corrected logic
    const drift = calculateDrift(enrichedHoldings, targets);
    setDriftResults(drift);

    // Calculate health score using corrected formula
    setHealthScore(calculateHealthScore(drift));

    const now = new Date();
    setLastUpdated(now);
    setMinsAgo(0);
  }, []);

  // Lightweight price-only refresh (no full reload, no loading spinner)
  const refreshDriftData = useCallback(async () => {
    if (!portfolio || holdings.length === 0) return;
    await calculatePortfolioMetrics(holdings, assetTargets);
  }, [portfolio, holdings, assetTargets, calculatePortfolioMetrics]);

  const initDashboard = useCallback(async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setFetchError(null);

      // Check if user needs risk profile setup - be lenient about missing risk_profile column
      const { data: profile } = await getUserProfile(user.id);
      
      // Only redirect to onboarding if explicitly not onboarded (ignore missing risk_profile for now)
      if (profile && (profile as any).onboarded === false) { 
        navigate("/onboarding"); 
        return; 
      }
      
      // If profile doesn't exist or onboarded is null/undefined, assume they can proceed
      // This handles the case where the database schema is incomplete

      const { data: portfolios, error: portError } = await getUserPortfolios(user.id);
      if (portError) throw portError;

      let p = portfolios?.[0] as PortfolioRow | undefined;
      if (!p) {
        const { data: newP, error: createError } = await createPortfolio(user.id, "My Portfolio");
        if (createError) throw createError;
        p = newP as PortfolioRow;
      }
      setPortfolio(p || null);

      if (p) {
        const [{ data: h, error: hError }, { data: t, error: tError }] = await Promise.all([
          getHoldings(p.id),
          getAssetTargets(p.id),
        ]);

        if (hError) throw hError;
        if (tError) throw tError;

        const { data: logs } = await getRebalanceLogs(p.id);
        setRebalanceLogs(logs || []);

        const loadedHoldings = h || [];
        const loadedTargets = t || [];
        setHoldings(loadedHoldings);

        const targets: AssetClass[] = loadedTargets.map((t: any) => ({
          name: t.asset_class, 
          targetPct: Number(t.target_pct), 
          driftThreshold: Number(t.drift_threshold || 5.0),
        }));
        setAssetTargets(targets);

        if (loadedHoldings.length > 0 && loadedTargets.length > 0) {
          await calculatePortfolioMetrics(loadedHoldings, targets);
        }
      }
    } catch (err: any) {
      console.error("Dashboard initialization failed:", err);
      setFetchError(err.message || "Failed to load portfolio data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [user, navigate, calculatePortfolioMetrics]);

  useEffect(() => {
    if (!user) return;
    
    initDashboard();

    // Setup intervals
    const refreshInterval = setInterval(() => {
      // Use the latest stability of metrics if possible, but keep simple for now
      refreshDriftData();
    }, 15 * 60 * 1000);

    const tickInterval = setInterval(() => {
      setLastUpdated((prev) => { 
        if (prev) setMinsAgo(Math.floor((Date.now() - prev.getTime()) / 60000)); 
        return prev; 
      });
    }, 60 * 1000);

    return () => {
      clearInterval(refreshInterval);
      clearInterval(tickInterval);
    };
    // Only re-run when user ID changes to prevent loops
  }, [user?.id, initDashboard]); // refreshDriftData removed from deps to prevent infinite loop

  const handleDeleteHolding = async (id: string) => {
    setDeletingId(id);
    await deleteHolding(id);
    setDeletingId(null);
    initDashboard();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-surface-border">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="font-display text-xl font-bold text-amber hover:brightness-110 transition-all">Ratio x</Link>
          <div className="flex items-center gap-6">
            <Link 
              to="/dashboard/tax-harvesting" 
              className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-amber/80 hover:text-amber transition-colors border border-amber/20 bg-amber/5 px-2.5 py-1 rounded-[2px]"
            >
              <Lock className="w-3 h-3" />
              Tax Harvesting
            </Link>
            <span className="text-xs text-muted-foreground font-body hidden sm:block">{user?.email}</span>
            <button
              onClick={() => { signOut(); navigate("/"); }}
              className="text-sm text-muted-foreground hover:text-foreground font-body transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 pb-16 max-w-6xl mx-auto px-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-8 h-8 border-2 border-amber border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground font-body animate-pulse">Loading portfolio...</p>
          </div>
        ) : fetchError ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-sm text-drift-red font-body mb-4">{fetchError}</p>
            <button 
              onClick={() => initDashboard()}
              className="text-xs bg-surface-border hover:bg-surface text-foreground font-body px-4 py-2 rounded-sm transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Header row */}
            <div className="flex items-start justify-between mb-10">
              <div>
                <h1 className="font-display text-3xl font-semibold text-foreground">
                  {portfolio?.name || "My Portfolio"}
                </h1>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3">
                  <div>
                    <p className="text-xs text-muted-foreground font-body">Total Value</p>
                    <p className="font-mono text-xl text-foreground">
                      ₹{totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-body">Total Invested</p>
                    <p className="font-mono text-xl text-foreground">
                      ₹{totalInvested.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-body">Overall P&L</p>
                    <p className={`font-mono text-xl ${overallPnl >= 0 ? "text-drift-green" : "text-drift-red"}`}>
                      {overallPnl >= 0 ? "+" : "-"}₹{Math.abs(overallPnl).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                      <span className="text-sm ml-2 opacity-80">
                        ({overallPnlPct >= 0 ? "+" : ""}{overallPnlPct.toFixed(2)}%)
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Health Score */}
              <div className="text-right">
                <div className="font-mono text-4xl font-semibold text-amber">
                  {healthScore.toFixed(0)}
                  <span className="text-sm text-muted-foreground">/100</span>
                </div>
                <p className="text-xs text-muted-foreground font-body mt-1">Health Score</p>
                <svg width="100" height="56" viewBox="0 0 120 68" className="mt-1">
                  <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="hsl(0 0% 13%)" strokeWidth="4" strokeLinecap="round" />
                  <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="hsl(37 90% 55%)" strokeWidth="4" strokeLinecap="round"
                    strokeDasharray="157" strokeDashoffset={157 - 157 * (healthScore / 100)} />
                </svg>
                {lastUpdated && (
                  <p className="text-[10px] text-muted-foreground font-body mt-1">
                    {minsAgo === 0 ? "Updated just now" : `Updated ${minsAgo}m ago`}
                  </p>
                )}
                {failedPriceSymbols.length > 0 && (
                  <p className="text-[10px] text-drift-red font-body mt-1">
                    {failedPriceSymbols.length} price(s) unavailable
                  </p>
                )}

                <div className="flex flex-col items-end mt-6">
                  <button 
                    onClick={() => setShareModalOpen(true)}
                    className="group flex items-center gap-2 text-[10px] uppercase tracking-widest font-mono text-muted-foreground hover:text-foreground transition-all bg-surface-border/30 hover:bg-surface-border/60 border border-surface-border px-3 py-1.5 rounded"
                  >
                    <Share2 className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:text-amber transition-colors" />
                    Export Tear Sheet
                  </button>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-1 inset-y-0 h-1 rounded-full bg-drift-green/60"></span>
                    <p className="text-[9px] uppercase tracking-wider text-muted-foreground/70 font-mono">
                      Data Anonymized
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Drift Table */}
            {driftResults.length > 0 ? (
              <div className="border border-surface-border rounded-[2px] overflow-hidden bg-card mb-8">
                <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border bg-surface-hover/20">
                  <div className="flex items-center gap-3">
                    <span className="text-xs uppercase tracking-widest font-mono font-medium text-foreground opacity-90">Drift Analysis Engine</span>
                    <Link 
                      to="/learn-drift" 
                      className="text-[9px] uppercase tracking-wider font-mono border border-surface-border/60 bg-background/50 hover:bg-surface-border text-muted-foreground hover:text-foreground px-1.5 py-0.5 rounded-[2px] transition-colors"
                    >
                      Algorithm
                    </Link>
                  </div>
                  <button
                    onClick={() => setRebalanceModalOpen(true)}
                    className="text-[10px] uppercase tracking-wider font-mono bg-amber text-background font-medium px-3 py-1.5 rounded-[2px] hover:brightness-110 transition-all">
                    View Rebalance Plan
                  </button>
                </div>
                <div className="grid grid-cols-[1.5fr_70px_70px_80px_1fr] text-[10px] uppercase tracking-wider text-muted-foreground font-mono px-4 py-2 bg-surface/30 border-b border-surface-border">
                  <span>Asset Class</span>
                  <span className="text-right">Target</span>
                  <span className="text-right">Actual</span>
                  <span className="text-right">Variance</span>
                  <span className="pl-4">State</span>
                </div>
                {driftResults.map((row) => (
                  <div key={row.assetClass} className="grid grid-cols-[1.5fr_70px_70px_80px_1fr] text-sm font-body px-4 py-3 border-b border-surface-border last:border-b-0">
                    <span className="text-foreground">{row.assetClass}</span>
                    <span className="text-right font-mono text-muted-foreground text-xs">{row.targetPct.toFixed(1)}%</span>
                    <span className="text-right font-mono text-foreground text-xs">{row.currentPct.toFixed(1)}%</span>
                    <span className={`text-right font-mono text-xs ${statusColor[row.status]}`}>
                      {row.drift > 0 ? "+" : ""}{row.drift.toFixed(1)}%
                    </span>
                    <div className="pl-4 flex items-center gap-2">
                      <div className="w-full max-w-[80px] h-1 bg-secondary rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${statusBg[row.status]}`}
                          style={{ width: `${Math.min(Math.abs(row.drift) / row.driftThreshold * 100, 100)}%` }} />
                      </div>
                      <span className={`text-xs whitespace-nowrap ${statusColor[row.status]}`}>
                        {statusLabel[row.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-surface-border rounded-[2px] bg-card p-12 text-center mb-8 relative overflow-hidden border-dashed">
                <div className="absolute inset-0 bg-background/40 z-0 flex items-center justify-center opacity-10 pointer-events-none">
                   <div className="w-full h-px bg-amber rotate-45 transform origin-center translate-y-[200px]" />
                   <div className="w-full h-px bg-amber -rotate-45 transform origin-center -translate-y-[200px]" />
                </div>
                <div className="relative z-10">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono mb-5 opacity-80">
                    System empty. Awaiting data ingestion.
                  </p>
                  <div className="flex justify-center items-center gap-4">
                    <button
                      onClick={() => setAddModalOpen(true)}
                      className="text-[11px] uppercase tracking-widest font-mono bg-amber text-background font-medium px-6 py-2.5 rounded-[2px] hover:brightness-110 transition-all shadow-glow-amber">
                      Manual Entry
                    </button>
                    <button
                      onClick={() => setImportCSVModalOpen(true)}
                      className="text-[11px] uppercase tracking-widest font-mono border border-surface-border bg-transparent text-foreground font-medium px-6 py-2.5 rounded-[2px] hover:bg-surface transition-all">
                      Bulk Import
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Holdings list */}
            {holdingsWithValues.length > 0 && (
              <div className="border border-surface-border rounded-[2px] overflow-hidden bg-card">
                <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border bg-surface-hover/20">
                  <span className="text-xs uppercase tracking-widest font-mono font-medium text-foreground opacity-90">Positions Ledger</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setImportCSVModalOpen(true)}
                      className="text-[10px] uppercase tracking-wider border border-surface-border text-muted-foreground bg-background/50 font-mono px-3 py-1 rounded-[2px] hover:text-foreground hover:border-surface-border/80 transition-colors"
                    >
                      Bulk Import
                    </button>
                    <button
                      onClick={() => setAddModalOpen(true)}
                      className="text-[10px] uppercase tracking-wider border border-surface-border text-muted-foreground bg-background/50 font-mono px-3 py-1 rounded-[2px] hover:text-foreground hover:border-surface-border/80 transition-colors"
                    >
                      Add Position
                    </button>
                  </div>
                </div>
                {holdingsWithValues.map((h: HoldingWithValue) => (
                  <div key={h.id} className="flex items-center justify-between px-4 py-3.5 border-b border-surface-border last:border-b-0 hover:bg-surface-hover/10 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-mono font-medium text-foreground">{h.symbol}</span>
                        <span className="text-xs text-muted-foreground/40">—</span>
                        <p className="text-xs font-body text-muted-foreground truncate max-w-[180px] sm:max-w-xs">{h.name}</p>
                        {!h.livePriceAvailable && (
                          <span className="text-[9px] uppercase tracking-wider bg-drift-red/10 text-drift-red px-1.5 py-0.5 rounded-[2px] font-mono ml-1 border border-drift-red/20 opacity-90">
                            Stale Pricing
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-[10px] uppercase tracking-wider text-amber/80 font-mono px-1.5 py-0.5 rounded-[2px] bg-amber/5 border border-amber/10 mix-blend-screen">
                          {h.assetClass}
                        </span>
                        
                        <div className="w-px h-3 bg-surface-border/60" />
                        
                        <span className="text-[11px] font-mono text-muted-foreground">
                          {h.quantity} <span className="opacity-40 ml-0.5">QTY</span>
                        </span>

                        <div className="w-px h-3 bg-surface-border/60" />

                        {h.cagr !== undefined ? (
                          <span className={`text-[11px] font-mono ${h.cagr > 0 ? 'text-drift-green' : h.cagr < 0 ? 'text-drift-red' : 'text-muted-foreground'}`}>
                            <span className="opacity-50 mr-1.5 text-muted-foreground/70 tracking-widest text-[9px] uppercase">IRR</span>
                            {h.cagr > 0 ? '+' : ''}{h.cagr.toFixed(1)}%
                          </span>
                        ) : h.holdingPeriodDays !== undefined && h.holdingPeriodDays < 30 ? (
                          <span className="text-[9.5px] uppercase tracking-wider text-amber/60 font-mono flex items-center gap-1.5 border border-amber/10 bg-amber/5 px-1.5 py-0.5 rounded-[2px]">
                            <span className="w-1 h-1 rounded-full bg-amber/50 animate-pulse" />
                            Incubating 
                            <span className="opacity-60 lowercase">({30 - h.holdingPeriodDays}d left)</span>
                          </span>
                        ) : null}

                        {h.taxStatus && h.taxStatus !== 'unknown' && (
                          <>
                            <div className="w-px h-3 bg-surface-border/60" />
                            <span className={`text-[10px] uppercase tracking-wider font-mono px-1.5 py-0.5 rounded-[2px] border ${
                              h.taxStatus === 'LTCG' ? 'bg-drift-green/5 text-drift-green/80 border-drift-green/20' : 'bg-amber/5 text-amber/80 border-amber/20'
                            }`}>
                              {h.taxStatus}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-5">
                      <div className="text-right flex flex-col items-end">
                        <p className="text-[13px] font-mono font-medium text-foreground tracking-tight">
                          ₹{h.marketValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                        </p>
                        <p className={`text-[10px] uppercase tracking-wider font-mono mt-1 px-1.5 py-0.5 rounded-[2px] border ${h.pnl >= 0 ? 'bg-drift-green/10 text-drift-green/90 border-drift-green/20' : 'bg-drift-red/10 text-drift-red/90 border-drift-red/20'}`}>
                          {h.pnl >= 0 ? '+' : ''}₹{h.pnl.toLocaleString("en-IN", { maximumFractionDigits: 0 })} 
                          <span className="ml-1.5 opacity-60">
                            ({h.pnl >= 0 ? '+' : ''}{h.pnlPercent.toFixed(1)}%)
                          </span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteHolding(h.id)}
                        disabled={deletingId === h.id}
                        className="text-muted-foreground/30 hover:text-drift-red/80 hover:bg-drift-red/10 rounded p-1 transition-all disabled:opacity-40"
                        title="Remove from tracking"
                      >
                        {deletingId === h.id ? (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" className="animate-spin">
                            <circle cx="7" cy="7" r="5" strokeDasharray="20" strokeDashoffset="10" />
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
                            <path d="M2.5 3.5h9M5.5 3.5v-1l3 0v1m-3 0l.5 8M8.5 3.5l-.5 8" strokeLinecap="round" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Rebalance History */}
            {rebalanceLogs.length > 0 && (
              <div className="mt-8 border border-surface-border rounded-[2px] overflow-hidden bg-card">
                <div className="px-4 py-3 border-b border-surface-border bg-surface-hover/20">
                  <span className="text-xs uppercase tracking-widest font-mono font-medium text-foreground opacity-90">Rebalance Ledger</span>
                </div>
                {rebalanceLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between px-4 py-4 border-b border-surface-border last:border-b-0 hover:bg-surface-hover/10 transition-colors group">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1.5">
                        <p className="text-[13px] font-mono font-medium text-foreground">
                          {format(new Date(log.date), "dd MMM yyyy")}
                        </p>
                        <span className="text-[9px] uppercase tracking-wider font-mono bg-surface-border/40 text-muted-foreground px-1.5 py-0.5 rounded-[2px] border border-surface-border/50 group-hover:border-surface-border/80 transition-colors">
                          {log.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground/70 font-mono tracking-tight">
                        <span className="text-amber/80 font-medium">{log.orders?.length || 0}</span> ANALYSIS ENTRIES GENERATED
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-3 justify-end mb-1">
                        <span className="font-mono text-[13px] text-muted-foreground opacity-70">{log.before_score}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-surface-border/80">
                          <path d="M4 12h16M14 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="font-mono text-[13px] text-drift-green/90 font-medium">{log.after_score}</span>
                      </div>
                      <p className="text-[9px] uppercase tracking-widest text-muted-foreground/50 font-mono text-right border-t border-surface-border/30 pt-1 mt-1">Health Impact</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Legal Disclaimer */}
      <Disclaimer />

      {/* Modals */}
      {portfolio && (
        <>
          <AddHoldingModal
            open={addModalOpen}
            onOpenChange={setAddModalOpen}
            portfolioId={portfolio.id}
            userId={user!.id}
            assetClasses={assetTargets.map(t => t.name)}
            onSuccess={initDashboard}
          />
          <ImportCSVModal
            open={importCSVModalOpen}
            onOpenChange={setImportCSVModalOpen}
            portfolioId={portfolio.id}
            userId={user!.id}
            assetClasses={assetTargets.map(t => t.name)}
            onSuccess={initDashboard}
          />
          <RebalanceModal
            open={rebalanceModalOpen}
            onOpenChange={setRebalanceModalOpen}
            portfolioId={portfolio.id}
            userId={user!.id}
            holdings={holdingsWithValues}
            targets={assetTargets}
            onSuccess={initDashboard}
          />
          <SharePortfolioModal
            open={shareModalOpen}
            onOpenChange={setShareModalOpen}
            data={{
              healthScore,
              totalValue,
              totalInvested,
              pnl: overallPnl,
              pnlPct: overallPnlPct,
              holdingsCount: holdings.length,
              lastRebalanced: rebalanceLogs.length > 0 ? rebalanceLogs[0].date : null,
              driftResults,
            }}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
