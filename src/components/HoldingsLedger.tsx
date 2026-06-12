import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import { HoldingWithValue } from "@/lib/drift-engine";
import { Database } from "@/lib/supabase";

type HoldingRow = Database['public']['Tables']['holdings']['Row'];

interface HoldingsLedgerProps {
  holdingsWithValues: HoldingWithValue[];
  holdings: HoldingRow[];
  setEditingHolding: (holding: HoldingRow | null) => void;
  handleDeleteHolding: (id: string) => void;
  deletingId: string | null;
  setImportCSVModalOpen: (open: boolean) => void;
  setAddModalOpen: (open: boolean) => void;
}

const HoldingsLedger: React.FC<HoldingsLedgerProps> = ({
  holdingsWithValues,
  holdings,
  setEditingHolding,
  handleDeleteHolding,
  deletingId,
  setImportCSVModalOpen,
  setAddModalOpen
}) => {
  if (holdingsWithValues.length === 0) return null;

  return (
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
              
              {(h.instrumentType === 'mf' || h.instrumentType === 'mutual_fund') && (
                <>
                  {h.planType?.toLowerCase() === 'regular' && (
                    <span className="text-[9px] uppercase tracking-wider bg-drift-red/10 text-drift-red px-1.5 py-0.5 rounded-[2px] font-mono border border-drift-red/20">
                      Regular Plan
                    </span>
                  )}
                  {h.ter && h.ter >= 1.0 && (
                    <span className="text-[9px] uppercase tracking-wider bg-drift-red/10 text-drift-red px-1.5 py-0.5 rounded-[2px] font-mono border border-drift-red/20" title={`High TER: ${h.ter}%`}>
                      High Cost ({h.ter}%)
                    </span>
                  )}
                </>
              )}
              
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
              onClick={() => {
                const originalHolding = holdings.find(hRow => hRow.id === h.id);
                if (originalHolding) setEditingHolding(originalHolding);
              }}
              className="text-muted-foreground/30 hover:text-amber/80 hover:bg-amber/10 rounded p-1.5 transition-all"
              title="Edit position"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDeleteHolding(h.id)}
              disabled={deletingId === h.id}
              className="text-muted-foreground/30 hover:text-drift-red/80 hover:bg-drift-red/10 rounded p-1.5 transition-all disabled:opacity-40"
              title="Remove from tracking"
            >
              {deletingId === h.id ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2" className="animate-spin">
                  <circle cx="7" cy="7" r="5" strokeDasharray="20" strokeDashoffset="10" />
                </svg>
              ) : (
                <Trash2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HoldingsLedger;
