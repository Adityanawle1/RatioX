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
}

const NarrativeSection: React.FC<NarrativeSectionProps> = ({ children, index, activeIndex, label }) => {
  const isActive = activeIndex === index;
  const isPast = activeIndex > index;
  const isFuture = activeIndex < index;

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        opacity: isActive ? 1 : 0,
        transform: isPast
          ? "translateY(-15vh) scale(0.92)"
          : isFuture
          ? "translateY(15vh) scale(0.92)"
          : "translateY(0) scale(1)",
        pointerEvents: isActive ? "auto" : "none",
        filter: isActive ? "blur(0px)" : "blur(6px)",
      }}
    >
      {/* Section Label - Top Left */}
      <div className="absolute top-28 left-8 md:left-16 flex items-center gap-3 z-30">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#555]">
          {label}
        </span>
        <div className="w-8 h-px bg-[#333]" />
      </div>
      {children}
    </div>
  );
};

/* ─── Main Component ─── */
const AboutUs: React.FC = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lastScrollTime = useRef(Date.now());
  const accumulatedDelta = useRef(0);

  const totalSections = 5;

  // Wheel-based section snapping (like Active Theory's drag-to-scroll)
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      const now = Date.now();
      if (isTransitioning) return;

      // Accumulate delta for trackpad support
      accumulatedDelta.current += e.deltaY;

      // Reset accumulator if direction changed or too much time passed
      if (now - lastScrollTime.current > 300) {
        accumulatedDelta.current = e.deltaY;
      }
      lastScrollTime.current = now;

      const threshold = 80;

      if (Math.abs(accumulatedDelta.current) > threshold) {
        if (accumulatedDelta.current > 0 && activeSection < totalSections - 1) {
          setIsTransitioning(true);
          setActiveSection((prev) => prev + 1);
          setTimeout(() => setIsTransitioning(false), 1200);
        } else if (accumulatedDelta.current < 0 && activeSection > 0) {
          setIsTransitioning(true);
          setActiveSection((prev) => prev - 1);
          setTimeout(() => setIsTransitioning(false), 1200);
        }
        accumulatedDelta.current = 0;
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [activeSection, isTransitioning]);

  // Touch support for mobile
  useEffect(() => {
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      if (isTransitioning) return;
      const delta = touchStartY - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 50) {
        if (delta > 0 && activeSection < totalSections - 1) {
          setIsTransitioning(true);
          setActiveSection((prev) => prev + 1);
          setTimeout(() => setIsTransitioning(false), 1200);
        } else if (delta < 0 && activeSection > 0) {
          setIsTransitioning(true);
          setActiveSection((prev) => prev - 1);
          setTimeout(() => setIsTransitioning(false), 1200);
        }
      }
    };
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [activeSection, isTransitioning]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      if (e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        if (activeSection < totalSections - 1) {
          setIsTransitioning(true);
          setActiveSection((prev) => prev + 1);
          setTimeout(() => setIsTransitioning(false), 1200);
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (activeSection > 0) {
          setIsTransitioning(true);
          setActiveSection((prev) => prev - 1);
          setTimeout(() => setIsTransitioning(false), 1200);
        }
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeSection, isTransitioning]);

  // Update scroll progress
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
    <div className="bg-[#050508] text-[#e0e0e0] font-body selection:bg-amber selection:text-black overflow-hidden">
      <Nav />

      {/* Full viewport container */}
      <div className="fixed inset-0 w-full h-screen overflow-hidden">

        {/* Particle Field */}
        <ParticleField scrollProgress={scrollProgress} />

        {/* Subtle radial gradient that shifts with sections */}
        <div
          className="absolute inset-0 pointer-events-none z-0 transition-all duration-[2000ms]"
          style={{
            background: `radial-gradient(ellipse at ${50 + activeSection * 5}% ${40 + activeSection * 8}%, hsla(${30 + activeSection * 20}, 60%, 15%, 0.15) 0%, transparent 60%)`,
          }}
        />

        {/* Noise texture */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.025]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

        {/* ─── SECTION 0: THE HOOK ─── */}
        <NarrativeSection index={0} activeIndex={activeSection} label={sectionLabels[0]}>
          <div className="text-center px-6 z-20 max-w-5xl">
            <p className="font-mono text-[10px] md:text-xs uppercase tracking-[0.4em] text-amber/60 mb-8">
              → Scroll Down
            </p>
            <h1 className="font-display text-5xl sm:text-7xl md:text-[8rem] tracking-tighter leading-[0.85] text-white lowercase mb-10">
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-[#555]">
                ratio x
              </span>
            </h1>
            <p className="text-lg md:text-2xl text-[#777] font-light max-w-2xl mx-auto leading-relaxed">
              An intelligence engine built to expose what the financial industry hides from you.
            </p>
          </div>
        </NarrativeSection>

        {/* ─── SECTION 1: THE PROBLEM ─── */}
        <NarrativeSection index={1} activeIndex={activeSection} label={sectionLabels[1]}>
          <div className="text-center px-6 z-20 max-w-5xl">
            <h2 className="font-display text-4xl md:text-7xl tracking-tighter text-white mb-8 leading-tight">
              Hidden commissions.<br />
              <span className="text-[#555]">Silent wealth drain.</span>
            </h2>
            <p className="text-lg md:text-2xl text-[#888] font-light max-w-3xl mx-auto leading-relaxed">
              The mutual fund industry was engineered for opacity. Layers of TER, exit loads, and distributor commissions silently erode your returns — year after year, compounding against you.
            </p>
          </div>
        </NarrativeSection>

        {/* ─── SECTION 2: THE MISSION ─── */}
        <NarrativeSection index={2} activeIndex={activeSection} label={sectionLabels[2]}>
          <div className="text-center px-6 z-20 max-w-5xl">
            <h2 className="font-display text-6xl md:text-[10rem] tracking-tighter lowercase leading-[0.85] mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber/80 to-[#555]">
                we build
              </span>
              <br />
              <span className="text-white">clarity.</span>
            </h2>
          </div>
        </NarrativeSection>

        {/* ─── SECTION 3: THE PROMISE ─── */}
        <NarrativeSection index={3} activeIndex={activeSection} label={sectionLabels[3]}>
          <div className="text-center px-6 z-20 max-w-4xl">
            <div className="inline-block mb-10 px-6 py-2.5 border border-drift-green/25 bg-drift-green/5 text-drift-green font-mono text-xs uppercase tracking-[0.3em] rounded-full">
              Free forever
            </div>
            <h2 className="font-display text-4xl md:text-7xl tracking-tighter text-white mb-10 leading-tight">
              We never asked for<br />a single penny.
            </h2>
            <p className="text-lg md:text-xl text-[#999] font-light max-w-3xl mx-auto leading-relaxed mb-14">
              No subscriptions. No commissions. No "premium" tier. Ratio x is a public utility for your portfolio — every fee audit, every drift analysis, every rebalancing recommendation, completely free.
            </p>
            <Magnetic strength={20}>
              <button
                onClick={() => navigate("/dashboard/fee-audit")}
                className="group relative bg-transparent border border-[#333] text-white font-mono uppercase tracking-[0.2em] text-xs px-10 py-5 overflow-hidden transition-all duration-500 hover:border-amber/50"
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
        <NarrativeSection index={4} activeIndex={activeSection} label={sectionLabels[4]}>
          <div className="w-full max-w-6xl mx-auto px-6 md:px-12 z-20">
            <div className="border-b border-[#222] pb-6 mb-8 md:mb-12 flex justify-between items-end">
              <h2 className="font-display text-3xl md:text-5xl text-white tracking-tight">The Architects.</h2>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#666]">Task Force</span>
            </div>

            <div className="grid md:grid-cols-2 gap-px bg-[#1a1a1a]">
              {/* Founder 1 */}
              <a
                href="https://portfolio-eight-umber-fian7abm8o.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-[#050508] p-8 md:p-14 hover:bg-white transition-colors duration-700 group"
              >
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#555] group-hover:text-[#333] transition-colors mb-10">
                  01 // Engine
                </div>
                <h3 className="font-display text-4xl md:text-6xl tracking-tighter uppercase text-white group-hover:text-black transition-colors mb-6">
                  Aditya{" "}
                  <span className="text-[#555] group-hover:text-[#888] font-mono text-sm tracking-[0.2em] ml-2 align-middle transition-colors">
                    NAWLE ↗
                  </span>
                </h3>
                <div className="w-0 group-hover:w-full h-px bg-black transition-all duration-700 mb-6" />
                <p className="font-light text-sm md:text-base text-[#888] group-hover:text-[#444] transition-colors leading-relaxed font-body">
                  "If the mutual fund industry thrives on opacity, we exist to dismantle it. True wealth creation demands absolute, uncompromising clarity."
                </p>
              </a>

              {/* Founder 2 */}
              <div className="bg-[#050508] p-8 md:p-14 hover:bg-white transition-colors duration-700 group">
                <div className="font-mono text-[10px] uppercase tracking-widest text-[#555] group-hover:text-[#333] transition-colors mb-10">
                  02 // Systems
                </div>
                <h3 className="font-display text-4xl md:text-6xl tracking-tighter uppercase text-white group-hover:text-black transition-colors mb-6">
                  Sachin{" "}
                  <span className="text-[#555] group-hover:text-[#888] font-mono text-sm tracking-[0.2em] ml-2 align-middle transition-colors">
                    JADHAV
                  </span>
                </h3>
                <div className="w-0 group-hover:w-full h-px bg-black transition-all duration-700 mb-6" />
                <p className="font-light text-sm md:text-base text-[#888] group-hover:text-[#444] transition-colors leading-relaxed font-body">
                  "Complexity is a tax on the uninformed. We built this protocol because if mutual funds won't give you transparency, we will build it ourselves."
                </p>
              </div>
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={() => {
                  setIsTransitioning(true);
                  setActiveSection(0);
                  setTimeout(() => setIsTransitioning(false), 1200);
                }}
                className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#555] hover:text-white transition-colors p-4"
              >
                [ ↑ Back to Top ]
              </button>
            </div>
          </div>
        </NarrativeSection>

        {/* ─── Progress Indicator (Right Edge) ─── */}
        <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-3">
          {Array.from({ length: totalSections }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (isTransitioning) return;
                setIsTransitioning(true);
                setActiveSection(i);
                setTimeout(() => setIsTransitioning(false), 1200);
              }}
              className="group relative flex items-center"
              title={sectionLabels[i]}
            >
              <div
                className={`w-[3px] transition-all duration-700 rounded-full ${
                  i === activeSection
                    ? "h-8 bg-white"
                    : "h-3 bg-[#333] group-hover:bg-[#666]"
                }`}
              />
            </button>
          ))}
        </div>

        {/* ─── Bottom Bar ─── */}
        <div className="absolute bottom-8 left-8 right-8 md:bottom-10 md:left-16 md:right-16 z-50 flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#444]">
            {sectionLabels[activeSection]}
          </span>
          <span className="font-mono text-[10px] text-[#444]">
            {String(activeSection + 1).padStart(2, "0")} / {String(totalSections).padStart(2, "0")}
          </span>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;
