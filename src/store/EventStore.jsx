import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as api from '../api/mockApi';
import { subscribe } from '../api/realtime';
import { eventPhotoSrcs } from '../data/photos';
import { GUEST_NAMES } from '../data/mock';

const Ctx = createContext(null);

const uid = () => Math.random().toString(36).slice(2, 9);
const NO_PHOTOS = [];

function makeCode(name) {
  const initials = name
    .replace(/[^A-Za-z& ]/g, '')
    .split(/[\s&]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
  return `${initials || 'EV'}-${Math.floor(1000 + Math.random() * 9000)}`;
}

function slugify(name) {
  const base = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 28);
  return `${base || 'event'}-${uid().slice(0, 3)}`;
}

export function EventStoreProvider({ children }) {
  const [state, setState] = useState(() => api.load());

  // Persist every change; other tabs hear about it through the storage event.
  const commit = useCallback((updater) => {
    setState((prev) => {
      const next = updater(prev);
      api.save(next);
      return next;
    });
  }, []);

  useEffect(() => subscribe(() => setState(api.load())), []);

  const actions = useMemo(
    () => ({
      createEvent(data) {
        const id = slugify(data.name);
        const event = {
          id,
          code: makeCode(data.name),
          status: 'upcoming',
          requireName: true,
          autoApprove: false,
          slideSeconds: 6,
          demo: false,
          ...data,
        };
        commit((s) => ({
          events: [event, ...s.events],
          photos: { ...s.photos, [id]: [] },
        }));
        return id;
      },

      setEventStatus(eventId, status) {
        commit((s) => ({
          ...s,
          events: s.events.map((e) => (e.id === eventId ? { ...e, status } : e)),
        }));
      },

      addPhotos(eventId, items, guest) {
        commit((s) => {
          const ev = s.events.find((e) => e.id === eventId);
          const status = ev?.autoApprove ? 'approved' : 'waiting';
          const fresh = items.map((it) => ({
            id: uid(),
            eventId,
            srcs: it.srcs,
            guest: guest || 'Guest',
            status,
            featured: false,
            createdAt: Date.now(),
          }));
          return { ...s, photos: { ...s.photos, [eventId]: [...fresh, ...(s.photos[eventId] ?? [])] } };
        });
      },

      setStatus(eventId, ids, status) {
        const set = new Set(ids);
        commit((s) => ({
          ...s,
          photos: {
            ...s.photos,
            [eventId]: (s.photos[eventId] ?? []).map((p) => (set.has(p.id) ? { ...p, status } : p)),
          },
        }));
      },

      toggleFeature(eventId, id) {
        commit((s) => ({
          ...s,
          photos: {
            ...s.photos,
            [eventId]: (s.photos[eventId] ?? []).map((p) =>
              p.id === id ? { ...p, featured: !p.featured, status: p.featured ? p.status : 'approved' } : p,
            ),
          },
        }));
      },

      deletePhotos(eventId, ids) {
        const set = new Set(ids);
        commit((s) => ({
          ...s,
          photos: { ...s.photos, [eventId]: (s.photos[eventId] ?? []).filter((p) => !set.has(p.id)) },
        }));
      },

      // Stand-in for a guest elsewhere in the room sending a photo.
      simulateGuestUpload(eventId) {
        commit((s) => {
          const ev = s.events.find((e) => e.id === eventId);
          if (!ev) return s;
          const seed = Math.floor(Math.random() * 900) + 200;
          const photo = {
            id: uid(),
            eventId,
            srcs: eventPhotoSrcs(ev.type, seed),
            guest: GUEST_NAMES[Math.floor(Math.random() * GUEST_NAMES.length)],
            status: ev.autoApprove ? 'approved' : 'waiting',
            featured: false,
            createdAt: Date.now(),
          };
          return { ...s, photos: { ...s.photos, [eventId]: [photo, ...(s.photos[eventId] ?? [])] } };
        });
      },

      resetDemo() {
        setState(api.reset());
      },
    }),
    [commit],
  );

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => useContext(Ctx);

export function useEvent(eventId) {
  const { events, photos } = useStore();
  const event = events.find((e) => e.id === eventId);
  const list = photos[eventId] ?? NO_PHOTOS;
  const stats = useMemo(() => {
    const approved = list.filter((p) => p.status === 'approved');
    return {
      uploaded: list.length,
      approved: approved.length,
      waiting: list.filter((p) => p.status === 'waiting').length,
      rejected: list.filter((p) => p.status === 'rejected').length,
      featured: list.filter((p) => p.featured && p.status === 'approved').length,
      guests: new Set(list.map((p) => p.guest)).size,
      displayed: Math.min(10, approved.length),
    };
  }, [list]);
  return { event, photos: list, stats };
}
