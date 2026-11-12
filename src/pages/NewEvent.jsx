import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import SiteNav from '../components/SiteNav';
import EventSelector from '../components/EventSelector';
import Button from '../components/Button';
import { EVENT_TYPES, typeById } from '../data/eventTypes';

export default function NewEvent() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const initial = EVENT_TYPES.some((t) => t.id === params.get('type')) ? params.get('type') : null;
  const [type, setType] = useState(initial);

  const next = () => navigate(`/events/register?type=${type}`);

  return (
    <div className="min-h-screen bg-cream pb-32">
      <SiteNav />
      <main className="mx-auto max-w-[1100px] px-5 pt-6 sm:px-8 sm:pt-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="mb-12 max-w-2xl">
          <h1 className="text-[clamp(2.8rem,6.5vw,5rem)] font-medium leading-[0.98] text-wine">What’s the occasion?</h1>
          <p className="mt-5 text-lg text-ink/70">Choose one and we’ll tailor the setup, the guest page and the screen to match.</p>
        </motion.div>

        <EventSelector value={type} onChange={setType} />
      </main>

      <AnimatePresence>
        {type && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="fixed inset-x-0 bottom-0 z-30 px-4 pb-4 sm:pb-6"
          >
            <div className="mx-auto flex max-w-[640px] items-center justify-between gap-4 rounded-full border border-wine/15 bg-ivory/95 py-2.5 pl-6 pr-2.5 shadow-lift backdrop-blur">
              <p className="truncate text-[15px] text-ink/80">
                <span className="font-display text-xl font-medium text-wine">{typeById(type).label}</span> selected
              </p>
              <Button onClick={next}>
                Continue <ArrowRight size={18} />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
