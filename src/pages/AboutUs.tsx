import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "@/components/Nav";
import Magnetic from "@/components/Magnetic";

/* ─── Floating Particle Canvas ─── */
const ParticleField: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{
    x: number; y: number; vx: number; vy: number;
    size: number; opacity: number; hue: number;
  }>>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const initParticles = useCallback((w: number, h: number) => {
    const count = Math.min(80, Math.floor((w * h) / 15000));
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      hue: Math.random() * 60 + 20, // gold-amber range
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (particlesRef.current.length === 0) initParticles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      particlesRef.current.forEach((p) => {
        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          const force = (150 - dist) / 150;
          p.vx += (dx / dist) * force * 0.3;
          p.vy += (dy / dist) * force * 0.3;
        }

        // Drift based on scroll
        p.vy += (scrollProgress - 0.5) * 0.01;

        // Damping
        p.vx *= 0.98;
        p.vy *= 0.98;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 60%, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(40, 50%, 50%, ${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [scrollProgress, initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-0 pointer-events-none"
    />
  );
};

/* ─── Section Component ─── */
interface NarrativeSectionProps {
  children: React.ReactNode;
  index: number;
  activeIndex: number;
  label: string;
  innerRef: (el: HTMLDivElement | null) => void;
}

const NarrativeSection: React.FC<NarrativeSectionProps> = ({ children, index, activeIndex, label, innerRef }) => {
  const isActive = activeIndex === index;

  return (
    <div
      ref={innerRef}
      data-index={index}
      className="h-screen w-full snap-start snap-always relative flex flex-col items-center justify-center overflow-hidden shrink-0"
    >
      {/* Section Label - Top Left */}
      <div className={`absolute top-28 left-8 md:left-16 flex items-center gap-3 z-30 transition-all duration-[1000ms] ${
        isActive ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
      }`}>
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#555]">
          {label}
        </span>
        <div className="w-8 h-px bg-[#333]" />
      </div>

      {/* Section Content Wrapper with Reveal Animation */}
      <div className={`w-full h-full flex flex-col items-center justify-center transition-all duration-[1000ms] ease-out ${
        isActive ? "opacity-100 scale-100 blur-0 translate-y-0" : "opacity-0 scale-95 blur-[4px] translate-y-8 pointer-events-none"
      }`}>
        {children}
      </div>
    </div>
  );
};

/* ─── Command Line Terminal Mockup ─── */
const TerminalMockup: React.FC = () => {
  const [lines, setLines] = useState<string[]>([]);
  
  useEffect(() => {
    const logs = [
      "sys.init(): Establishing secure connection...",
      "db.connect(): Querying AMC database...",
      "audit.start(): Analyzing distributor commission structures...",
      "warning: Found hidden 1.5% TER commission kickback in scheme AX12",
      "calc.compound(): Estimating wealth decay over 25 years...",
      "decay.output(): ₹14,23,500 direct capital loss to distributor commissions.",
      "drift.check(): Tracking portfolio asset allocation drift...",
      "drift.warning(): Gold allocation drifted +8.5% above target.",
      "audit.complete(): Integrity verification 100% complete.",
      "rebalance.suggest(): Generate tax-optimized rebalance protocol..."
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      setLines((prev) => [...prev.slice(-5), logs[i]]);
      i = (i + 1) % logs.length;
    }, 2500);
    
    // Initialize with first few
    setLines(logs.slice(0, 3));
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-sm sm:max-w-md bg-[#020203] border border-[#1a1a1f] rounded-lg p-5 font-mono text-[10px] sm:text-[11px] text-[#888] shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-8 bg-[#09090b] border-b border-[#1a1a1f] px-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          <div className="w-2 h-2 rounded-full bg-drift-red/40" />
          <div className="w-2 h-2 rounded-full bg-amber/40" />
          <div className="w-2 h-2 rounded-full bg-drift-green/40" />
        </div>
        <span className="text-[9px] uppercase tracking-widest text-[#444]">Integrity-Shell v1.0</span>
      </div>
      <div className="mt-6 space-y-2 min-h-[140px] text-left leading-relaxed">
        {lines.map((line, idx) => {
          let colorClass = "text-[#777]";
          if (line.includes("warning:")) colorClass = "text-amber";
          else if (line.includes("decay")) colorClass = "text-drift-red";
          else if (line.includes("complete")) colorClass = "text-drift-green";
          
          return (
            <div key={idx} className={colorClass}>
              <span className="text-[#333] mr-2">&gt;</span>{line}
            </div>
          );
        })}
        <div className="animate-pulse inline-block w-1.5 h-3 bg-amber ml-1 align-middle" />
      </div>
    </div>
  );
};

/* ─── Wealth Decay Projection Chart ─── */
const WealthDrainChart: React.FC = () => {
  return (
    <div className="w-full max-w-sm sm:max-w-md bg-[#020203] border border-[#1a1a1f] rounded-lg p-6 font-mono text-[10px] sm:text-[11px] text-[#888] shadow-2xl relative">
      <div className="text-left mb-6">
        <span className="text-[9px] text-[#444] uppercase tracking-widest block mb-1">PROJECTION // 30-YEAR DECAY</span>
        <h4 className="text-xs sm:text-sm font-semibold text-white">Impact of 1.5% Annual Hidden Fees</h4>
      </div>

      <div className="space-y-5">
        {/* Direct Portfolios */}
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-drift-green">Direct Fund (Zero Fee)</span>
            <span className="text-white font-semibold">₹10,00,000</span>
          </div>
          <div className="w-full h-3 bg-[#0d0d12] rounded-full overflow-hidden border border-[#1c1c24]">
            <div className="h-full bg-gradient-to-r from-drift-green/60 to-drift-green w-full transition-all duration-1000" />
          </div>
        </div>

        {/* Regular Portfolios */}
        <div>
          <div className="flex justify-between text-xs mb-2">
            <span className="text-amber">Regular Fund (1.5% Fee)</span>
            <span className="text-white font-semibold">₹6,80,000</span>
          </div>
          <div className="w-full h-3 bg-[#0d0d12] rounded-full overflow-hidden border border-[#1c1c24]">
            <div className="h-full bg-gradient-to-r from-amber/60 to-amber w-[68%] transition-all duration-1000" />
          </div>
        </div>

        {/* Wealth Drain */}
        <div className="border-t border-[#1a1a1f] pt-4 mt-2 flex justify-between items-center">
          <span className="text-drift-red uppercase tracking-wider text-[9px]">Distributor Commission Drain:</span>
          <span className="text-drift-red font-bold text-xs bg-drift-red/10 px-2.5 py-1 rounded">
            - ₹3,20,000 (32%)
          </span>
        </div>
      </div>

      <p className="text-[9px] text-[#555] leading-normal text-left mt-5">
        *Calculated assuming 12% CAGR initial ₹1L investment compounded annually. 1.5% difference represents distributor commission kickbacks.
      </p>
    </div>
  );
};

/* ─── Main Component ─── */
const AboutUs: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const totalSections = 5;

  const setSectionRef = useCallback((el: HTMLDivElement | null, index: number) => {
    sectionRefs.current[index] = el;
  }, []);

  // IntersectionObserver to sync active section indicator with scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!isNaN(index)) {
              setActiveSection(index);
            }
          }
        });
      },
      {
        root: containerRef.current,
        threshold: 0.5,
      }
    );

    sectionRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    setScrollProgress(activeSection / (totalSections - 1));
  }, [activeSection]);

  const sectionLabels = [
    "00 // Origin",
    "01 // Problem",
    "02 // Mission",
    "03 // Promise",
    "04 // Architects",
  ];

  return (
    <div className="bg-[#050508] text-[#e0e0e0] font-body selection:bg-amber selection:text-black min-h-screen relative overflow-hidden">
      <Nav />

      {/* Background Particle Field - Fixed */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <ParticleField scrollProgress={scrollProgress} />
      </div>

      {/* Subtle radial gradient that shifts with sections - Fixed */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-[2000ms]"
        style={{
          background: `radial-gradient(ellipse at ${50 + activeSection * 5}% ${40 + activeSection * 8}%, hsla(${30 + activeSection * 20}, 60%, 15%, 0.15) 0%, transparent 60%)`,
        }}
      />

      {/* Noise texture - Fixed */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.025]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

      {/* Full viewport scrolling container with snapping */}
      <div 
        ref={containerRef}
        id="about-scroll-container"
        className="h-screen w-full overflow-y-scroll snap-y snap-mandatory scroll-smooth relative z-10"
      >
        {/* ─── SECTION 0: THE HOOK ─── */}
        <NarrativeSection index={0} activeIndex={activeSection} label={sectionLabels[0]} innerRef={(el) => setSectionRef(el, 0)}>
          <div className="grid md:grid-cols-12 gap-8 md:gap-16 items-center w-full max-w-6xl px-6 md:px-12 z-20">
            <div className="md:col-span-7 text-left">
              <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-amber/60 mb-6">
                [ Scroll to Explore ]
              </p>
              <h1 className="font-display text-5xl sm:text-7xl md:text-8xl tracking-tighter leading-[0.9] text-white lowercase mb-6">
                ratio <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-amber">x</span>
              </h1>
              <p className="text-lg md:text-xl text-[#888] font-light leading-relaxed max-w-lg">
                An intelligence engine built to expose what the financial industry hides from you.
              </p>
            </div>
            <div className="md:col-span-5 flex justify-center w-full">
              <TerminalMockup />
            </div>
          </div>
        </NarrativeSection>

        {/* ─── SECTION 1: THE PROBLEM ─── */}
        <NarrativeSection index={1} activeIndex={activeSection} label={sectionLabels[1]} innerRef={(el) => setSectionRef(el, 1)}>
          <div className="grid md:grid-cols-12 gap-8 md:gap-16 items-center w-full max-w-6xl px-6 md:px-12 z-20">
            <div className="md:col-span-7 text-left">
              <h2 className="font-display text-4xl md:text-6xl tracking-tighter text-white mb-6 leading-tight">
                Hidden commissions.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#666] to-[#aaa]">Silent wealth drain.</span>
              </h2>
              <p className="text-base md:text-lg text-[#888] font-light leading-relaxed max-w-xl">
                The mutual fund industry was engineered for opacity. Layers of TER, exit loads, and distributor commissions silently erode your returns — year after year, compounding against you.
              </p>
            </div>
            <div className="md:col-span-5 flex justify-center w-full">
              <WealthDrainChart />
            </div>
          </div>
        </NarrativeSection>

        {/* ─── SECTION 2: THE MISSION ─── */}
        <NarrativeSection index={2} activeIndex={activeSection} label={sectionLabels[2]} innerRef={(el) => setSectionRef(el, 2)}>
          <div className="text-center px-6 z-20 max-w-5xl relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-amber/10 blur-[80px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '6s' }} />

            <div className="relative z-10">
              <h2 className="font-display text-6xl md:text-[10rem] tracking-tighter lowercase leading-[0.85] mb-8">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber/80 to-[#555]">
                  we build
                </span>
                <br />
                <span className="text-white">clarity.</span>
              </h2>
              <p className="text-lg md:text-xl text-[#888] font-light max-w-xl mx-auto leading-relaxed mt-4">
                In a world that profits off your confusion, we exist to deliver pure, mathematical truth. No bias, no commissions.
              </p>
            </div>
          </div>
        </NarrativeSection>

        {/* ─── SECTION 3: THE PROMISE ─── */}
        <NarrativeSection index={3} activeIndex={activeSection} label={sectionLabels[3]} innerRef={(el) => setSectionRef(el, 3)}>
          <div className="w-full max-w-5xl mx-auto px-6 md:px-12 z-20 text-center">
            <div className="inline-block mb-8 px-6 py-2 border border-drift-green/25 bg-drift-green/5 text-drift-green font-mono text-[10px] uppercase tracking-[0.3em] rounded-full">
              Public Utility Protocol
            </div>
            
            <h2 className="font-display text-3xl md:text-5xl text-white tracking-tight mb-10">Our Commitments.</h2>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-[#08080c]/50 border border-[#1a1a1f] p-8 text-left hover:border-amber/30 transition-colors duration-500 rounded">
                <div className="font-mono text-[10px] text-amber uppercase tracking-widest mb-4">01 // Zero Subscription</div>
                <h3 className="text-lg text-white font-semibold mb-2">No Subscription Fees</h3>
                <p className="text-sm text-[#777] leading-relaxed">
                  Ratio X is free forever. Every fee audit, asset decay simulation, and rebalance audit is completely open to the public.
                </p>
              </div>

              <div className="bg-[#08080c]/50 border border-[#1a1a1f] p-8 text-left hover:border-amber/30 transition-colors duration-500 rounded">
                <div className="font-mono text-[10px] text-amber uppercase tracking-widest mb-4">02 // Zero Distribution Bias</div>
                <h3 className="text-lg text-white font-semibold mb-2">No Commission Kickbacks</h3>
                <p className="text-sm text-[#777] leading-relaxed">
                  We do not act as a broker. We refuse kickbacks from mutual fund companies, ensuring our recommendations are 100% mathematically unbiased.
                </p>
              </div>

              <div className="bg-[#08080c]/50 border border-[#1a1a1f] p-8 text-left hover:border-amber/30 transition-colors duration-500 rounded">
                <div className="font-mono text-[10px] text-amber uppercase tracking-widest mb-4">03 // Zero Premium Tier</div>
                <h3 className="text-lg text-white font-semibold mb-2">No Premium Locks</h3>
                <p className="text-sm text-[#777] leading-relaxed">
                  We do not gatekeep advanced tools. The complete auditing, tracking, and tax harvesting intelligence is fully accessible from day one.
                </p>
              </div>
            </div>

            <Magnetic strength={20}>
              <button
                onClick={() => navigate("/dashboard/fee-audit")}
                className="group relative bg-transparent border border-[#333] text-white font-mono uppercase tracking-[0.2em] text-xs px-10 py-5 overflow-hidden transition-all duration-500 hover:border-amber/50 rounded"
              >
                <div className="absolute inset-0 bg-amber transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0" />
                <span className="relative z-10 group-hover:text-black transition-colors duration-300">
                  [ Run Free Audit ]
                </span>
              </button>
            </Magnetic>
          </div>
        </NarrativeSection>

        {/* ─── SECTION 4: THE ARCHITECTS ─── */}
        <NarrativeSection index={4} activeIndex={activeSection} label={sectionLabels[4]} innerRef={(el) => setSectionRef(el, 4)}>
          <div className="w-full max-w-5xl mx-auto px-6 md:px-12 z-20">
            <div className="border-b border-[#222] pb-6 mb-8 md:mb-12 flex justify-between items-end">
              <h2 className="font-display text-3xl md:text-5xl text-white tracking-tight">The Architects.</h2>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#666]">Task Force</span>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Founder 1 */}
              <a
                href="https://portfolio-eight-umber-fian7abm8o.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#08080c]/60 border border-[#1a1a1f] p-8 md:p-12 hover:border-amber/50 transition-colors duration-500 rounded relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber/5 blur-2xl group-hover:bg-amber/10 transition-colors pointer-events-none" />

                <div className="flex justify-between items-start mb-8">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#555] group-hover:text-amber transition-colors">
                    01 // Engine
                  </div>
                  <div className="font-mono text-[9px] uppercase bg-amber/10 text-amber px-2.5 py-1 rounded">
                    Core architecture
                  </div>
                </div>
                
                <h3 className="font-display text-3xl md:text-5xl tracking-tighter uppercase text-white mb-4">
                  Aditya{" "}
                  <span className="text-[#555] font-mono text-sm tracking-[0.2em] ml-2 align-middle">
                    NAWLE ↗
                  </span>
                </h3>
                <div className="w-8 group-hover:w-full h-px bg-amber/30 transition-all duration-700 mb-6" />
                <p className="font-light text-sm text-[#888] leading-relaxed mb-6 font-body">
                  "If the mutual fund industry thrives on opacity, we exist to dismantle it. True wealth creation demands absolute, uncompromising clarity."
                </p>
                
                <div className="grid grid-cols-2 gap-4 border-t border-[#1a1a1f] pt-6 font-mono text-[10px] text-[#555]">
                  <div>
                    <span className="block text-[#444] uppercase">Focus</span>
                    <span className="text-[#999]">Algorithms & Audit</span>
                  </div>
                  <div>
                    <span className="block text-[#444] uppercase">Git Commits</span>
                    <span className="text-[#999]">500+</span>
                  </div>
                </div>
              </a>

              {/* Founder 2 */}
              <div className="bg-[#08080c]/60 border border-[#1a1a1f] p-8 md:p-12 hover:border-amber/50 transition-colors duration-500 rounded relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-amber/5 blur-2xl group-hover:bg-amber/10 transition-colors pointer-events-none" />

                <div className="flex justify-between items-start mb-8">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#555] group-hover:text-amber transition-colors">
                    02 // Systems
                  </div>
                  <div className="font-mono text-[9px] uppercase bg-amber/10 text-amber px-2.5 py-1 rounded">
                    Infrastructure
                  </div>
                </div>
                
                <h3 className="font-display text-3xl md:text-5xl tracking-tighter uppercase text-white mb-4">
                  Sachin{" "}
                  <span className="text-[#555] font-mono text-sm tracking-[0.2em] ml-2 align-middle">
                    JADHAV
                  </span>
                </h3>
                <div className="w-8 group-hover:w-full h-px bg-amber/30 transition-all duration-700 mb-6" />
                <p className="font-light text-sm text-[#888] leading-relaxed mb-6 font-body">
                  "Complexity is a tax on the uninformed. We built this protocol because if mutual funds won't give you transparency, we will build it ourselves."
                </p>
                
                <div className="grid grid-cols-2 gap-4 border-t border-[#1a1a1f] pt-6 font-mono text-[10px] text-[#555]">
                  <div>
                    <span className="block text-[#444] uppercase">Focus</span>
                    <span className="text-[#999]">Frontend & Systems</span>
                  </div>
                  <div>
                    <span className="block text-[#444] uppercase">Integrations</span>
                    <span className="text-[#999]">Zerodha, Upstox, Groww</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={() => {
                  const container = document.getElementById("about-scroll-container");
                  if (container) {
                    container.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#555] hover:text-white transition-colors p-4 animate-pulse"
              >
                [ ↑ Back to Top ]
              </button>
            </div>
          </div>
        </NarrativeSection>
      </div>

      {/* ─── Progress Indicator (Right Edge) ─── */}
      <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-5">
        {Array.from({ length: totalSections }).map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const sectionEl = sectionRefs.current[i];
              if (sectionEl) {
                sectionEl.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="group relative flex items-center justify-end"
          >
            <span className={`absolute right-6 font-mono text-[9px] uppercase tracking-widest transition-all duration-300 ${
              i === activeSection 
                ? "opacity-100 translate-x-0 text-white" 
                : "opacity-0 translate-x-2 group-hover:opacity-60 group-hover:translate-x-0 text-[#888]"
            }`}>
              {sectionLabels[i].split("//")[1]?.trim() || sectionLabels[i]}
            </span>

            <div
              className={`w-[4px] transition-all duration-500 rounded-full ${
                i === activeSection
                  ? "h-8 bg-amber shadow-[0_0_10px_rgba(232,147,16,0.5)]"
                  : "h-3 bg-[#222] group-hover:bg-[#555]"
              }`}
            />
          </button>
        ))}
      </div>

      {/* ─── Bottom Bar ─── */}
      <div className="absolute bottom-8 left-8 right-8 md:bottom-10 md:left-16 md:right-16 z-50 flex items-center justify-between pointer-events-none">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#444]">
          {sectionLabels[activeSection]}
        </span>
        <span className="font-mono text-[10px] text-[#444]">
          {String(activeSection + 1).padStart(2, "0")} / {String(totalSections).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
};

export default AboutUs;
