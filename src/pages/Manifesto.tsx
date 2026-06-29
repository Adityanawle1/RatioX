import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "@/components/Nav";
import Magnetic from "@/components/Magnetic";
import { toast } from "sonner";

const Manifesto = () => {
  const navigate = useNavigate();
  const donateRef = useRef<HTMLDivElement>(null);

  const handleCopyUpi = () => {
    // This is the text that gets copied to the clipboard!
    navigator.clipboard.writeText("nawleaditya195-2@oksbi");
    toast.success("UPI ID copied to clipboard!");
  };

  const scrollToDonate = () => {
    donateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="min-h-screen bg-[#060606] text-[#e0e0e0] font-body selection:bg-white selection:text-black">
      <Nav />
      
      <main className="pt-24 md:pt-32 pb-16 md:pb-24 px-5 md:px-8 max-w-7xl mx-auto relative z-10">
        
        {/* Navigation Back */}
        <div className="mb-12">
          <button 
            onClick={() => navigate("/")}
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#666] hover:text-white transition-colors"
          >
            [ ← Return to Index ]
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          
          {/* LEFT COLUMN: THE MANIFESTO (SCROLLS) */}
          <div className="lg:w-3/5 w-full">
            
            {/* The Hook / Hero */}
            <header className="mb-16 md:mb-24">
              <p className="font-mono text-[10px] uppercase tracking-widest text-amber mb-6">The RatioX Manifesto</p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-7xl tracking-tighter leading-[1] text-white mb-8">
                Financial Clarity <br />
                Is Not A Premium Feature.
              </h1>
              <p className="text-xl md:text-2xl leading-relaxed font-light text-[#d0d0d0] mb-8">
                We built this tool to help you stop paying lakhs in hidden fees to giant banks. We don't charge subscriptions and we don't run ads. <span className="text-white font-medium">But surviving the internet isn't free.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <Magnetic strength={15}>
                  <button 
                    onClick={scrollToDonate}
                    className="bg-white text-black font-mono uppercase tracking-widest text-[10px] font-bold px-6 py-4 hover:bg-amber transition-colors border border-transparent hover:border-black flex items-center gap-2"
                  >
                    Support The Project <span>↓</span>
                  </button>
                </Magnetic>
                <p className="text-[#666] font-mono text-[10px] uppercase tracking-widest max-w-[200px]">
                  Even ₹50 or ₹100 helps keep the servers running.
                </p>
              </div>
            </header>

            {/* Statements */}
            <div className="space-y-16 md:space-y-24 border-l border-[#222] pl-6 md:pl-10">
              
              {/* Statement 01 */}
              <div className="relative group">
                <div className="absolute -left-[25px] md:-left-[41px] top-1.5 w-3 h-3 bg-[#060606] border border-[#444] group-hover:border-white transition-colors"></div>
                <span className="font-display text-2xl text-[#555] block mb-2">01</span>
                <h2 className="font-display text-2xl md:text-3xl text-white mb-4">The Trap</h2>
                <p className="text-[#999] leading-relaxed font-light text-lg">
                  Banks silently siphon <span className="text-white font-mono px-1 bg-[#222]">1.5%</span> of your wealth every year through "Regular" mutual funds. Over 20 years, that’s lakhs of rupees vanishing from your family's future, just to pay a broker commission. It's a legal, invisible bleed. We built this to expose the scam.
                </p>
              </div>

              {/* Statement 02 */}
              <div className="relative group">
                <div className="absolute -left-[25px] md:-left-[41px] top-1.5 w-3 h-3 bg-[#060606] border border-[#444] group-hover:border-white transition-colors"></div>
                <span className="font-display text-2xl text-[#555] block mb-2">02</span>
                <h2 className="font-display text-2xl md:text-3xl text-white mb-4">The Refusal</h2>
                <p className="text-[#999] leading-relaxed font-light text-lg">
                  The startup playbook said: <span className="italic text-white">"Charge ₹999/month or cover the site in ads."</span> We rejected both. Tools built to save you money shouldn't charge you money. We don’t track you, and we definitely don’t sell your portfolio data to brokers. RatioX is 100% independent.
                </p>
              </div>

              {/* Statement 03 */}
              <div className="relative group">
                <div className="absolute -left-[25px] md:-left-[41px] top-1.5 w-3 h-3 bg-[#060606] border border-[#444] group-hover:border-amber transition-colors"></div>
                <span className="font-display text-2xl text-[#555] block mb-2">03</span>
                <h2 className="font-display text-2xl md:text-3xl text-white mb-4">The Reality (Why we need you)</h2>
                <p className="text-[#999] leading-relaxed font-light text-lg">
                  I'm a B.Tech student running this from my dorm. While RatioX is free for you, it’s not free to run. Every time a user analyzes a portfolio, our backend works overtime. Database hosting (Supabase), domains, Vercel bandwidth, and API limits add up fast. Running this out of pocket is a heavy burden. If we saved you money today, any small amount will help us keep the lights on.
                </p>
              </div>

            </div>
            
            <div className="mt-16 md:mt-24 pt-6 border-t border-[#222]">
              <p className="text-[9px] font-mono text-[#444] leading-relaxed uppercase tracking-[0.1em]">
                Disclaimer: RatioX is a mathematical analysis tool for educational purposes. We are not SEBI-registered financial advisors. We do not provide investment advice. Tipping the developer does not constitute an advisor-client relationship.
              </p>
            </div>
          </div>

          {/* RIGHT COLUMN: STICKY DONATION UI */}
          <div className="lg:w-2/5 w-full lg:sticky lg:top-32" ref={donateRef}>
            <div className="border border-[#222] bg-[#0a0a0a] relative overflow-hidden group">
              {/* Subtle grid background */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:1rem_1rem]"></div>
              
              <div className="p-8 md:p-10 relative z-10 flex flex-col items-center">
                
                <h3 className="font-display text-2xl text-white mb-2 text-center">Buy me a coffee.</h3>
                <p className="text-[#888] font-light text-sm text-center mb-8 max-w-[280px]">
                  (Or help pay for our Supabase & Domain costs). Any small amount (₹50, ₹100) helps keep RatioX alive.
                </p>
                
                {/* QR Code */}
                <div className="bg-[#111] border border-[#333] p-4 flex flex-col items-center w-full max-w-[280px] mb-8">
                  <div className="w-full aspect-square bg-white p-2 mb-4 relative cursor-crosshair overflow-hidden">
                    {/* Scanline effect on hover */}
                    <div className="absolute inset-0 bg-white/20 -translate-y-full group-hover:animate-[scanline_2s_ease-in-out_infinite] opacity-0 group-hover:opacity-100 mix-blend-difference pointer-events-none border-b border-green-400 z-20"></div>
                    
                    <img src="/my-qr.png" alt="UPI QR Code" className="w-full h-full object-contain relative z-10" />
                  </div>
                  
                  <div className="w-full border-t border-dashed border-[#444] pt-3 text-center">
                    <p className="font-mono text-[10px] text-[#888] mb-1">DESTINATION: <span className="text-white">nawleaditya195-2@oksbi</span></p>
                    <p className="font-mono text-[9px] text-[#555] uppercase">Scan via GPay, PhonePe, Paytm</p>
                  </div>
                </div>

                <div className="w-full font-mono text-[9px] text-[#666] uppercase tracking-widest space-y-2 mb-6 border-l-2 border-[#333] pl-3">
                  <p>Database (Supabase): <span className="text-white">Scaling Fast</span></p>
                  <p>Domain & Vercel: <span className="text-white">Monthly Drain</span></p>
                  <p>Ads / Tracking: <span className="text-drift-red">0%</span></p>
                </div>

                <Magnetic strength={20}>
                  <button 
                    onClick={handleCopyUpi}
                    className="bg-white text-black font-mono uppercase tracking-[0.2em] text-[10px] font-bold px-8 py-3.5 hover:bg-amber transition-colors border border-transparent hover:border-black w-full"
                  >
                    [ Copy UPI ID ]
                  </button>
                </Magnetic>
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
};

export default Manifesto;
