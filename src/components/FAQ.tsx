import { useState } from "react";
import { useScrollReveal } from "./useScrollReveal";

const faqs = [
  { q: "Is my portfolio data safe?", a: "Your data is encrypted end-to-end using enterprise-grade security. We use read-only data inputs — you manually enter your holdings. No broker credentials or trading passwords are ever stored." },
  { q: "How do I add my holdings?", a: "You can manually enter individual holdings or bulk import via CSV files from your broker statements (Zerodha, Groww, Angel One, etc.). All data entry is manual — we do not connect to any broker account." },
  { q: "How is drift calculated?", a: "Drift = (Current Asset Weight % − Target Configured %). The system tracks real-time divergence against your user-defined thresholds. This is a mathematical calculation for educational tracking purposes." },
  { q: "Does Ratio x provide investment advice?", a: "No. Ratio x is a portfolio tracking and educational analysis tool only. We are not a SEBI-registered investment advisor, research analyst, or portfolio manager. All information is for your personal tracking and educational purposes. Always consult a qualified professional before making financial decisions." },
  { q: "Does Ratio x execute any trades?", a: "No. Ratio x has zero execution capability. We do not connect to any broker, trading platform, or exchange. Any scenario analysis shown is purely educational. You make all decisions independently through your own broker." },
  { q: "Is rebalancing done automatically?", a: "No. Ratio x only shows you drift analysis and educational scenarios. It does not execute, automate, or facilitate any trades. All financial decisions and actions are entirely yours to make independently." },
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
