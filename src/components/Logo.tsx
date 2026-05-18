/**
 * Ratio x Logomark — A stylized geometric ratio/division symbol
 * that forms an abstract "X" with intersecting lines.
 */
const Logo = ({ size = 32, className = "" }: { size?: number; className?: string }) => (
  <div className={`flex items-center gap-2.5 ${className}`}>
    {/* Geometric Logomark */}
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      {/* Outer square frame with clipped corner */}
      <rect x="2" y="2" width="36" height="36" rx="4" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      
      {/* The X formed by two crossing lines */}
      <line x1="10" y1="10" x2="30" y2="30" stroke="url(#logoGradient)" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="30" y1="10" x2="10" y2="30" stroke="url(#logoGradient)" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Ratio dots (÷ symbol integrated) */}
      <circle cx="20" cy="10" r="3" fill="url(#logoGradient)" />
      <circle cx="20" cy="30" r="3" fill="url(#logoGradient)" />
      
      {/* Center diamond accent */}
      <rect x="17" y="17" width="6" height="6" rx="1" fill="currentColor" opacity="0.15" transform="rotate(45 20 20)" />
      
      <defs>
        <linearGradient id="logoGradient" x1="10" y1="10" x2="30" y2="30">
          <stop stopColor="#E8890C" />
          <stop offset="1" stopColor="#D4A574" />
        </linearGradient>
      </defs>
    </svg>
    
    {/* Wordmark */}
    <div className="flex flex-col leading-none">
      <span className="font-display text-xl font-bold tracking-tight text-foreground">
        Ratio<span className="text-amber ml-0.5">x</span>
      </span>
    </div>
  </div>
);

export default Logo;
