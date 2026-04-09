import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Nav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-surface-border">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold text-foreground tracking-tight hover:text-amber transition-colors duration-200">
          Ratio x
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Features", href: "/#features" },
            { label: "How It Works", href: "/learn-drift" },
            { label: "Quantr Screener", href: "https://quantr.vercel.app/" },
            { label: "Pricing", href: "/#pricing" },
            { label: "FAQ", href: "/#faq" },
          ].map(({ label, href }) => (
            href.startsWith("/") ? (
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
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 font-body"
              >
                {label} <span className="opacity-50 text-[10px] ml-0.5">↗</span>
              </a>
            )
          ))}
          {user ? (
            <Link
              to="/dashboard"
              className="text-sm border border-amber text-amber px-4 py-1.5 rounded-sm hover:bg-amber hover:text-background transition-colors duration-200 active:scale-[0.97] font-body"
            >
              Dashboard →
            </Link>
          ) : (
            <Link
              to="/auth"
              className="text-sm border border-amber text-amber px-4 py-1.5 rounded-sm hover:bg-amber hover:text-background transition-colors duration-200 active:scale-[0.97] font-body"
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
        <div className="md:hidden border-t border-surface-border bg-background px-6 py-4 flex flex-col gap-4">
          {[
            { label: "Features", href: "/#features" },
            { label: "How It Works", href: "/learn-drift" },
            { label: "Quantr Screener", href: "https://quantr.vercel.app/" },
            { label: "Pricing", href: "/#pricing" },
            { label: "FAQ", href: "/#faq" },
          ].map(({ label, href }) => (
            href.startsWith("/") ? (
              <Link
                key={label}
                to={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </Link>
            ) : (
              <a
                key={label}
                href={href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body"
                onClick={() => setMobileOpen(false)}
              >
                {label}
              </a>
            )
          ))}
          {user ? (
            <Link
              to="/dashboard"
              className="text-sm border border-amber text-amber px-4 py-2 rounded-sm text-center font-body"
              onClick={() => setMobileOpen(false)}
            >
              Dashboard →
            </Link>
          ) : (
            <Link
              to="/auth"
              className="text-sm border border-amber text-amber px-4 py-2 rounded-sm text-center font-body"
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Nav;
