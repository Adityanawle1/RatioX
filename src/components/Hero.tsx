import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import Globe from "./Globe";

const Hero = () => {
  const { user } = useAuth();
  const ctaHref = user ? "/dashboard" : "/login";
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);

  const rotatingWords = ["drifts", "shifts", "moves", "changes"];

  useEffect(() => {
    setIsLoaded(true);
    
    // Rotate words
    const wordInterval = setInterval(() => {
      setCurrentWord(prev => (prev + 1) % rotatingWords.length);
    }, 2500);

    return () => {
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
                  Ratio x × Quantr Core
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
              <p className="font-body text-sm text-muted-foreground max-w-lg leading-relaxed mb-12 border-l-2 border-surface-border pl-4">
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
                  {user ? "Go to Dashboard" : "Initialize Tracking"}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 12l4-4-4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>

                <div className="flex flex-col gap-2 border-l border-surface-border pl-6">
                  <div className="flex items-center gap-3 text-muted-foreground font-mono text-xs uppercase tracking-wide">
                    <div className="w-1.5 h-1.5 bg-drift-green rounded-full"></div>
                    <span className="opacity-80">Free core access</span>
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