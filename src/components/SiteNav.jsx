import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from './Logo';
import Button from './Button';

const links = [
  { label: 'Events', to: '/events' },
  { label: 'How it works', href: '/#how' },
  { label: 'Features', href: '/#features' },
];

const linkCls = 'text-[15px] text-ink/75 transition-colors hover:text-wine';

export default function SiteNav({ tone = 'dark' }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="relative z-40">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-5 py-5 sm:px-8">
        <Logo tone={tone} />

        <nav className="hidden items-center gap-9 md:flex" aria-label="Main">
          {links.map((l) =>
            l.to ? (
              <NavLink key={l.label} to={l.to} className={({ isActive }) => `${linkCls} ${isActive ? 'text-wine' : ''}`}>
                {l.label}
              </NavLink>
            ) : (
              <a key={l.label} href={l.href} className={linkCls}>
                {l.label}
              </a>
            ),
          )}
          <Link to="/events/new" className={`${linkCls} font-medium text-wine`}>
            Create Event
          </Link>
        </nav>

        <div className="hidden items-center md:flex">
          <Button to="/signin" variant="secondary" size="sm">
            Sign in
          </Button>
        </div>

        <button
          className="grid h-11 w-11 place-items-center rounded-full text-wine md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-x-4 top-[76px] rounded-3xl border border-wine/15 bg-ivory p-4 shadow-lift md:hidden"
          >
            <div className="flex flex-col">
              {links.map((l) =>
                l.to ? (
                  <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-ink/80 hover:bg-wine/5">
                    {l.label}
                  </Link>
                ) : (
                  <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-ink/80 hover:bg-wine/5">
                    {l.label}
                  </a>
                ),
              )}
              <Link to="/signin" onClick={() => setOpen(false)} className="rounded-xl px-4 py-3 text-ink/80 hover:bg-wine/5">
                Sign in
              </Link>
              <Button to="/events/new" className="mt-2" onClick={() => setOpen(false)}>
                Create Event
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
