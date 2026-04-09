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
import RebalanceModal from "@/components/RebalanceModal";
import { format } from "date-fns";

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
  const [rebalanceModalOpen, setRebalanceModalOpen] = useState(false);
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
              </div>
            </div>

            {/* Drift Table */}
            {driftResults.length > 0 ? (
              <div className="border border-surface-border rounded-sm overflow-hidden bg-card mb-8">
                <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-display font-semibold text-foreground">Portfolio Drift Monitor</span>
                    <Link 
                      to="/learn-drift" 
                      className="text-[10px] uppercase tracking-wider font-mono bg-surface-border/50 hover:bg-surface-border text-muted-foreground hover:text-foreground px-2 py-0.5 rounded transition-colors"
                    >
                      How it works
                    </Link>
                  </div>
                  <button
                    onClick={() => setRebalanceModalOpen(true)}
                    className="text-xs bg-amber text-background font-body font-medium px-3 py-1.5 rounded-sm hover:brightness-110 transition-all">
                    Rebalance Now
                  </button>
                </div>
                <div className="grid grid-cols-[1.5fr_70px_70px_80px_1fr] text-xs text-muted-foreground font-body px-4 py-2 border-b border-surface-border">
                  <span>Asset Class</span>
                  <span className="text-right">Target</span>
                  <span className="text-right">Current</span>
                  <span className="text-right">Drift</span>
                  <span className="pl-4">Status</span>
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
              <div className="border border-surface-border rounded-sm bg-card p-12 text-center mb-8">
                <p className="text-sm text-muted-foreground font-body mb-4">
                  No holdings yet. Add your first position to start tracking drift.
                </p>
                <button
                  onClick={() => setAddModalOpen(true)}
                  className="text-sm bg-amber text-background font-body font-medium px-5 py-2.5 rounded-sm hover:brightness-110 transition-all">
                  + Add Holdings
                </button>
              </div>
            )}

            {/* Holdings list */}
            {holdingsWithValues.length > 0 && (
              <div className="border border-surface-border rounded-sm overflow-hidden bg-card">
                <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
                  <span className="text-sm font-display font-semibold text-foreground">Holdings</span>
                  <button
                    onClick={() => setAddModalOpen(true)}
                    className="text-xs border border-surface-border text-muted-foreground font-body px-3 py-1 rounded-sm hover:text-foreground transition-colors"
                  >
                    + Add
                  </button>
                </div>
                {holdingsWithValues.map((h: HoldingWithValue) => (
                  <div key={h.id} className="flex items-center justify-between px-4 py-3 border-b border-surface-border last:border-b-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-body text-foreground">{h.name}</p>
                        {!h.livePriceAvailable && (
                          <span className="text-xs bg-drift-red/10 text-drift-red px-1.5 py-0.5 rounded-sm font-body">
                            Price unavailable
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-body">{h.assetClass} · {h.symbol}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs font-mono text-muted-foreground">{h.quantity} units</span>
                        {h.cagr !== undefined ? (
                          <span className="text-xs font-mono text-muted-foreground">
                            CAGR: {h.cagr > 0 ? '+' : ''}{h.cagr.toFixed(1)}%
                          </span>
                        ) : h.holdingPeriodDays !== undefined && h.holdingPeriodDays < 30 ? (
                          <span className="text-xs font-mono text-muted-foreground">
                            CAGR: Too early (&lt;30d)
                          </span>
                        ) : null}
                        {h.taxStatus && h.taxStatus !== 'unknown' && (
                          <span className={`text-xs px-1.5 py-0.5 rounded-sm font-body ${
                            h.taxStatus === 'LTCG' ? 'bg-drift-green/10 text-drift-green' : 'bg-amber/10 text-amber'
                          }`}>
                            {h.taxStatus}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-mono text-foreground">
                          ₹{h.marketValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                        </p>
                        <p className={`text-xs font-mono ${h.pnl >= 0 ? 'text-drift-green' : 'text-drift-red'}`}>
                          {h.pnl >= 0 ? '+' : ''}₹{h.pnl.toLocaleString("en-IN", { maximumFractionDigits: 0 })} 
                          ({h.pnl >= 0 ? '+' : ''}{h.pnlPercent.toFixed(1)}%)
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteHolding(h.id)}
                        disabled={deletingId === h.id}
                        className="text-muted-foreground hover:text-drift-red transition-colors disabled:opacity-40"
                        title="Remove holding"
                      >
                        {deletingId === h.id ? (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-spin">
                            <circle cx="7" cy="7" r="5" strokeDasharray="20" strokeDashoffset="10" />
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M2 3.5h10M5.5 3.5V2.5h3v1M5 3.5l.5 8M9 3.5l-.5 8" strokeLinecap="round" />
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
              <div className="mt-8 border border-surface-border rounded-sm overflow-hidden bg-card">
                <div className="px-4 py-3 border-b border-surface-border bg-surface-hover/30">
                  <span className="text-sm font-display font-semibold text-foreground">Rebalance History</span>
                </div>
                {rebalanceLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between px-4 py-3 border-b border-surface-border last:border-b-0 hover:bg-surface-hover/20 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-body text-foreground">
                          {format(new Date(log.date), "MMM d, yyyy")}
                        </p>
                        <span className="text-[10px] uppercase tracking-wider font-mono bg-surface-border/50 text-muted-foreground px-1.5 py-0.5 rounded">
                          {log.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground font-body mt-0.5">
                        Suggested {log.orders?.length || 0} trades
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <span className="font-mono text-sm text-amber">{log.before_score}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="font-mono text-sm text-drift-green">{log.after_score}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-body mt-0.5">Score improvement</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

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
          <RebalanceModal
            open={rebalanceModalOpen}
            onOpenChange={setRebalanceModalOpen}
            portfolioId={portfolio.id}
            userId={user!.id}
            holdings={holdingsWithValues}
            targets={assetTargets}
            onSuccess={initDashboard}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;
