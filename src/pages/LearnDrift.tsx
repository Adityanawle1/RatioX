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
        <div className="w-full mb-24 grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch">
          <div className="lg:col-span-3 border border-surface-border bg-card">
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

          {/* 3D Mechanical Visualization */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center p-8 bg-card border border-surface-border relative overflow-hidden perspective-[1200px]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:2rem_2rem]" />
            
            <div 
              className="relative w-full aspect-square transition-transform duration-1000 ease-out flex items-center justify-center"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: 'rotateX(55deg) rotateZ(-25deg)'
              }}
            >
              {/* Target Baseline Layer (Bottom) */}
              <div className="absolute w-48 h-48 border border-white/10 bg-white/5 flex flex-col justify-end p-4 rounded-sm" style={{ transform: 'translateZ(-40px)' }}>
                <div className="h-full flex flex-col">
                  <div className="flex-grow bg-amber/20 h-[60%] border-t border-amber/30" />
                  <div className="h-[40%] bg-surface-border/30 border-t border-surface-border/50" />
                </div>
                <span className="absolute -top-6 left-0 font-mono text-[9px] text-muted-foreground uppercase tracking-widest">Baseline Matrix</span>
              </div>

              {/* Drifted Layer (Top) */}
              <div className="absolute w-48 h-48 border border-amber/30 bg-amber/5 flex flex-col justify-end p-4 rounded-sm shadow-[0_0_40px_rgba(232,147,16,0.1)]" style={{ transform: 'translateZ(40px)' }}>
                <div className="h-full flex flex-col">
                  {/* The drifted highlight */}
                  <div className="flex-grow bg-amber/40 h-[68%] border-t border-amber" />
                  <div className="h-[32%] bg-surface-border/50 border-t border-surface-border" />
                </div>
                <span className="absolute -top-6 left-0 font-mono text-[9px] text-amber uppercase tracking-widest">Shift Detected</span>
                
                {/* 3D Indicator lines */}
                <div className="absolute left-0 w-full h-px bg-drift-red/50 top-[60%] -translate-z-20 border-dashed border-t" />
              </div>

              {/* Connecting Drift Vector */}
              <div 
                className="absolute w-1 h-20 bg-gradient-to-t from-transparent via-drift-red to-drift-red opacity-60"
                style={{ transform: 'rotateX(-90deg) translateZ(0px) translateY(-10px) translateX(60px)' }}
              />
            </div>

            <div className="mt-8 text-center relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-drift-red/10 border border-drift-red/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-drift-red rounded-full animate-pulse" />
                <span className="font-mono text-[10px] text-drift-red uppercase tracking-widest">+8% Equity Drift</span>
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
                <h4 className="font-display text-lg text-foreground mb-2">Identify Overweight</h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Identify the asset classes that have exceeded their target thresholds. Understand where your allocation has shifted.
                </p>
              </div>

              <div className="p-8">
                <span className="font-mono text-xs text-drift-green block mb-4">STEP 03</span>
                <h4 className="font-display text-lg text-foreground mb-2">Identify Underweight</h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Identify the lagging asset classes that may benefit from additional allocation to restore your target balance.
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
