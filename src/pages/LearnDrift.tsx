import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "@/components/Nav";

const LearnDrift: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-amber/20 selection:text-amber">
      <Nav />

      <main className="flex flex-col items-center pt-32 pb-24 px-6 md:px-12 max-w-4xl mx-auto">
        
        {/* Navigation Back */}
        <div className="w-full flex justify-start mb-8 border-b border-surface-border pb-6">
          <button 
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Return to Dashboard
          </button>
        </div>

        {/* Hero Section */}
        <div className="w-full space-y-6 mb-20">
          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">
            Understanding Portfolio Drift.
          </h1>
          
          <p className="text-lg text-muted-foreground font-body max-w-2xl leading-relaxed">
            Asset allocation dictates risk. When markets move, your allocation moves with them.<br />
            Failure to track this movement results in unintentional risk exposure.
          </p>
        </div>

        {/* Mechanism Section */}
        <div className="w-full mb-24">
          <div className="border border-surface-border bg-card">
            <div className="border-b border-surface-border px-6 py-4 bg-surface/50">
              <span className="font-mono text-xs uppercase tracking-widest text-foreground">1. The Mechanism</span>
            </div>
            <div className="p-8 md:p-10 space-y-6">
              <p className="font-body text-foreground leading-relaxed text-[15px]">
                A portfolio is not a static entity. If you construct a baseline allocation of <strong>60% Equity</strong> and <strong>40% Debt</strong>, you are targeting a specific risk-adjusted return profile.
              </p>
              <p className="font-body text-muted-foreground leading-relaxed text-[15px]">
                Over a 12-month period, if the equity market returns 25% and debt yields 5%, your portfolio is no longer 60/40. Because the equity portion grew faster, it now represents a larger percentage of your total capital—perhaps <strong>68% Equity</strong> and <strong>32% Debt</strong>.
              </p>
              <div className="bg-background border border-surface-border p-4 mt-6">
                <p className="font-mono text-xs text-drift-red uppercase tracking-wide">System Warning</p>
                <p className="font-body text-sm text-muted-foreground mt-2">
                  You are now over-allocated to equities. A sudden market drawdown will result in steeper losses than your original 60/40 design could sustain. Your risk profile has shifted without your explicit consent.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Rebalancing Section */}
        <div className="w-full mb-24">
          <div className="border border-surface-border bg-card">
            <div className="border-b border-surface-border px-6 py-4 bg-surface/50">
              <span className="font-mono text-xs uppercase tracking-widest text-foreground">2. The Solution: Rebalancing</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-surface-border">
              
              <div className="p-8">
                <span className="font-mono text-xs text-muted-foreground block mb-4">STEP 01</span>
                <h4 className="font-display text-lg text-foreground mb-2">Track Drift</h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Calculate the exact percentage deviation of every asset class from its target allocation in real-time.
                </p>
              </div>

              <div className="p-8">
                <span className="font-mono text-xs text-amber block mb-4">STEP 02</span>
                <h4 className="font-display text-lg text-foreground mb-2">Trim Overweight</h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Execute sell orders on the asset classes that have exceeded their target thresholds. Mechanically lock in profits.
                </p>
              </div>

              <div className="p-8">
                <span className="font-mono text-xs text-drift-green block mb-4">STEP 03</span>
                <h4 className="font-display text-lg text-foreground mb-2">Fund Underweight</h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Deploy the generated capital into the lagging asset classes, buying them at a relative discount.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="w-full flex justify-between items-center border-t border-surface-border pt-8">
          <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest hidden md:block">
            Ratio x / Mechanics
          </p>
          <button 
            onClick={() => navigate("/dashboard")}
            className="bg-amber text-background font-mono text-xs font-semibold uppercase tracking-widest px-6 py-3 hover:brightness-110 transition-all w-full md:w-auto"
          >
            Launch Dashboard
          </button>
        </div>

      </main>
    </div>
  );
};

export default LearnDrift;
