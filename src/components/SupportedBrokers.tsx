const SupportedBrokers = () => {
  const brokers = [
    "ZERODHA",
    "GROWW",
    "UPSTOX",
    "COIN",
    "INDMONEY",
    "KFINTECH",
    "CAMS",
    "KUVERA",
    "ANGELONE",
    "PAYTM MONEY",
    "ICICI DIRECT",
    "HDFC SKY"
  ];

  // Duplicate for seamless infinite scrolling
  const marqueeContent = [...brokers, ...brokers, ...brokers];

  return (
    <div className="border-t border-b border-surface-border/30 bg-surface/10 py-6 overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 mb-4 relative z-10 text-center">
         <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-muted-foreground/60">
            Compatible with CAS statements from
         </p>
      </div>

      <div className="flex w-fit animate-marquee hover:pause">
        {marqueeContent.map((broker, index) => (
          <div key={index} className="flex items-center mx-6">
            <span className="font-display font-bold text-xl md:text-2xl text-muted-foreground/30 uppercase tracking-widest whitespace-nowrap hover:text-amber/80 transition-colors duration-300 cursor-default">
              {broker}
            </span>
            <span className="mx-6 text-amber/20 font-mono text-xs">
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
            animation: marquee 30s linear infinite;
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
