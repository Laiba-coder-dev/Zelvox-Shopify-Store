import Link from "next/link";

type Props = { className?: string; markOnly?: boolean; name?: string };

/** Brand mark: navy tile with a globe and a green ascending route arrow. */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <rect width="40" height="40" rx="10" fill="#0b2545" />
      <circle cx="19" cy="21" r="10.5" fill="none" stroke="#ffffff" strokeWidth="1.6" />
      <ellipse cx="19" cy="21" rx="4.6" ry="10.5" fill="none" stroke="#ffffff" strokeWidth="1.2" opacity="0.7" />
      <path d="M8.8 17.4h20.4M8.8 24.6h20.4" stroke="#ffffff" strokeWidth="1.2" opacity="0.7" />
      <path
        d="M25.5 7.5 34 4.2l-1.4 8.6-3.3-2.2-4.1 4.1-1.9-1.9 4.1-4.1z"
        fill="#14a678"
      />
      <path d="M27.4 4.9 34 4.2l-.7 6.6z" fill="#0f8f66" />
    </svg>
  );
}

export default function Logo({
  className = "",
  markOnly = false,
  name = "Meridian Global Exports",
}: Props) {
  if (markOnly) return <LogoMark className={className || "h-9 w-9"} />;
  return (
    <Link
      href="/"
      className={`group flex items-center gap-3 ${className}`}
      aria-label={`${name} — home`}
    >
      <LogoMark className="h-9 w-9 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5" />
      <span className="leading-tight">
        <span className="block font-display text-[15px] font-bold tracking-tight text-navy-800">
          {name}
        </span>
        <span className="block text-[10.5px] font-semibold uppercase tracking-[0.16em] text-brand-700">
          Bulk export · UK &amp; Germany
        </span>
      </span>
    </Link>
  );
}
