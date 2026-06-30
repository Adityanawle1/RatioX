import React, { useEffect, useRef } from "react";
import Nav from "@/components/Nav";
import { Link } from "react-router-dom";

const Manifesto = () => {
  const donateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Reveal animation for text blocks
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("translate-y-0", "opacity-100");
            entry.target.classList.remove("translate-y-8", "opacity-0");
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    document.querySelectorAll(".reveal-text").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#060606] text-[#e0e0e0] font-body selection:bg-white selection:text-black">
      <Nav />
      
      <main className="pt-24 md:pt-32 pb-16 md:pb-24 px-5 md:px-8 max-w-7xl mx-auto relative z-10">
        
        {/* Navigation Back */}
        <div className="mb-12 md:mb-20">
          <Link 
            to="/"
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#666] hover:text-white transition-colors"
          >
            [ ← Return to Index ]
          </Link>
        </div>

        {/* 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 relative">
          
          {/* LEFT COLUMN: MANIFESTO CONTENT */}
          <div className="lg:w-3/5">
            <header className="mb-20 md:mb-32">
              <p className="font-mono text-[10px] uppercase tracking-widest text-drift-green mb-8">The RatioX Manifesto</p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-7xl tracking-tighter leading-[1.05] text-white mb-8">
                Clarity should never <br /> have a price tag.
              </h1>
              <p className="text-xl md:text-2xl leading-relaxed font-light text-[#d0d0d0] max-w-2xl">
                We believe access to transparent financial tools should never depend on how much someone can pay. We refuse to build a business that profits by making investing more confusing.
              </p>
            </header>

            <div className="space-y-24 md:space-y-32">
              
              {/* The Industry Problem */}
              <div className="reveal-text transition-all duration-1000 ease-out translate-y-8 opacity-0">
                <div className="border-l border-[#333] pl-6 md:pl-10 relative">
                  <div className="absolute -left-[5px] top-2 w-2 h-2 bg-[#060606] border border-[#555]"></div>
                  <h2 className="font-display text-3xl md:text-4xl text-white mb-6">The Industry Conflict</h2>
                  <p className="text-[#999] leading-relaxed font-light text-lg mb-6">
                    Financial decisions dictate futures. Yet, many platforms that guide these decisions earn their revenue through premium subscriptions, hidden paywalls, advertisements, and affiliate links. 
                  </p>
                  <p className="text-[#999] leading-relaxed font-light text-lg mb-6">
                    They monetize through sponsored investment recommendations and hidden conflicts of interest. When a platform earns money from influencing your decisions, trust becomes inherently difficult. 
                  </p>
                  <p className="text-[#e0e0e0] leading-relaxed font-normal text-xl">
                    We want you to wonder whether an investment is mathematically sound—not whether the recommendation was paid for.
                  </p>
                </div>
              </div>

              {/* The RatioX Philosophy */}
              <div className="reveal-text transition-all duration-1000 ease-out translate-y-8 opacity-0">
                <div className="border-l border-[#333] pl-6 md:pl-10 relative">
                  <div className="absolute -left-[5px] top-2 w-2 h-2 bg-[#060606] border border-[#555]"></div>
                  <h2 className="font-display text-3xl md:text-4xl text-white mb-6">Trust over Revenue</h2>
                  <p className="text-[#999] leading-relaxed font-light text-lg mb-6">
                    RatioX is completely free. There is no Premium version. There are no sponsored funds, no sponsored rankings, and no paid partnerships that influence our mathematics. 
                  </p>
                  <p className="text-[#999] leading-relaxed font-light text-lg">
                    Every user gets the exact same experience. No feature is reserved for paying users. We believe that absolute trust is infinitely more valuable than recurring revenue.
                  </p>
                </div>
              </div>

              {/* Our Commitment */}
              <div className="reveal-text transition-all duration-1000 ease-out translate-y-8 opacity-0">
                <div className="border-l border-[#333] pl-6 md:pl-10 relative">
                  <div className="absolute -left-[5px] top-2 w-2 h-2 bg-[#060606] border border-[#555]"></div>
                  <h2 className="font-display text-3xl md:text-4xl text-white mb-8">Our Commitment</h2>
                  
                  <ul className="space-y-4 font-mono text-sm tracking-wide text-[#b0b0b0]">
                    <li className="flex items-center gap-4">
                      <span className="text-drift-green">■</span> No Premium Plan.
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="text-drift-green">■</span> No Advertisements.
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="text-drift-green">■</span> No Sponsored Rankings.
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="text-drift-green">■</span> No Affiliate Manipulation.
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="text-drift-green">■</span> No Selling User Data.
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="text-drift-green">■</span> Equal Access For Everyone.
                    </li>
                  </ul>
                </div>
              </div>

            </div>
            
            <div className="mt-24 md:mt-32 pt-8 border-t border-[#222]">
              <p className="text-[10px] font-mono text-[#444] leading-relaxed uppercase tracking-[0.1em]">
                Disclaimer: RatioX is a mathematical analysis tool for educational purposes. We are not SEBI-registered financial advisors. We do not provide investment advice.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY SUSTAINABILITY UI */}
          <div className="lg:w-2/5 w-full lg:sticky lg:top-[80px] h-fit lg:-mt-2" ref={donateRef}>
            
            <div className="mb-8">
              <h3 className="font-display text-3xl md:text-4xl text-white mb-4">Sustainability.</h3>
              <p className="text-[#999] leading-relaxed font-light text-sm mb-4">
                Building RatioX costs money. Servers, financial data, security, and development. 
              </p>
              <p className="text-[#999] leading-relaxed font-light text-sm mb-4">
                Instead of recovering costs through ads or subscriptions, RatioX stays independent. If you genuinely believe in this mission, you are welcome to support it voluntarily. 
              </p>
              <p className="text-[#e0e0e0] leading-relaxed font-normal text-sm border-l-2 border-[#444] pl-4">
                Support changes nothing. Everyone continues using the exact same RatioX.
              </p>
            </div>

            <div className="border border-[#222] bg-[#0a0a0a] relative overflow-hidden group">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:1rem_1rem]"></div>
              
              <div className="p-6 md:p-8 relative z-10 flex flex-col items-center">
                
                {/* QR Code */}
                <div className="bg-[#111] border border-[#333] p-4 flex flex-col items-center w-full max-w-[280px] mb-6">
                  <div className="w-full aspect-square bg-white p-2 mb-4 relative cursor-crosshair overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 -translate-y-full group-hover:animate-[scanline_2s_ease-in-out_infinite] opacity-0 group-hover:opacity-100 mix-blend-difference pointer-events-none border-b border-green-400 z-20"></div>
                    <img src="/my-qr.png" alt="UPI QR Code" className="w-full h-full object-contain relative z-10" />
                  </div>
                  
                  <div className="w-full border-t border-dashed border-[#444] pt-3 text-center">
                    <p className="font-mono text-[10px] text-[#888] mb-1">DESTINATION: <span className="text-white">nawleaditya195-2@oksbi</span></p>
                    <p className="font-mono text-[9px] text-[#555] uppercase">Scan via GPay, PhonePe, Paytm</p>
                  </div>
                </div>

                <div className="text-center mt-2">
                  <p className="font-display text-lg text-white italic">
                    "Supporting a better internet."
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default Manifesto;
