import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { MAIN_NAVIGATION } from "@/config/navigation";
import Logo from "./Logo";

const Nav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="group">
          <Logo size={28} className="group-hover:opacity-80 transition-opacity duration-300" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {MAIN_NAVIGATION.map(({ label, href }) => (
            href.startsWith("/#") ? (
              <a
                key={label}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 font-body"
              >
                {label}
              </a>
            ) : href.startsWith("/") ? (
              <Link
                key={label}
                to={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 font-body"
              >
                {label}
              </Link>
            ) : (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 font-body flex items-center gap-1"
              >
                {label} <span className="opacity-50 text-[10px]">↗</span>
              </a>
            )
          ))}
          {user ? (
            <Link
              to="/dashboard/fee-audit"
              className="text-sm font-body font-semibold border border-amber/50 text-amber px-5 py-2.5 rounded-sm hover:bg-amber hover:text-background transition-all duration-300 active:scale-[0.98]"
            >
              Fee Audit →
            </Link>
          ) : (
            <Link
              to="/auth"
              className="text-sm font-body font-semibold border border-amber/50 text-amber px-5 py-2.5 rounded-sm hover:bg-amber hover:text-background transition-all duration-300 active:scale-[0.98]"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
            {mobileOpen ? (
              <path d="M4 4l12 12M16 4L4 16" />
            ) : (
              <path d="M3 5h14M3 10h14M3 15h14" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-surface-border bg-background/95 backdrop-blur-xl px-6 py-6 flex flex-col gap-6">
          {MAIN_NAVIGATION.map(({ label, href }) => (
            href.startsWith("/#") ? (
              <a
                key={label}
                href={href}
                className="text-base text-muted-foreground hover:text-foreground transition-colors font-body"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </a>
            ) : href.startsWith("/") ? (
              <Link
                key={label}
                to={href}
                className="text-base text-muted-foreground hover:text-foreground transition-colors font-body"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ) : (
              <a
                key={label}
                href={href}
                className="text-base text-muted-foreground hover:text-foreground transition-colors font-body flex items-center gap-1"
                onClick={() => setMobileOpen(false)}
              >
                {label} <span className="opacity-50 text-[10px]">↗</span>
              </a>
            )
          ))}
          <div className="pt-4 border-t border-surface-border">
            {user ? (
              <Link
                to="/dashboard"
                className="block w-full text-sm font-body font-semibold border border-amber/50 text-amber px-5 py-3 rounded-sm text-center hover:bg-amber hover:text-background transition-all duration-300"
                onClick={() => setMobileOpen(false)}
              >
                Dashboard →
              </Link>
            ) : (
              <Link
                to="/auth"
                className="block w-full text-sm font-body font-semibold border border-amber/50 text-amber px-5 py-3 rounded-sm text-center hover:bg-amber hover:text-background transition-all duration-300"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
