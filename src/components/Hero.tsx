import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import SocialProof from "./SocialProof";

const Hero = () => {
  const { user } = useAuth();
  const ctaHref = user ? "/dashboard/fee-audit" : "/signup";
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);

  const rotatingWords = [
    "bleeding hidden fees.", 
    "overpaying its TER.", 
    "leaking to commissions.", 
    "losing ₹ lakhs silently."
  ];

  useEffect(() => {
    setIsLoaded(true);
    
    // Rotate words
    const wordInterval = setInterval(() => {
      setCurrentWord(prev => (prev + 1) % rotatingWords.length);
    }, 2800);

    return () => {
      clearInterval(wordInterval);
    };
  }, [rotatingWords.length]);

  return (
    <section className="relative min-h-screen bg-black border-b border-surface-border overflow-hidden">
      
      {/* Abstract background — subtle gradient mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Radial gradient core */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_rgba(232,137,12,0.06)_0%,_transparent_60%)]" />
        {/* Secondary accent */}
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_rgba(30,60,100,0.05)_0%,_transparent_60%)]" />
        {/* Noise/grain texture overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg%20viewBox%3D%220%200%20256%20256%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cfilter%20id%3D%22n%22%3E%3CfeTurbulence%20baseFrequency%3D%220.9%22/%3E%3C/filter%3E%3Crect%20width%3D%22100%25%22%20height%3D%22100%25%22%20filter%3D%22url(%23n)%22/%3E%3C/svg%3E')]" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left: Copy */}
            <div className="w-full">
              
              {/* Eyebrow Text */}
              <div className={`transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-[1px] bg-amber/50"></div>
                  <span className="font-body text-xs uppercase tracking-[0.15em] text-muted-foreground font-semibold">
                    Mutual Fund & Portfolio Intelligence
                  </span>
                </div>
              </div>

              {/* Main Heading */}
              <div className={`transition-all duration-700 delay-100 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-white leading-[1.15] mb-6 tracking-tight">
                  <span className="block opacity-95 mb-1">Your mutual fund is</span>
                  <span 
                    key={currentWord}
                    className="block text-[#E8890C] animate-in fade-in slide-in-from-bottom-2 duration-500"
                  >
                    {rotatingWords[currentWord]}
                  </span>
                </h1>

                {/* Subheading */}
                <div className="mb-10 mt-6">
                  <h2 className="font-body text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                    India's first platform that exposes the <span className="text-white border-b border-white/20 pb-0.5">real cost</span> of your mutual funds, while keeping your portfolio <span className="text-white border-b border-white/20 pb-0.5">perfectly rebalanced</span>.
                  </h2>
                </div>
              </div>

              {/* Description */}
              <div className={`transition-all duration-700 delay-200 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <p className="font-body text-sm text-muted-foreground/80 max-w-lg leading-relaxed mb-10 border-l-[2px] border-amber/40 pl-4">
                  Ratio x audits every rupee your mutual fund charges—revealing hidden TERs and regular vs direct gaps. Beyond fee transparency, our intelligent engine tracks portfolio drift and provides one-click rebalance scenarios to keep your asset allocation on target.
                </p>
              </div>

              {/* CTA Section */}
              <div className={`transition-all duration-700 delay-300 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <Link
                    to={ctaHref}
                    className="group relative overflow-hidden bg-foreground text-background font-body text-sm font-semibold px-8 py-4 hover:shadow-[0_0_30px_rgba(232,147,16,0.2)] transition-all duration-300 flex items-center gap-3"
                  >
                    <div className="absolute inset-0 bg-amber transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0" />
                    <span className="relative z-10 group-hover:text-background transition-colors">
                      {user ? "Go to Dashboard" : "Audit My Funds Free"}
                    </span>
                    <svg className="relative z-10 w-4 h-4 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M6 12l4-4-4-4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>

                  <div className="flex flex-col gap-1.5 border-l border-surface-border pl-5">
                    <div className="flex items-center gap-2 text-muted-foreground text-xs font-body">
                      <div className="w-1.5 h-1.5 bg-drift-green rounded-full"></div>
                      <span>Free forever · No credit card</span>
                    </div>
                  </div>
                </div>

                {/* Scroll hint */}
                <div 
                  onClick={() => document.getElementById('fee-calculator')?.scrollIntoView({ behavior: 'smooth' })}
                  className="mt-5 text-xs font-body text-amber/80 cursor-pointer flex items-center gap-1.5 w-max hover:text-amber transition-colors"
                >
                  Calculate your hidden fee loss right now <span className="animate-bounce inline-block">↓</span>
                </div>

                {/* Social Proof — below CTA */}
                <div className="mt-10">
                  <SocialProof />
                </div>
              </div>
            </div>

            {/* Right: Product Mockup — Fee Audit focused */}
            <div className={`transition-all duration-1000 delay-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
              <div className="relative">
                {/* Glow behind mockup */}
                <div className="absolute -inset-4 bg-[radial-gradient(ellipse_at_center,_rgba(232,137,12,0.08)_0%,_transparent_70%)] pointer-events-none" />
                
                {/* Dashboard Card */}
                <div className="border border-surface-border bg-card/80 backdrop-blur-sm shadow-2xl relative overflow-hidden group">
                  {/* Glass overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  
                  {/* Title bar */}
                  <div className="border-b border-surface-border px-5 py-3 bg-surface/50 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-drift-red/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber/60" />
                        <div className="w-2.5 h-2.5 rounded-full bg-drift-green/60" />
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground ml-2">Mutual Fund Fee Audit</span>
                    </div>
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full border border-surface-border" />
                      <div className="w-2 h-2 rounded-full border border-surface-border" />
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Fee Score */}
                    <div className="flex items-end justify-between">
                      <div>
                        <span className="text-xs text-muted-foreground font-body block mb-1">Total Fee Drag</span>
                        <span className="font-display text-4xl font-light text-drift-red">₹3.2L<span className="text-base text-muted-foreground/50"> lost</span></span>
                      </div>
                      <span className="font-mono text-xs text-drift-red bg-drift-red/10 border border-drift-red/20 px-2.5 py-1 rounded-sm">High Cost</span>
                    </div>

                    {/* Fund Fee Breakdown */}
                    <div className="border-t border-surface-border pt-5 space-y-3">
                      <span className="text-[10px] font-body uppercase tracking-wider text-muted-foreground">Fund Expense Analysis</span>
                      {[
                        { name: "HDFC Mid-Cap Opp (Regular)", ter: "1.74%", directTer: "0.81%", saving: "₹48K", status: "drift-red" },
                        { name: "SBI Blue Chip (Regular)", ter: "1.52%", directTer: "0.72%", saving: "₹36K", status: "drift-red" },
                        { name: "Parag Parikh Flexi (Direct)", ter: "0.63%", directTer: "0.63%", saving: "—", status: "drift-green" },
                        { name: "ICICI Pru Equity & Debt", ter: "1.81%", directTer: "1.05%", saving: "₹31K", status: "amber" },
                        { name: "Nippon India Small Cap", ter: "1.62%", directTer: "0.68%", saving: "₹52K", status: "drift-red" },
                      ].map((fund, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className={`w-1.5 h-1.5 rounded-full bg-${fund.status} shrink-0`} />
                          <span className="text-xs font-body text-foreground truncate flex-1">{fund.name}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-muted-foreground">{fund.ter}</span>
                            <span className="text-[8px] text-muted-foreground">→</span>
                            <span className="font-mono text-[10px] text-drift-green">{fund.directTer}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Savings Summary */}
                    <div className="border-t border-surface-border pt-5">
                      <div className="flex items-center justify-between bg-amber/5 border border-amber/15 px-4 py-3 rounded-sm">
                        <div>
                          <span className="text-[10px] text-muted-foreground font-body block">Switch to Direct & Save</span>
                          <span className="font-mono text-lg text-amber font-semibold">₹1,67,000</span>
                        </div>
                        <span className="text-[10px] text-muted-foreground font-body">over 10 years</span>
                      </div>
                    </div>

                    {/* Bottom action */}
                    <div className="flex gap-3">
                      <div className="flex-1 bg-amber text-background font-body text-xs font-semibold text-center py-2.5 rounded-sm">
                        Full Fee Audit
                      </div>
                      <div className="flex-1 bg-surface border border-surface-border text-foreground font-body text-xs text-center py-2.5 rounded-sm hover:border-white/10 transition-colors cursor-pointer">
                        Rebalance
                      </div>
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

export default Hero;