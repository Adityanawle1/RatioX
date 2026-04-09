import { useScrollReveal } from "./useScrollReveal";

const features = [
  { id: "01", title: "Real-Time Drift Detection", copy: "Monitor allocation vs target dynamically. Triggered flags upon breaching absolute or relative variance thresholds." },
  { id: "02", title: "Custom Threshold Bands", copy: "Dictate strict tolerance per asset class (e.g., 2% Debt, 5% Equity). Your logic matrix, your absolute precision." },
  { id: "03", title: "Algorithmic Rebalancing", copy: "One-click execution path. The engine calculates fractional trade orders needed to restore root baseline. No spreadsheets." },
  { id: "04", title: "Tax-Aware Routing", copy: "High-latency analysis flags capital gains implications before execution, surfacing tax-efficient alternatives natively." },
  { id: "05", title: "Automated Triggers", copy: "Set calendar or variance-based cron jobs. The platform handles realignment autonomously within strict user-parameter bounds." },
  { id: "06", title: "Audit & Telemetry Logs", copy: "Immutable history. Every rebalance action is logged with variance deltas, timestamps, and order justification." },
];

const Features = () => {
  const { ref, visible } = useScrollReveal(0.1);

  return (
    <section id="features" className="py-24 md:py-32 border-t border-surface-border bg-background" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Label */}
        <div className={`flex items-center gap-3 mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="w-8 h-[1px] bg-muted-foreground/30"></div>
          <span className="font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            System Capabilities
          </span>
        </div>

        <h2
          className={`font-display text-4xl lg:text-5xl font-light text-foreground mb-16 transition-all duration-700 leading-tight tracking-tight max-w-2xl ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "100ms" }}
        >
          Everything you need to <br/> maintain system balance.
        </h2>

        {/* Industrial Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-surface-border">
          {features.map((f, i) => (
            <div
              key={f.id}
              className={`bg-background p-8 lg:p-10 transition-all duration-700 hover:bg-surface/30 group`}
              style={{ 
                transitionDelay: `${i * 100 + 200}ms`, 
                opacity: visible ? 1 : 0, 
              }}
            >
              <div className="flex justify-between items-start mb-12">
                <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  [SYS.{f.id}]
                </span>
                <div className="w-2 h-2 border border-surface-border group-hover:border-amber group-hover:bg-amber transition-colors"></div>
              </div>
              <h3 className="font-display text-xl tracking-tight text-foreground mb-3">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-body group-hover:text-gray-300 transition-colors">{f.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
