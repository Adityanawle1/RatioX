import { useScrollReveal } from "./useScrollReveal";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";

const EarlyAccess = () => {
  const { ref, visible } = useScrollReveal(0.15);
  const { user } = useAuth();
  const ctaHref = user ? "/dashboard/fee-audit" : "/signup";

  return (
    <section id="early-access" className="py-24 md:py-32 border-t border-surface-border bg-background relative overflow-hidden" ref={ref}>
      {/* Background grid lines for terminal feel */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div
          className={`flex flex-col items-center justify-center p-12 lg:p-20 border border-surface-border bg-surface/20 backdrop-blur-md transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="w-16 h-1 bg-amber mb-12"></div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light text-foreground text-center mb-6 tracking-tight leading-[1.1]">
            Stop overpaying. <br/>
            <span className="text-muted-foreground">Start auditing.</span>
          </h2>
          
          <p className="font-body text-sm text-muted-foreground text-center mb-12 max-w-lg leading-relaxed">
            No credit card required. See your mutual fund's real cost in under 5 minutes. Free forever.
          </p>

          <Link
            to={ctaHref}
            className="group relative overflow-hidden bg-foreground text-background font-body text-sm font-semibold px-10 py-5 transition-colors duration-300 border border-transparent hover:border-amber w-full sm:w-auto text-center"
          >
            <div className="absolute inset-0 bg-amber transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out z-0"></div>
            <span className="relative z-10 group-hover:text-background flex items-center justify-center gap-3">
              {user ? "Go to Dashboard" : "Audit My Funds Free"}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" className="transform group-hover:translate-x-1 transition-transform">
                <path d="M6 12l4-4-4-4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Link>
          
        </div>
      </div>
    </section>
  );
};

export default EarlyAccess;
