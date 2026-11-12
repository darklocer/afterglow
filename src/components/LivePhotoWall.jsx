import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Photo from './Photo';

const SLOTS = 10; // 1 featured + 9 supporting

function hash(str) {
  let h = 0;
  for (const c of str) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return h;
}

// Least-recently-shown first, so every approved photo gets its turn.
function pickNext(photos, visible, meta, { featured = false } = {}) {
  const shown = new Set(visible.filter(Boolean).map((p) => p.id));
  const pool = photos.filter((p) => !shown.has(p.id));
  if (!pool.length) return null;

  const queued = meta.priority.find((id) => pool.some((p) => p.id === id));
  if (queued) {
    meta.priority = meta.priority.filter((id) => id !== queued);
    return pool.find((p) => p.id === queued);
  }
  const ranked = [...pool].sort((a, b) => (meta.lastShown.get(a.id) ?? -1) - (meta.lastShown.get(b.id) ?? -1));
  if (featured) return ranked.find((p) => p.featured) ?? ranked[0];
  return ranked.find((p) => !p.featured) ?? ranked[0];
}

function initialSlots(photos, meta) {
  const slots = Array(SLOTS).fill(null);
  slots[0] = pickNext(photos, slots, meta, { featured: true });
  for (let i = 1; i < SLOTS; i += 1) slots[i] = pickNext(photos, slots, meta);
  slots.forEach((p) => p && meta.lastShown.set(p.id, meta.clock++));
  return slots;
}

function Slot({ photo, feature, showCaption }) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl bg-maroon/60 sm:rounded-2xl">
      <AnimatePresence initial={false}>
        {photo && (
          <motion.div
            key={photo.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1.1, ease: [0.22, 0.7, 0.2, 1] }}
          >
            <Photo
              srcs={photo.srcs}
              seed={photo.id}
              alt={photo.guest ? `Photo shared by ${photo.guest}` : 'Event photo'}
              className="h-full w-full"
              imgClassName={hash(photo.id) % 2 ? 'kb-a' : 'kb-b'}
              eager
            />
            {feature && showCaption && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-maroon/70 to-transparent px-6 pb-5 pt-16">
                <p className="font-display text-2xl text-cream/95 sm:text-3xl">{photo.guest}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Shows up to 10 approved photos at once and rotates the rest through.
 * New approvals jump the line and fade into the oldest slot.
 */
export default function LivePhotoWall({ photos, intervalSec = 6, embedded = false, emptyState = null }) {
  const metaRef = useRef({ lastShown: new Map(), known: new Set(), priority: [], clock: 0, tick: 0 });
  const [slots, setSlots] = useState(() => {
    const meta = metaRef.current;
    const s = initialSlots(photos, meta);
    photos.forEach((p) => meta.known.add(p.id));
    return s;
  });
  const photosRef = useRef(photos);
  photosRef.current = photos;

  // Sync when the approved list changes (approve, reject, delete, feature, new upload)
  useEffect(() => {
    const meta = metaRef.current;
    const byId = new Map(photos.map((p) => [p.id, p]));
    const fresh = photos.filter((p) => !meta.known.has(p.id));
    fresh.forEach((p) => meta.known.add(p.id));
    meta.priority = [...fresh.map((p) => p.id).reverse(), ...meta.priority].filter((id) => byId.has(id));

    setSlots((prev) => {
      const next = prev.map((s) => (s && byId.has(s.id) ? byId.get(s.id) : null));
      // refill anything that was removed, one slot at a time so no photo is picked twice
      for (let i = 0; i < next.length; i += 1) {
        if (!next[i]) next[i] = pickNext(photos, next, meta, { featured: i === 0 });
      }
      // bring one new arrival straight in, replacing the slot shown longest ago
      if (meta.priority.length) {
        const candidates = next
          .map((p, i) => ({ p, i }))
          .filter(({ i }) => i !== 0)
          .sort((a, b) => (meta.lastShown.get(a.p?.id) ?? -1) - (meta.lastShown.get(b.p?.id) ?? -1));
        const target = candidates[0]?.i ?? 1;
        const incoming = pickNext(photos, next, meta);
        if (incoming) next[target] = incoming;
      }
      next.forEach((p) => p && !meta.lastShown.has(p.id) && meta.lastShown.set(p.id, meta.clock++));
      return next;
    });
  }, [photos]);

  // Rotation
  useEffect(() => {
    const id = setInterval(() => {
      const meta = metaRef.current;
      meta.tick += 1;
      setSlots((prev) => {
        const list = photosRef.current;
        if (list.length <= SLOTS) return prev; // everything is already on screen
        const wantFeature = meta.tick % 4 === 0;
        const target = wantFeature ? 0 : 1 + ((meta.tick * 4) % (SLOTS - 1));
        const incoming = pickNext(list, prev, meta, { featured: wantFeature });
        if (!incoming) return prev;
        meta.lastShown.set(incoming.id, meta.clock++);
        const next = [...prev];
        next[target] = incoming;
        return next;
      });
    }, Math.max(2, intervalSec) * 1000);
    return () => clearInterval(id);
  }, [intervalSec]);

  const empty = useMemo(() => photos.length === 0, [photos.length]);
  if (empty) return emptyState;

  const gap = embedded ? 'gap-1.5 sm:gap-2.5' : 'gap-2.5 sm:gap-3.5';
  return (
    <div className={`grid h-full w-full grid-cols-7 grid-rows-3 ${gap}`} role="img" aria-label="Live photo wall">
      <div className="col-span-4 row-span-3">
        <Slot photo={slots[0]} feature showCaption={!embedded} />
      </div>
      {slots.slice(1).map((p, i) => (
        <div key={i} className="min-h-0 min-w-0">
          <Slot photo={p} />
        </div>
      ))}
    </div>
  );
}
