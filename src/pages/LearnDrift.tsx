import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "@/components/Nav";

const LearnDrift: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-foreground font-sans selection:bg-amber/20 selection:text-amber relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-[radial-gradient(ellipse_at_top,_rgba(232,137,12,0.15)_0%,_transparent_70%)] opacity-60" />
        <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_bottom_right,_rgba(255,80,80,0.08)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20256%20256%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20baseFrequency%3D%220.9%22/%3E%3C/filter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22/%3E%3C/svg%3E')]" />
      </div>

      <Nav />

      <main className="relative z-10 flex flex-col items-center pt-32 pb-24 px-6 md:px-12 max-w-5xl mx-auto">
        
        {/* Navigation Back */}
        <div className="w-full flex justify-start mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
          <button 
            onClick={() => navigate("/")}
            className="group flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-amber transition-colors bg-surface/30 px-4 py-2 rounded-full border border-surface-border hover:border-amber/30 backdrop-blur-md"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Return to Home
          </button>
        </div>

        {/* Hero Section */}
        <div className="w-full space-y-6 mb-24 text-center flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber/10 border border-amber/20 rounded-full mb-4">
            <div className="w-1.5 h-1.5 bg-amber rounded-full animate-pulse" />
            <span className="font-mono text-[10px] text-amber uppercase tracking-widest">Platform Mechanics</span>
          </div>
          
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-white leading-[1.05] max-w-4xl drop-shadow-2xl">
            Understanding <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber to-[#FF6B6B]">Portfolio & Fee Drift.</span>
          </h1>
          
          <p className="text-xl text-muted-foreground font-body max-w-3xl leading-relaxed mt-6">
            Your wealth is constantly under attack from two silent forces: <strong className="text-white border-b border-white/20 pb-0.5">Asset Allocation Drift</strong> and <strong className="text-white border-b border-white/20 pb-0.5">Compounding Fee Drift</strong>.<br />
            Failure to track and correct these movements results in unintentional risk exposure and catastrophic long-term capital loss.
          </p>
        </div>

        {/* Mechanism Section */}
        <div className="w-full mb-32 grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          
          {/* Text Content */}
          <div className="lg:col-span-3 border border-surface-border bg-card/60 backdrop-blur-xl flex flex-col rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber via-drift-red to-transparent" />
            
            <div className="border-b border-surface-border px-8 py-5 bg-surface/40 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber/10 flex items-center justify-center border border-amber/20">
                <span className="font-mono text-sm text-amber">1</span>
              </div>
              <span className="font-mono text-sm uppercase tracking-widest text-white font-medium">The Dual Mechanisms of Drift</span>
            </div>
            
            <div className="p-8 md:p-12 space-y-6 border-b border-surface-border relative group hover:bg-surface/20 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-amber/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative z-10">
                <h3 className="font-mono text-sm text-amber uppercase tracking-widest mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                  A. Fee Drift (The Compounding Trap)
                </h3>
                <p className="font-body text-white/90 leading-relaxed text-base mb-4">
                  Mutual fund fees are not a static, one-time charge. If you invest capital into a Regular mutual fund plan with a <strong className="text-amber">2.0% TER</strong>, you are paying that percentage on your total accumulated asset value every single year, regardless of performance.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed text-base">
                  Because you lose the compounding interest on the fees deducted each year, that TER can consume up to <strong className="text-white border-b border-drift-red/50">30% to 40%</strong> of your total potential wealth compared to a low-cost Direct plan.
                </p>
              </div>
            </div>

            <div className="p-8 md:p-12 space-y-6 relative group hover:bg-surface/20 transition-colors duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-drift-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              <div className="relative z-10">
                <h3 className="font-mono text-sm text-drift-red uppercase tracking-widest mb-4 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  B. Asset Allocation Drift
                </h3>
                <p className="font-body text-white/90 leading-relaxed text-base mb-4">
                  If you construct a baseline allocation of <strong>60% Equity</strong> and <strong>40% Debt</strong>, you target a specific risk profile. If equities surge 25% and debt yields 5%, your portfolio shifts to <strong className="text-drift-red">68% Equity</strong>.
                </p>
                <p className="font-body text-muted-foreground leading-relaxed text-base">
                  Your risk profile has shifted without explicit action. A sudden market drawdown would now result in steeper losses than your original design could sustain.
                </p>
                
                <div className="bg-background/80 backdrop-blur-md border border-drift-red/30 p-5 mt-8 rounded-xl shadow-[0_0_30px_rgba(255,80,80,0.1)] relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-drift-red" />
                  <p className="font-mono text-xs text-drift-red uppercase tracking-widest font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-drift-red animate-pulse" />
                    System Warning
                  </p>
                  <p className="font-body text-sm text-white/80 mt-3 leading-relaxed">
                     Combined, these two forces shift wealth accumulation away from the investor to the distributor, while simultaneously increasing the portfolio's exposure to downside market risk.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Mechanical Visualization */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center p-8 bg-card/40 backdrop-blur-xl border border-surface-border rounded-2xl relative overflow-hidden perspective-[1200px] shadow-2xl">
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
                  <div className="flex-grow bg-amber/20 h-[100%] border-t border-amber/30" />
                </div>
                <span className="absolute -top-6 left-0 font-mono text-[9px] text-muted-foreground uppercase tracking-widest">Gross Returns (Direct)</span>
              </div>

              {/* Drifted Layer (Top) */}
              <div className="absolute w-48 h-48 border border-amber/30 bg-amber/5 flex flex-col justify-end p-4 rounded-sm shadow-[0_0_40px_rgba(232,147,16,0.1)]" style={{ transform: 'translateZ(40px)' }}>
                <div className="h-full flex flex-col">
                  {/* The drifted highlight */}
                  <div className="flex-grow bg-amber/40 h-[65%] border-t border-amber" />
                  <div className="h-[35%] bg-drift-red/20 border-t border-drift-red/50" />
                </div>
                <span className="absolute -top-6 left-0 font-mono text-[9px] text-amber uppercase tracking-widest">Net Returns (Regular)</span>
                
                {/* 3D Indicator lines */}
                <div className="absolute left-0 w-full h-px bg-drift-red/50 top-[65%] -translate-z-20 border-dashed border-t" />
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
                <span className="font-mono text-[10px] text-drift-red uppercase tracking-widest">-35% Wealth Drain</span>
              </div>
            </div>
          </div>
        </div>

        {/* Solution Section */}
        <div className="w-full mb-32 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <div className="border border-surface-border bg-card/60 backdrop-blur-xl rounded-2xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-drift-green via-amber to-drift-red" />
            
            <div className="border-b border-surface-border px-8 py-5 bg-surface/40 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-drift-green/10 flex items-center justify-center border border-drift-green/20">
                <span className="font-mono text-sm text-drift-green">2</span>
              </div>
              <span className="font-mono text-sm uppercase tracking-widest text-white font-medium">The Solution: Auditing & Rebalancing</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-surface-border">
              
              <div className="p-8 lg:p-10 hover:bg-surface/30 transition-colors duration-300 group">
                <span className="font-mono text-xs text-muted-foreground block mb-6 px-3 py-1 bg-surface-border/50 rounded-full w-max group-hover:text-white transition-colors">STEP 01</span>
                <h4 className="font-display text-xl text-white mb-3">Audit the TER</h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Calculate the exact Total Expense Ratio you are currently paying and identify Regular plans leaking alpha through distributor commissions.
                </p>
              </div>

              <div className="p-8 lg:p-10 hover:bg-surface/30 transition-colors duration-300 group">
                <span className="font-mono text-xs text-drift-green block mb-6 px-3 py-1 bg-drift-green/10 rounded-full w-max group-hover:bg-drift-green/20 transition-colors">STEP 02</span>
                <h4 className="font-display text-xl text-white mb-3">Switch to Direct</h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Restructure your portfolio into Direct plans to strip out commissions, instantly reducing your TER and restoring your compounding curve.
                </p>
              </div>

              <div className="p-8 lg:p-10 hover:bg-surface/30 transition-colors duration-300 group">
                <span className="font-mono text-xs text-amber block mb-6 px-3 py-1 bg-amber/10 rounded-full w-max group-hover:bg-amber/20 transition-colors">STEP 03</span>
                <h4 className="font-display text-xl text-white mb-3">Track Asset Drift</h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Calculate the exact percentage deviation of every asset class from its target allocation to spot overweight or underweight positions.
                </p>
              </div>

              <div className="p-8 lg:p-10 hover:bg-surface/30 transition-colors duration-300 group">
                <span className="font-mono text-xs text-drift-red block mb-6 px-3 py-1 bg-drift-red/10 rounded-full w-max group-hover:bg-drift-red/20 transition-colors">STEP 04</span>
                <h4 className="font-display text-xl text-white mb-3">Rebalance</h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  Sell overweight assets and buy underweight assets to restore your original risk-adjusted baseline allocation.
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* Big Action Bar */}
        <div className="w-full flex flex-col items-center text-center pt-16 border-t border-surface-border animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-700">
          <h2 className="font-display text-3xl text-white mb-8">Ready to stop the drift?</h2>
          <button 
            onClick={() => navigate("/dashboard/fee-audit")}
            className="group relative overflow-hidden bg-amber text-background font-body text-base font-semibold px-12 py-5 rounded-full hover:shadow-[0_0_40px_rgba(232,147,16,0.3)] transition-all duration-300 flex items-center gap-3"
          >
            <div className="absolute inset-0 bg-white/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0" />
            <span className="relative z-10">Run Your Free Mutual Fund Audit</span>
            <svg className="relative z-10 w-5 h-5 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 12l4-4-4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

      </main>
    </div>
  );
};

export default LearnDrift;
