import React from "react";
import { format } from "date-fns";

interface RebalanceHistoryProps {
  rebalanceLogs: any[];
}

const RebalanceHistory: React.FC<RebalanceHistoryProps> = ({ rebalanceLogs }) => {
  if (rebalanceLogs.length === 0) return null;

  return (
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
  );
};

export default RebalanceHistory;
