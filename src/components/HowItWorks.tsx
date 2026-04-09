import { useScrollReveal } from "./useScrollReveal";
import { useEffect, useState } from "react";

const steps = [
  { num: "01", title: "Connect Portfolio", desc: "Link your broker account or enter holdings manually. We support major brokers via CSV." },
  { num: "02", title: "Define Target Matrix", desc: "Set ideal allocation parameters. Define absolute drift tolerance thresholds per asset vector." },
  { num: "03", title: "Quantitative Rebalance", desc: "Monitor deviation in real-time. Execute algorithmic rebalancing to restore baseline weights." },
];

const HowItWorks = () => {
  const { ref, visible } = useScrollReveal(0.15);
  const [activeStep, setActiveStep] = useState(0);

  // Cycle through steps to animate the UI mockup
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [visible]);

  return (
    <section id="how-it-works" className="py-24 md:py-32 border-t border-surface-border bg-[#050505] overflow-hidden relative" ref={ref}>
      
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className={`flex items-center gap-3 mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="w-8 h-[1px] bg-muted-foreground/30"></div>
          <span className="font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            System Architecture
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          
          {/* Left Side: Steps (Clean, Editorial Look) */}
          <div className="max-w-xl">
            <h2
              className={`font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground mb-16 transition-all duration-700 leading-[1.1] tracking-tight`}
              style={{ transitionDelay: "100ms" }}
            >
              Mechanics of <br />
              <span className="text-foreground">Rebalancing.</span>
            </h2>
            
            <div className="space-y-12 relative">
              {/* Subtle connecting line */}
              <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-surface-border via-amber/20 to-surface-border hidden md:block" />
              
              {steps.map((s, i) => {
                const isActive = activeStep === i;
                return (
                  <div 
                    key={s.num} 
                    className={`flex flex-col md:flex-row gap-6 relative transition-all duration-700 cursor-pointer group`}
                    style={{ 
                      transitionDelay: `${i * 150 + 200}ms`, 
                      opacity: visible ? (isActive ? 1 : 0.4) : 0, 
                      transform: visible ? "translateY(0)" : "translateY(20px)" 
                    }}
                    onClick={() => setActiveStep(i)}
                  >
                    <div className="flex flex-col items-start md:items-center shrink-0 z-10">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-mono text-sm transition-colors duration-500 ${isActive ? 'bg-amber text-background' : 'bg-surface border border-surface-border text-muted-foreground group-hover:text-foreground'}`}>
                        {s.num}
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <h3 className={`font-display text-xl tracking-tight mb-2 transition-colors duration-500 ${isActive ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}`}>
                        {s.title}
                      </h3>
                      <p className="text-muted-foreground font-body leading-relaxed max-w-sm">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side: Professional UI Abstract Component */}
          <div className={`flex justify-center items-center h-full min-h-[500px] transition-all duration-1000 delay-500 ${visible ? 'opacity-100' : 'opacity-0'}`}>
            
            <div className="relative w-full max-w-md aspect-[4/5] md:aspect-square bg-card border border-surface-border rounded-xl p-8 shadow-2xl flex flex-col justify-between overflow-hidden group">
              
              {/* Glass reflection overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

              {/* Header abstract */}
              <div className="flex justify-between items-center border-b border-surface-border pb-6">
                <div className="flex flex-col gap-1">
                  <div className="w-16 h-1.5 bg-surface-border rounded-full" />
                  <div className="w-24 h-1.5 bg-surface-border rounded-full opacity-50" />
                </div>
                <div className="w-8 h-8 rounded-full border border-surface-border flex items-center justify-center">
                  <div className="w-2 h-2 bg-amber rounded-full" />
                </div>
              </div>

              {/* Dynamic Content based on Active Step */}
              <div className="flex-1 flex flex-col justify-center relative">
                
                {/* Step 1 Graphic: Connection / Parsing */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${activeStep === 0 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}>
                  <div className="w-32 h-32 rounded-full border border-surface-border flex items-center justify-center relative">
                    <svg className="w-8 h-8 text-muted-foreground animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {/* Floating nodes */}
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-surface border border-surface-border rounded-full" />
                    <div className="absolute bottom-4 -left-3 w-3 h-3 bg-amber rounded-full" />
                    <div className="absolute -bottom-2 right-4 w-5 h-5 bg-surface border border-surface-border rounded-full" />
                  </div>
                  <div className="mt-8 flex gap-2">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-8 h-1 bg-surface-border rounded-full overflow-hidden">
                        <div className="h-full bg-amber w-full origin-left animate-[scale-x_2s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.2}s` }} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 2 Graphic: Targets / Matrix */}
                <div className={`absolute inset-0 flex flex-col justify-center transition-all duration-700 ${activeStep === 1 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}>
                  <div className="space-y-4 w-full px-4">
                    {[
                      { label: "Equity", target: 60, current: 80, color: "bg-amber" },
                      { label: "Bonds", target: 30, current: 15, color: "bg-drift-red" },
                      { label: "Gold", target: 10, current: 5, color: "bg-surface-border" }
                    ].map((item, i) => (
                      <div key={i} className="w-full">
                        <div className="flex justify-between mb-2">
                          <span className="font-mono text-[10px] uppercase text-muted-foreground">{item.label}</span>
                          <span className="font-mono text-[10px] text-foreground">{item.target}% Target</span>
                        </div>
                        <div className="h-2 w-full bg-surface rounded-full overflow-hidden relative">
                          <div className={`absolute top-0 bottom-0 left-0 ${item.color} transition-all duration-1000`} style={{ width: `${item.current}%` }} />
                          <div className="absolute top-0 bottom-0 border-r border-background z-10" style={{ left: `${item.target}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Step 3 Graphic: Rebalance / Execution */}
                <div className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-700 ${activeStep === 2 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}>
                  <div className="w-full flex items-end justify-center gap-3 px-4 h-32">
                    {[40, 80, 30, 90, 60].map((h, i) => (
                      <div key={i} className="w-12 bg-surface rounded-t-sm relative overflow-hidden flex items-end" style={{ height: '100%' }}>
                        <div className="w-full bg-surface-border transition-all duration-1000 origin-bottom" style={{ height: `${h}%` }} />
                        {/* Target line */}
                        <div className="absolute w-full h-[1px] bg-amber top-[50%] z-10" />
                        {/* Active balancing indicator */}
                        {h > 50 && <div className="absolute top-0 w-full bg-drift-red opacity-50 transition-all duration-1000" style={{ height: `${h - 50}%` }} />}
                      </div>
                    ))}
                  </div>
                  <div className="mt-8 pt-6 border-t border-surface-border w-full flex justify-between items-center px-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-[10px] uppercase text-muted-foreground">Drift Variance</span>
                      <span className="font-mono text-sm text-foreground">Detected</span>
                    </div>
                    <div className="px-3 py-1 bg-foreground text-background font-mono text-[10px] uppercase tracking-widest rounded-sm">
                      Execute
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
          
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
