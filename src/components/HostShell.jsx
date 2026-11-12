import { Link, NavLink } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import Logo from './Logo';
import { STATUS_LABEL } from '../lib/format';

const tab = ({ isActive }) =>
  `rounded-full px-4 py-2 text-[15px] transition-colors ${isActive ? 'bg-wine text-cream' : 'text-ink/70 hover:text-wine'}`;

export default function HostShell({ event, stats, children }) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="border-b border-wine/10">
        <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-4 sm:px-8">
          <Logo />
          <Link to="/events" className="inline-flex items-center gap-1 text-sm text-ink/65 hover:text-wine">
            <ChevronLeft size={16} /> All events
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1180px] px-5 pb-24 pt-10 sm:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-sm text-ink/60">
              <span className={`h-2 w-2 rounded-full ${event.status === 'live' ? 'bg-burgundy' : event.status === 'ended' ? 'bg-ink/30' : 'bg-gold'}`} />
              {STATUS_LABEL[event.status] ?? 'Upcoming'}
            </p>
            <h1 className="mt-2 text-[clamp(2.2rem,4.6vw,3.6rem)] font-medium leading-[1.02] text-wine">{event.name}</h1>
          </div>

          <nav className="flex w-fit gap-1 rounded-full border border-wine/15 bg-ivory p-1" aria-label="Event sections">
            <NavLink to={`/events/${event.id}`} end className={tab}>Overview</NavLink>
            <NavLink to={`/events/${event.id}/moderation`} className={tab}>
              Photos{stats?.waiting ? <span className="ml-2 rounded-full bg-gold/30 px-2 py-0.5 text-xs text-wine">{stats.waiting}</span> : null}
            </NavLink>
            <NavLink to={`/events/${event.id}/display`} className={tab}>Screen</NavLink>
          </nav>
        </div>

        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
}
