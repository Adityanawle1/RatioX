import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import Globe from "./Globe";

const Hero = () => {
  const { user } = useAuth();
  const ctaHref = user ? "/dashboard" : "/login";
  const [isLoaded, setIsLoaded] = useState(false);
  const [assetCount, setAssetCount] = useState(14202);
  const [currentWord, setCurrentWord] = useState(0);

  const rotatingWords = ["drifts", "shifts", "moves", "changes"];

  useEffect(() => {
    setIsLoaded(true);
    
    // Animate asset count
    const countInterval = setInterval(() => {
      setAssetCount(prev => prev + Math.floor(Math.random() * 3));
    }, 3000);

    // Rotate words
    const wordInterval = setInterval(() => {
      setCurrentWord(prev => (prev + 1) % rotatingWords.length);
    }, 2500);

    return () => {
      clearInterval(countInterval);
      clearInterval(wordInterval);
    };
  }, [rotatingWords.length]);

  return (
    <section className="relative min-h-screen bg-background border-b border-surface-border overflow-hidden">
      {/* Background Grid for minimal technical feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      {/* Globe Background - Immersive Full Screen */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Globe />
      </div>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-24 w-full">
          <div className="w-full lg:max-w-[55%]">
            
            {/* Eyebrow Text */}
            <div className={`transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-[1px] bg-amber/50"></div>
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Ratio x / Systems
                </span>
              </div>
            </div>

            {/* Main Heading */}
            <div className={`transition-all duration-700 delay-100 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold text-foreground leading-[1.1] mb-6 tracking-tight flex flex-col md:flex-row md:flex-wrap md:items-baseline gap-x-4">
                <span>Your portfolio</span>
                <div className="inline-flex min-w-[280px]">
                  <span className="text-amber animate-pulse">
                    {rotatingWords[currentWord]}.
                  </span>
                </div>
              </h1>

              {/* Subheading */}
              <div className="mb-10">
                <h2 className="font-body text-xl md:text-2xl text-muted-foreground max-w-xl leading-relaxed">
                  Most investors <span className="text-foreground border-b border-amber/30 pb-0.5">never notice</span> the silent wealth erosion.
                </h2>
              </div>
            </div>

            {/* Description */}
            <div className={`transition-all duration-700 delay-200 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <p className="font-mono text-sm text-muted-foreground max-w-lg leading-relaxed mb-12 border-l-2 border-surface-border pl-4">
                Real-time drift detection, threshold alerts, and one-click rebalancing. Built for investors who view asset allocation as a strict mechanical discipline.
              </p>
            </div>

            {/* CTA Section */}
            <div className={`transition-all duration-700 delay-300 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Link
                  to={ctaHref}
                  className="bg-foreground text-background font-mono text-sm font-semibold uppercase tracking-widest px-8 py-4 hover:bg-amber transition-colors flex items-center gap-3"
                >
                  {user ? "System Dashboard" : "Initialize Tracking"}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 12l4-4-4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>

                <div className="flex flex-col gap-2 border-l border-surface-border pl-6">
                  <div className="flex items-center gap-3 text-muted-foreground font-mono text-xs uppercase tracking-wide">
                    <div className="w-1.5 h-1.5 bg-drift-green rounded-full"></div>
                    <span className="opacity-80">Free core access</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground font-mono text-xs uppercase tracking-wide">
                    <div className="w-1.5 h-1.5 bg-drift-green rounded-full"></div>
                    <span className="opacity-80">Syncs via CSV / Broker</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status HUD - Clean, data-first look */}
      <div className={`hidden lg:block absolute top-24 right-12 transition-all duration-1000 delay-500 ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-background border border-surface-border p-5 w-[280px]">
          <div className="flex items-center justify-between border-b border-surface-border pb-3 mb-3">
            <span className="text-foreground font-mono text-[10px] uppercase tracking-widest">Network Status</span>
            <div className="flex items-center gap-1.5">
              <span className="text-drift-green font-mono text-[10px] uppercase">Online</span>
              <div className="w-1.5 h-1.5 bg-drift-green rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-muted-foreground font-mono text-xs uppercase tracking-wide">Active Nodes</span>
              <span className="text-amber font-mono text-sm">
                {assetCount.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-end">
              <span className="text-muted-foreground font-mono text-xs uppercase tracking-wide">Latency</span>
              <span className="text-foreground font-mono text-sm">&lt; 50ms</span>
            </div>

            <div className="w-full h-8 flex items-end gap-1 pt-2">
              {[4, 7, 3, 8, 5, 9, 6, 4, 8, 2].map((h, i) => (
                <div key={i} className="flex-1 bg-surface-border rounded-t-sm" style={{ height: `${h * 10}%` }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators - Footer area */}
      <div className={`absolute bottom-0 left-0 w-full border-t border-surface-border bg-surface/30 backdrop-blur-sm transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-4">
          <div className="flex flex-wrap items-center gap-8 md:gap-16">
            <div className="flex items-baseline gap-3">
              <span className="text-foreground font-mono text-lg">99.9%</span>
              <span className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest">Uptime</span>
            </div>
            
            <div className="flex items-baseline gap-3">
              <span className="text-foreground font-mono text-lg">24/7</span>
              <span className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest">Monitoring</span>
            </div>
            
            <div className="flex items-baseline gap-3">
              <span className="text-foreground font-mono text-lg truncate">AES-256</span>
              <span className="text-muted-foreground font-mono text-[10px] uppercase tracking-widest">Encryption</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;