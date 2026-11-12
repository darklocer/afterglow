import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import Photo from '../components/Photo';
import Button from '../components/Button';
import { useStore } from '../store/EventStore';
import { typeById } from '../data/eventTypes';
import { STATUS_LABEL, formatDate } from '../lib/format';

export default function Events() {
  const { events, photos, resetDemo } = useStore();

  return (
    <div className="min-h-screen bg-cream">
      <SiteNav />
      <main className="mx-auto max-w-[1180px] px-5 pb-8 pt-6 sm:px-8 sm:pt-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="text-[clamp(2.8rem,6vw,4.6rem)] font-medium leading-[0.98] text-wine">Your events</h1>
          <Button to="/events/new">
            <Plus size={18} /> Create an Event
          </Button>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2">
          {events.map((e, i) => {
            const list = photos[e.id] ?? [];
            const cover = list.find((p) => p.featured && p.status === 'approved') ?? list.find((p) => p.status === 'approved');
            const waiting = list.filter((p) => p.status === 'waiting').length;
            return (
              <motion.li
                key={e.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <Link to={`/events/${e.id}`} className="group block overflow-hidden rounded-[28px] border border-wine/15 bg-ivory shadow-soft transition-shadow duration-300 hover:shadow-lift">
                  <Photo
                    srcs={cover?.srcs}
                    seed={e.id}
                    className="aspect-[2/1] w-full"
                    imgClassName="transition-transform duration-700 ease-soft group-hover:scale-[1.04]"
                  />
                  <div className="p-6">
                    <p className="text-sm text-ink/55">
                      {typeById(e.type).label} · {STATUS_LABEL[e.status] ?? 'Upcoming'}
                    </p>
                    <h2 className="mt-1 text-3xl font-medium leading-tight text-wine">{e.name}</h2>
                    <p className="mt-1 text-ink/65">{formatDate(e.date)} · {e.location}</p>
                    <p className="mt-4 text-sm text-ink/60">
                      {list.length} photos{waiting ? ` · ${waiting} waiting for review` : ''}
                    </p>
                  </div>
                </Link>
              </motion.li>
            );
          })}
        </ul>

        <p className="mt-10 text-sm text-ink/50">
          Events and photos are stored in this browser for the demo.{' '}
          <button onClick={resetDemo} className="underline decoration-wine/30 underline-offset-4 hover:text-wine">Reset sample data</button>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
