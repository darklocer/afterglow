import { Link } from 'react-router-dom';

export function LogoMark({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <rect width="32" height="32" rx="9" className="fill-wine" />
      <ellipse cx="16" cy="16" rx="9" ry="5.5" fill="none" stroke="#F8F1E5" strokeWidth="1.4" transform="rotate(-22 16 16)" />
      <circle cx="23.2" cy="12.4" r="2.6" fill="#C9A96E" />
    </svg>
  );
}

export default function Logo({ to = '/', tone = 'dark', className = '' }) {
  const text = tone === 'light' ? 'text-cream' : 'text-wine';
  return (
    <Link to={to} className={`inline-flex items-center gap-2.5 ${className}`} aria-label="Afterglow home">
      <LogoMark />
      <span className={`font-display text-[26px] font-semibold leading-none tracking-tight ${text}`}>Afterglow</span>
    </Link>
  );
}
