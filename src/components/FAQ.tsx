import { useState } from "react";
import { useScrollReveal } from "./useScrollReveal";

const faqs = [
  { q: "Is my portfolio data safe?", a: "Your telemetry is encrypted end-to-end. We use read-only exchange and broker connections. Your execution keys remain local." },
  { q: "Which broker gateways are supported?", a: "We natively bridge with Zerodha, Groww, Kuvera, MF Central, and offer raw CSV parsing for offline folios." },
  { q: "How is drift calculated?", a: "Drift = (Current Asset Weight % \u2212 Target Configured %). The system tracks real-time matrix divergence against your thresholds." },
  { q: "Can I deploy this across multiple clients?", a: "Yes. The Tier_02 (Enterprise) infrastructure supports multi-folio monitoring with independent compliance mandates." },
  { q: "Is rebalancing executed automatically?", a: "Not by default. Variance flags are surfaced for manual sign-off. Full autonomous routing can be enabled via settings." },
];

const FAQ = () => {
  const { ref, visible } = useScrollReveal(0.15);
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 md:py-32 border-t border-surface-border bg-background" ref={ref}>
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Header Label */}
        <div className={`flex items-center gap-3 mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="w-8 h-[1px] bg-muted-foreground/30"></div>
          <span className="font-body text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Knowledge Base
          </span>
        </div>

        <h2
          className={`font-display text-4xl lg:text-5xl font-light text-foreground mb-16 transition-all duration-700 tracking-tight ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ filter: visible ? "blur(0px)" : "blur(4px)", transitionDelay: "100ms" }}
        >
          System Inquiry.
        </h2>

        <div className="space-y-2">
          {faqs.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`border border-surface-border bg-surface/10 transition-all duration-700 hover:bg-surface/30 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
                style={{ transitionDelay: `${i * 100 + 200}ms` }}
              >
                <button
                  className="w-full text-left p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <div className="flex gap-4 items-center">
                    <span className={`font-mono text-xs transition-colors ${isOpen ? 'text-amber' : 'text-muted-foreground'}`}>[Q.{i + 1}]</span>
                    <span className={`font-display text-lg tracking-tight transition-colors ${isOpen ? 'text-foreground' : 'text-muted-foreground'}`}>{faq.q}</span>
                  </div>
                  
                  <div className="hidden md:flex font-mono text-[10px] text-muted-foreground border border-surface-border px-2 py-1 items-center gap-2">
                    {isOpen ? 'CLOSE' : 'EXPAND'}
                    <div className={`w-1 h-1 rounded-full ${isOpen ? 'bg-amber' : 'bg-surface-border'}`}></div>
                  </div>
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out`}
                  style={{ maxHeight: isOpen ? "200px" : "0px", opacity: isOpen ? 1 : 0 }}
                >
                  <div className="p-6 pt-0 ml-[46px] border-l border-surface-border mt-0 pl-6">
                    <p className="text-sm text-muted-foreground font-body leading-relaxed flex gap-3">
                      <span className="font-mono text-[10px] text-drift-green mt-1">RES:</span>
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
