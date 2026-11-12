import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, MapPin } from 'lucide-react';
import Photo from '../components/Photo';
import PhotoUploader from '../components/PhotoUploader';
import Button from '../components/Button';
import { LogoMark } from '../components/Logo';
import NotFound from './NotFound';
import { useEvent, useStore } from '../store/EventStore';
import { typeById } from '../data/eventTypes';
import { photoSrcs } from '../data/photos';
import { formatDate } from '../lib/format';

const NAME_KEY = 'afterglow:guest-name';
const readName = () => {
  try { return localStorage.getItem(NAME_KEY) ?? ''; } catch { return ''; }
};

export default function Guest() {
  const { eventId } = useParams();
  const { addPhotos } = useStore();
  const { event } = useEvent(eventId);
  const [name, setName] = useState(readName);
  const [nameDone, setNameDone] = useState(() => readName().length > 0);
  const [nameError, setNameError] = useState('');
  const [sent, setSent] = useState(0);

  if (!event) return <NotFound what="event" />;
  const type = typeById(event.type);
  const needName = event.requireName && !nameDone;

  const submitName = (e) => {
    e.preventDefault();
    if (!name.trim()) return setNameError('Add your name so the host knows who shared the photos.');
    try { localStorage.setItem(NAME_KEY, name.trim()); } catch { /* ignore */ }
    setNameDone(true);
  };

  const onSubmit = (uploaded) => {
    addPhotos(event.id, uploaded, event.requireName ? name.trim() : 'Guest');
    setSent((n) => n + uploaded.length);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* dedicated event page: no site navigation */}
      <div className="relative h-[250px] sm:h-[320px]">
        <Photo srcs={photoSrcs(type.id, type.keywords, 44, 1200, 700)} seed={`${type.id}-guest`} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-maroon/25 via-maroon/20 to-cream" />
        <div className="relative mx-auto flex max-w-[640px] items-center justify-between px-5 pt-5">
          <LogoMark className="h-9 w-9" />
          <span className="rounded-full bg-ivory/90 px-3.5 py-1.5 text-xs font-medium text-wine shadow-soft">{formatDate(event.date, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      <main className="mx-auto max-w-[640px] px-5 pb-20 pt-2">
        <h1 className="text-[clamp(2.4rem,9vw,3.8rem)] font-medium leading-[1] text-wine">Welcome to {event.name}</h1>
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-ink/60"><MapPin size={14} /> {event.location}</p>
        <p className="mt-5 text-xl text-ink/80">{type.guestPrompt}</p>

        <div className="mt-9">
          <AnimatePresence mode="wait" initial={false}>
            {sent > 0 && !needName ? (
              <motion.div
                key="thanks"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-[32px] border border-wine/15 bg-ivory p-8 text-center sm:p-12"
              >
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-wine text-cream"><Check size={26} strokeWidth={2.4} /></span>
                <h2 className="mt-6 text-4xl font-medium text-wine">Thank you{event.requireName && name ? `, ${name.split(' ')[0]}` : ''}</h2>
                <p className="mx-auto mt-3 max-w-sm text-ink/70">
                  {sent} photo{sent === 1 ? '' : 's'} shared with {event.host}.{' '}
                  {event.autoApprove ? 'They’re on their way to the big screen.' : 'They’ll appear on the big screen once the host approves them.'}
                </p>
                <Button className="mt-8" onClick={() => setSent(0)}>Add more photos</Button>
              </motion.div>
            ) : needName ? (
              <motion.form
                key="name"
                onSubmit={submitName}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="rounded-[32px] border border-wine/15 bg-ivory p-6 sm:p-8"
              >
                <label className="block">
                  <span className="mb-2 block font-display text-3xl font-medium text-wine">What’s your name?</span>
                  <span className="mb-4 block text-sm text-ink/60">It appears next to the photos you share.</span>
                  <input
                    className="field"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setNameError(''); }}
                    placeholder="Your name"
                    autoComplete="given-name"
                    autoFocus
                  />
                  {nameError && <span role="alert" className="mt-2 block text-sm text-burgundy">{nameError}</span>}
                </label>
                <Button type="submit" size="lg" className="mt-6 w-full">Continue</Button>
              </motion.form>
            ) : (
              <motion.div key="upload" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <PhotoUploader onSubmit={onSubmit} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-12 text-center text-sm text-ink/45">Photos go to {event.host}. No account needed.</p>
      </main>
    </div>
  );
}
