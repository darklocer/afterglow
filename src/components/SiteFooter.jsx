import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function SiteFooter() {
  return (
    <footer className="mx-auto max-w-[1280px] px-5 pb-10 pt-16 sm:px-8">
      <div className="flex flex-col gap-8 border-t border-wine/15 pt-10 md:flex-row md:items-end md:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-xs font-display text-xl italic text-ink/70">Moments, shared.</p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-[15px] text-ink/70" aria-label="Footer">
          <Link to="/events" className="hover:text-wine">Events</Link>
          <a href="/#how" className="hover:text-wine">How it works</a>
          <a href="/#features" className="hover:text-wine">Features</a>
          <Link to="/events/new" className="hover:text-wine">Create Event</Link>
          <Link to="/signin" className="hover:text-wine">Sign in</Link>
        </nav>
      </div>
      <p className="mt-8 text-sm text-ink/50">© 2026 Afterglow. Photos belong to the people who took them.</p>
    </footer>
  );
}
