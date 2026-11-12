import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Maximize, Minimize, Radio } from 'lucide-react';
import LivePhotoWall from '../components/LivePhotoWall';
import NotFound from './NotFound';
import { useEvent, useStore } from '../store/EventStore';
import { formatDate, guestLink } from '../lib/format';

function useIdleVisible(ms = 3000) {
  const [visible, setVisible] = useState(true);
  const timer = useRef();
  useEffect(() => {
    const wake = () => {
      setVisible(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setVisible(false), ms);
    };
    wake();
    window.addEventListener('mousemove', wake);
    window.addEventListener('keydown', wake);
    window.addEventListener('touchstart', wake);
    return () => {
      clearTimeout(timer.current);
      window.removeEventListener('mousemove', wake);
      window.removeEventListener('keydown', wake);
      window.removeEventListener('touchstart', wake);
    };
  }, [ms]);
  return visible;
}

export default function Display() {
  const { eventId } = useParams();
  const { simulateGuestUpload, setStatus } = useStore();
  const { event, photos } = useEvent(eventId);
  const [demoFeed, setDemoFeed] = useState(false);
  const [full, setFull] = useState(false);
  const controlsVisible = useIdleVisible();

  const approved = useMemo(() => photos.filter((p) => p.status === 'approved'), [photos]);
  const link = event ? guestLink(event.id) : '';

  // Optional demo: a "guest" uploads every so often and the host approves it.
  const latest = useRef(photos);
  latest.current = photos;
  useEffect(() => {
    if (!demoFeed || !event) return undefined;
    const id = setInterval(() => {
      simulateGuestUpload(event.id);
      if (!event.autoApprove) {
        setTimeout(() => {
          const fresh = latest.current.find((p) => p.status === 'waiting');
          if (fresh) setStatus(event.id, [fresh.id], 'approved');
        }, 2500);
      }
    }, 9000);
    return () => clearInterval(id);
  }, [demoFeed, event, simulateGuestUpload, setStatus]);

  useEffect(() => {
    const onChange = () => setFull(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);
  const toggleFull = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen?.();
  }, []);

  if (!event) return <NotFound what="event" />;

  const waitingView = (
    <div className="grid h-full place-items-center text-center">
      <div>
        <div className="mx-auto w-fit rounded-3xl bg-ivory p-5">
          <QRCodeSVG value={link} size={200} fgColor="#3B0D18" bgColor="#FFF9EF" level="M" />
        </div>
        <p className="mt-8 font-display text-5xl font-medium text-cream">Be the first to add a photo</p>
        <p className="mt-3 text-xl text-cream/65">Scan the code with your phone camera</p>
      </div>
    </div>
  );

  return (
    <div className="on-dark grain relative flex h-screen w-screen flex-col overflow-hidden bg-maroon text-cream">
      <header className="flex items-center justify-between gap-6 px-6 pb-4 pt-5 sm:px-10">
        <div className="min-w-0">
          <h1 className="truncate font-display text-[clamp(1.8rem,3.2vw,3.2rem)] font-medium leading-none">{event.name}</h1>
          <p className="mt-2 truncate text-sm text-cream/60 sm:text-base">
            {formatDate(event.date)} · {event.location}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <div className="hidden text-right sm:block">
            <p className="font-display text-2xl leading-tight">Add your photos</p>
            <p className="text-sm text-cream/60">Scan, or use code <span className="font-medium text-gold">{event.code}</span></p>
          </div>
          <div className="rounded-xl bg-ivory p-1.5">
            <QRCodeSVG value={link} size={64} fgColor="#3B0D18" bgColor="#FFF9EF" level="M" />
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 px-4 pb-4 sm:px-8 sm:pb-8">
        <LivePhotoWall photos={approved} intervalSec={event.slideSeconds ?? 6} emptyState={waitingView} />
      </main>

      <AnimatePresence>
        {controlsVisible && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1 rounded-full border border-cream/15 bg-maroon/90 p-1.5 shadow-lift backdrop-blur"
          >
            <Link to={`/events/${event.id}`} className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm text-cream/85 hover:bg-cream/10">
              <ArrowLeft size={16} /> Dashboard
            </Link>
            <button
              onClick={() => setDemoFeed((d) => !d)}
              aria-pressed={demoFeed}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm transition-colors ${demoFeed ? 'bg-gold text-maroon' : 'text-cream/85 hover:bg-cream/10'}`}
            >
              <Radio size={16} /> Demo feed {demoFeed ? 'on' : 'off'}
            </button>
            <button onClick={toggleFull} className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm text-cream/85 hover:bg-cream/10">
              {full ? <Minimize size={16} /> : <Maximize size={16} />} {full ? 'Exit full screen' : 'Full screen'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
