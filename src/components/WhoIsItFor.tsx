import { useScrollReveal } from "./useScrollReveal";

const retail = [
  "Managing mutual fund arrays and direct equity privately",
  "Tired of manually tracking allocation via spreadsheets",
  "Wants strict rule-based thresholds for self-directed tracking",
  "Importing portfolio data via standard CSV broker exports",
];

const hni = [
  "Tracking multi-asset parameters across segmented books",
  "Wants immutable audit trails for portfolio analysis",
  "Tracking unique allocation constraints per portfolio",
  "High-volume, multi-folio analysis parameters",
];

const WhoIsItFor = () => {
  const { ref, visible } = useScrollReveal(0.15);

  return (
    <section className="py-24 md:py-32 border-t border-surface-border bg-background" ref={ref}>
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Label */}
        <div className={`flex items-center gap-3 mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="w-8 h-[1px] bg-muted-foreground/30"></div>
          <span className="font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Deployment Profiles
          </span>
        </div>

        <h2
          className={`font-display text-4xl lg:text-5xl font-light text-foreground mb-16 transition-all duration-700 leading-tight tracking-tight ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "100ms" }}
        >
          Two distinct execution layers. <br/>
          <span className="text-muted-foreground">One underlying engine.</span>
        </h2>

        <div className="grid md:grid-cols-2">
          {/* Retail Terminal */}
          <div
            className={`border border-surface-border bg-surface/10 p-8 md:p-12 transition-all duration-700 group hover:bg-surface/20 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="flex justify-between items-center mb-10 border-b border-surface-border pb-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Profile // Tier_01</span>
              <span className="font-mono text-xs text-foreground bg-surface border border-surface-border px-2 py-1">INDIVIDUAL</span>
            </div>
            
            <h3 className="font-display text-2xl tracking-tight text-foreground mb-8">Self-Directed Access</h3>
            
            <ul className="space-y-4">
              {retail.map((item, idx) => (
                <li key={idx} className="text-sm text-muted-foreground font-body leading-relaxed flex items-start gap-4">
                  <div className="w-1.5 h-1.5 bg-surface-border group-hover:bg-amber transition-colors mt-1.5 rounded-sm shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* HNI Terminal */}
          <div
            className={`border border-surface-border border-t-0 md:border-t md:border-l-0 bg-surface/10 p-8 md:p-12 transition-all duration-700 group hover:bg-surface/20 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="flex justify-between items-center mb-10 border-b border-surface-border pb-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Profile // Tier_02</span>
              <span className="font-mono text-xs text-foreground bg-amber/10 border border-amber/30 text-amber px-2 py-1">ENTERPRISE</span>
            </div>

            <h3 className="font-display text-2xl tracking-tight text-foreground mb-8">Advanced Analysis</h3>
            
            <ul className="space-y-4">
              {hni.map((item, idx) => (
                <li key={idx} className="text-sm text-muted-foreground font-body leading-relaxed flex items-start gap-4">
                  <div className="w-1.5 h-1.5 bg-surface-border group-hover:bg-amber transition-colors mt-1.5 rounded-sm shrink-0"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoIsItFor;
