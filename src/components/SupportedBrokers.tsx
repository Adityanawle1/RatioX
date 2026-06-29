const SupportedBrokers = () => {
  const brokers = [
    { name: "ZERODHA", domain: "zerodha.com" },
    { name: "GROWW", domain: "groww.in" },
    { name: "UPSTOX", domain: "upstox.com" },
    { name: "INDMONEY", domain: "indmoney.com" },
    { name: "ANGELONE", domain: "angelone.in" },
    { name: "KUVERA", domain: "kuvera.in" },
    { name: "PAYTM MONEY", domain: "paytmmoney.com" },
    { name: "ICICI DIRECT", domain: "icicidirect.com" }
  ];

  // Duplicate for seamless infinite scrolling
  const marqueeContent = [...brokers, ...brokers, ...brokers];

  return (
    <div className="border-t border-b border-surface-border/30 bg-surface/10 py-5 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 mb-4 relative z-10 text-center">
         <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground/60">
            Compatible with CAS statements from
         </p>
      </div>

      <div className="flex w-fit animate-marquee hover:pause items-center">
        {marqueeContent.map((broker, index) => (
          <div key={index} className="flex items-center mx-8">
            <div className="flex items-center gap-3 group cursor-default">
              <img 
                src={`https://logo.clearbit.com/${broker.domain}`} 
                alt={`${broker.name} logo`} 
                className="w-6 h-6 rounded-sm grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 bg-white"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="font-display font-bold text-lg md:text-xl text-muted-foreground/40 uppercase tracking-widest whitespace-nowrap group-hover:text-amber/90 transition-colors duration-300">
                {broker.name}
              </span>
            </div>
            <span className="mx-8 text-amber/20 font-mono text-xs">
              ✦
            </span>
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-100% / 3)); }
          }
          .animate-marquee {
            animation: marquee 35s linear infinite;
          }
          .pause {
            animation-play-state: paused;
          }
        `}
      </style>
    </div>
  );
};

export default SupportedBrokers;
