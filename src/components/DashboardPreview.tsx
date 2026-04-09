import { useScrollReveal } from "./useScrollReveal";
import { useEffect, useState } from "react";

const DashboardPreview = () => {
  const { ref, visible } = useScrollReveal(0.15);
  const [healthScore, setHealthScore] = useState(0);

  // Animate the health score number when the component becomes visible
  useEffect(() => {
    if (!visible) return;
    
    let start = 0;
    const end = 62;
    const duration = 1500; // ms
    const incrementTime = Math.max(16, duration / end);
    
    const timer = setInterval(() => {
      start += 1;
      setHealthScore(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [visible]);

  return (
    <section className="py-24 md:py-32 border-t border-surface-border bg-background relative overflow-hidden" ref={ref}>
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Eyebrow */}
        <div className={`flex items-center gap-3 mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="w-8 h-[1px] bg-muted-foreground/30"></div>
          <span className="font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            System Telemetry
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          
          {/* Text Content */}
          <div
            className={`transition-all duration-700 delay-100 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <h2 className="font-display text-4xl md:text-5xl font-light text-foreground mb-6 leading-tight tracking-tight">
              Allocation, <br/>
              <span className="text-foreground">always in view.</span>
            </h2>
            <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-sm mb-8">
              The Ratio x dashboard gives you a live read of portfolio health, drift severity, and optimal next actions — without drowning you in noise.
            </p>

            <ul className="space-y-3 font-mono text-[10px] uppercase tracking-widest text-muted-foreground border-l border-surface-border pl-4">
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-drift-green rounded-full"></div> Health Analysis
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-amber rounded-full"></div> Volatility Tracking
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1 h-1 bg-drift-red rounded-full"></div> Execution Routing
              </li>
            </ul>
          </div>

          {/* Animated Mockup Card */}
          <div
            className={`transition-all duration-1000 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="border border-surface-border bg-card shadow-2xl relative overflow-hidden group max-w-sm mx-auto">
              
              {/* Subtle glass overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

              {/* Title Bar */}
              <div className="border-b border-surface-border px-5 py-3 bg-surface/50 flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Diagnostic View</span>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full border border-surface-border"></div>
                  <div className="w-2 h-2 rounded-full border border-surface-border"></div>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Health Score Header */}
                <div className="flex items-end justify-between">
                  <span className="text-xs text-muted-foreground font-mono uppercase tracking-wide">Health Score</span>
                  <span className="font-mono text-3xl font-light text-amber">
                    {healthScore}<span className="text-sm text-muted-foreground opacity-50">/100</span>
                  </span>
                </div>

                {/* Animated Arc Gauge */}
                <div className="flex justify-center py-2 relative">
                  {/* Subtle glow behind the dial */}
                  <div className={`absolute top-8 left-1/2 -translate-x-1/2 w-24 h-12 bg-amber/20 blur-xl rounded-full transition-opacity duration-1000 ${visible ? 'opacity-100' : 'opacity-0'}`}></div>
                  
                  <svg width="180" height="100" viewBox="0 0 120 68" className="relative z-10">
                    {/* Background track */}
                    <path d="M10 60 A50 50 0 0 1 110 60" fill="none" stroke="currentColor" className="text-surface-border" strokeWidth="3" strokeLinecap="round" />
                    {/* Animated Fill track */}
                    <path 
                      d="M10 60 A50 50 0 0 1 110 60" 
                      fill="none" 
                      stroke="currentColor" 
                      className="text-amber drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" 
                      strokeWidth="3" 
                      strokeLinecap="round" 
                      strokeDasharray="157" 
                      strokeDashoffset="157"
                      style={{ 
                        transition: "stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)", 
                        strokeDashoffset: visible ? (157 - 157 * (healthScore / 100)) : 157 
                      }} 
                    />
                  </svg>
                </div>

                {/* Data Rows */}
                <div className="border-t border-surface-border pt-6 space-y-4">
                  <div className={`flex justify-between items-center transition-all duration-700 delay-[600ms] ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}>
                    <span className="font-mono flex-shrink-0 text-[10px] uppercase tracking-widest text-muted-foreground">Variance</span>
                    <span className="font-mono text-xs text-foreground flex items-center gap-2">
                      <span className="text-drift-red">3 CRT</span>
                      <span className="w-px h-3 bg-surface-border"></span>
                      <span className="text-amber">1 DRF</span>
                      <span className="w-px h-3 bg-surface-border"></span>
                      <span className="text-drift-green">1 OK</span>
                    </span>
                  </div>
                  
                  <div className={`flex justify-between items-center transition-all duration-700 delay-[800ms] ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}>
                    <span className="font-mono flex-shrink-0 text-[10px] uppercase tracking-widest text-muted-foreground">Last Action</span>
                    <span className="font-mono text-xs text-foreground">T-minus 47 days</span>
                  </div>
                  
                  <div className={`flex justify-between items-center transition-all duration-700 delay-[1000ms] ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}>
                    <span className="font-mono flex-shrink-0 text-[10px] uppercase tracking-widest text-muted-foreground">System Rec</span>
                    <span className="font-mono text-xs text-background bg-amber px-2 py-0.5 rounded-sm flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-background rounded-full animate-pulse"></div>
                      Immediate
                    </span>
                  </div>
                </div>

                {/* Cyberpunk/Terminal Button */}
                <div className={`pt-2 transition-all duration-700 delay-[1200ms] ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
                  <button className="w-full relative group overflow-hidden bg-surface border border-surface-border text-foreground font-mono text-xs uppercase tracking-widest py-4 transition-all duration-300 hover:border-amber/50">
                    <div className="absolute inset-0 bg-amber transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0"></div>
                    <span className="relative z-10 group-hover:text-background transition-colors font-semibold">Execute Rebalance</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardPreview;
