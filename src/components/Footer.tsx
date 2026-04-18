import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="border-t border-surface-border">
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
        {/* Left */}
        <div>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-lg font-bold text-foreground">Ratio x</span>
            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground mt-0.5">By Quantr</span>
          </div>
          <p className="text-xs text-muted-foreground font-body mt-1">Portfolio tracking & drift analysis.</p>
        </div>

        {/* Links grid */}
        <div className="flex flex-col sm:flex-row gap-12 sm:gap-24 text-xs font-body">
          <div className="flex flex-col gap-4">
            <span className="text-foreground font-semibold uppercase tracking-widest text-[10px]">Product</span>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors duration-200">Features</a>
            <a href="/learn-drift" className="text-muted-foreground hover:text-foreground transition-colors duration-200">How It Works</a>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-foreground font-semibold uppercase tracking-widest text-[10px]">Ecosystem</span>
            <a href="https://quantr.vercel.app/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center gap-1.5">
              <span>Quantr Terminal</span>
              <span className="text-[10px] opacity-50">↗</span>
            </a>
          </div>

          <div className="flex flex-col gap-4">
            <span className="text-foreground font-semibold uppercase tracking-widest text-[10px]">Legal</span>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors duration-200">Privacy Policy</Link>
            <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors duration-200">Terms of Service</Link>
          </div>
        </div>

        {/* Social */}
        <div className="flex gap-4">
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200" aria-label="Twitter">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href="#" className="text-muted-foreground hover:text-foreground transition-colors duration-200" aria-label="LinkedIn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </a>
        </div>
      </div>

      {/* SEBI Disclaimer & Copyright */}
      <div className="border-t border-surface-border mt-8 pt-6 space-y-3">
        <p className="text-[10px] text-muted-foreground/50 font-body leading-relaxed max-w-4xl">
          Ratio x is not a SEBI-registered Investment Adviser (IA), Research Analyst (RA), or Portfolio Manager. 
          The platform is an educational portfolio tracking tool and does not provide investment, trading, or tax advice. 
          All information is for informational purposes only. Users should consult qualified professionals before making financial decisions.
        </p>
        <p className="text-xs text-muted-foreground font-body">© {new Date().getFullYear()} Ratio x. An educational portfolio tracking tool.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
