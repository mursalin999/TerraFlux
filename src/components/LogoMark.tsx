export function LogoMark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      {/* Thin circle (Earth) */}
      <circle
        cx="14"
        cy="14"
        r="9"
        stroke="rgba(145, 160, 181, 0.45)"
        strokeWidth="1"
        fill="none"
      />
      {/* Small terrestrial core glow */}
      <circle cx="14" cy="14" r="2.5" fill="#F4F7FA" opacity="0.9" />

      {/* Orbit Arc 1: MODIS (--data-blue) */}
      <path
        d="M 4.5 18 C 7 7.5, 21 8, 23.5 17.5"
        stroke="#4DA3FF"
        strokeWidth="1.5"
        strokeDasharray="2.5 1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Orbit Arc 2: VIIRS (--thermal-orange), offset */}
      <path
        d="M 5.5 10.5 C 9 20.5, 21 19.5, 22.5 8"
        stroke="#FF6A2A"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Meeting point: small --agreement-teal dot */}
      <circle cx="21.5" cy="9.2" r="1.6" fill="#56D6C9" />
    </svg>
  );
}

export function LogoWithWordmark({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <LogoMark className="h-8 w-8 shrink-0" />
      <div className="flex flex-col">
        <span className="font-headline text-base font-bold tracking-[0.25em] text-text">
          TERRAFLUX
        </span>
        <span className="font-mono text-[9px] tracking-[0.18em] text-text-secondary">
          EARTH OBSERVATION / FIRE ACTIVITY
        </span>
      </div>
    </div>
  );
}
