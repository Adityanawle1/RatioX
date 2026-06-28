import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "@/components/Nav";
import Magnetic from "@/components/Magnetic";

const AboutUs: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#060606] text-[#e0e0e0] font-body selection:bg-white selection:text-black">
      <Nav />

      <main className="pt-24 md:pt-32 pb-16 md:pb-24 px-5 md:px-12 max-w-6xl mx-auto relative z-10">
        
        {/* Navigation Back */}
        <div className="mb-12 md:mb-20">
          <button 
            onClick={() => navigate("/")}
            className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#666] hover:text-white transition-colors"
          >
            [ ← Return to Index ]
          </button>
        </div>

        {/* Hero Section */}
        <header className="mb-16 md:mb-32 border-b border-[#222] pb-12 md:pb-20">
          <h1 className="font-display text-6xl sm:text-7xl md:text-[10rem] tracking-tighter leading-[0.85] text-white mb-10 md:mb-16 lowercase">
            we build <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#888] to-[#333]">clarity.</span>
          </h1>
          <div className="grid md:grid-cols-12 gap-8 md:gap-6">
            <div className="md:col-span-3">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#666] mb-4">01 // The Vision</p>
            </div>
            <div className="md:col-span-9">
              <p className="text-2xl md:text-4xl leading-tight font-light text-[#d0d0d0] tracking-tight">
                To strip away the engineered complexity of the financial industry. We exist to expose the silent forces that erode generational wealth and give individuals the ultimate architecture for portfolio sovereignty.
              </p>
            </div>
          </div>
        </header>

        {/* The Team - Typographic heavy, no roles */}
        <section className="mb-16 md:mb-32">
          <div className="border-b border-[#222] pb-6 mb-10 md:mb-16 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white tracking-tight">The Architects.</h2>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#666]">02 // Genesis</span>
          </div>

          <div className="grid md:grid-cols-2 border-t border-l border-[#222]">
            
            {/* Column A */}
            <div className="border-b md:border-r border-[#222] p-6 sm:p-8 md:p-12 lg:p-16 hover:bg-white hover:text-black transition-colors duration-700 group flex flex-col justify-between min-h-[400px]">
              <div className="flex justify-between items-start">
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#666] group-hover:text-[#333] transition-colors">Team</h3>
                <span className="font-display text-4xl text-[#333] group-hover:text-black transition-colors">01</span>
              </div>
              <div className="mt-16">
                 <Magnetic strength={20}>
                    <a href="https://portfolio-ao7002fsa-adityaaaaaa1.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-80 transition-opacity cursor-pointer">
                       <h2 className="font-display text-5xl md:text-8xl tracking-tighter uppercase inline-block">
                          Aditya<span className="ml-2 md:ml-4 font-mono text-[10px] md:text-sm text-[#666] tracking-[0.3em] align-top transition-colors group-hover:text-[#333]">NAWLE ↗</span>
                       </h2>
                    </a>
                 </Magnetic>
                 <p className="mt-8 font-light text-sm md:text-base text-[#888] group-hover:text-[#444] max-w-sm transition-colors duration-700 leading-relaxed font-body">
                   "If the mutual fund industry thrives on opacity, we exist to dismantle it. True wealth creation demands absolute, uncompromising clarity."
                 </p>
              </div>
            </div>

            {/* Column B */}
            <div className="border-b md:border-r border-[#222] p-6 sm:p-8 md:p-12 lg:p-16 hover:bg-white hover:text-black transition-colors duration-700 group flex flex-col justify-between min-h-[400px]">
              <div className="flex justify-between items-start">
                <h3 className="font-mono text-[10px] uppercase tracking-widest text-[#666] group-hover:text-[#333] transition-colors">Team</h3>
                <span className="font-display text-4xl text-[#333] group-hover:text-black transition-colors">02</span>
              </div>
              <div className="mt-16">
                 <Magnetic strength={20}>
                    <h2 className="font-display text-5xl md:text-8xl tracking-tighter uppercase inline-block cursor-default">
                       Sachin<span className="ml-2 md:ml-4 font-mono text-[10px] md:text-sm text-[#666] tracking-[0.3em] align-top transition-colors group-hover:text-[#333]">JADHAV</span>
                    </h2>
                 </Magnetic>
                 <p className="mt-8 font-light text-sm md:text-base text-[#888] group-hover:text-[#444] max-w-sm transition-colors duration-700 leading-relaxed font-body">
                   "Complexity is a tax on the uninformed. We built this protocol because if mutual funds won't give you transparency, we will build it ourselves."
                 </p>
              </div>
            </div>
          </div>
        </section>

        {/* Cool New Brutalist Element: Live Ticker / Matrix */}
        <section className="mb-16 md:mb-32">
          <div className="border border-[#222] p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 bg-[#0a0a0a] relative overflow-hidden group">
            {/* SVG Grid Background */}
            <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000" 
                 style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}>
            </div>
            
            <div className="z-10 w-full">
              <div className="flex items-center gap-4 mb-6">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#888]">System Status</span>
              </div>
              <h3 className="font-display text-3xl md:text-5xl text-white tracking-tight mb-4 uppercase">Protocol Integrity: 100%</h3>
              <p className="font-mono text-xs md:text-sm text-[#666] max-w-xl leading-relaxed">
                We continuously monitor and neutralize hidden asset decay. No commissions, no biased recommendations, no compromises. Just raw mathematical truth.
              </p>
            </div>

            <div className="z-10 shrink-0 font-mono text-[10px] md:text-xs text-[#444] text-right flex flex-col gap-2 uppercase tracking-[0.2em] w-full md:w-auto border-t md:border-t-0 md:border-l border-[#222] pt-6 md:pt-0 md:pl-12 mt-6 md:mt-0">
              <p className="flex justify-between gap-12"><span>Ping</span> <span className="text-white">12ms</span></p>
              <p className="flex justify-between gap-12"><span>Drift Tolerance</span> <span className="text-white">0.00%</span></p>
              <p className="flex justify-between gap-12"><span>Commission</span> <span className="text-white">Zero</span></p>
              <p className="flex justify-between gap-12"><span>Clarity</span> <span className="text-white">Absolute</span></p>
            </div>
          </div>
        </section>

        {/* Ethos */}
        <section className="mb-16 md:mb-32 flex flex-col items-center text-center py-20">
            <h2 className="font-display text-4xl md:text-7xl tracking-tighter text-white mb-8">Pure logic. <br />Zero friction.</h2>
            <p className="text-xl md:text-2xl text-[#888] font-light max-w-3xl mx-auto leading-relaxed">
               We don't build products. We build uncompromised protocols to defend capital against the decay of hidden fees and market drift. 
            </p>
        </section>

        {/* CTA */}
        <div className="flex justify-center border-t border-[#222] pt-16 md:pt-24 pb-8 md:pb-12">
          <Magnetic strength={30}>
            <button 
              onClick={() => navigate("/dashboard/fee-audit")}
              className="bg-white text-black font-mono uppercase tracking-[0.1em] sm:tracking-[0.2em] text-[9px] sm:text-[10px] font-bold px-8 sm:px-12 py-5 sm:py-6 hover:bg-[#e0e0e0] transition-colors border border-transparent hover:border-black w-full sm:w-auto"
            >
              [ Execute Portfolio Audit ]
            </button>
          </Magnetic>
        </div>

      </main>
    </div>
  );
};

export default AboutUs;
