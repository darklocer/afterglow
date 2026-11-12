import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, CheckSquare, Square, Star, Trash2, X } from 'lucide-react';
import PhotoGrid from './PhotoGrid';
import { timeAgo } from '../lib/format';

const FILTERS = [
  { id: 'waiting', label: 'Waiting', test: (p) => p.status === 'waiting' },
  { id: 'approved', label: 'Approved', test: (p) => p.status === 'approved' },
  { id: 'featured', label: 'Featured', test: (p) => p.featured && p.status === 'approved' },
  { id: 'rejected', label: 'Rejected', test: (p) => p.status === 'rejected' },
  { id: 'all', label: 'All', test: () => true },
];

const BADGE = {
  waiting: 'bg-gold text-maroon',
  approved: 'bg-wine text-cream',
  rejected: 'bg-ink/80 text-cream',
};

function ActionButton({ label, onClick, active, danger, children }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={label}
      title={label}
      className={`grid h-10 w-10 place-items-center rounded-full transition-colors ${
        active ? 'bg-gold text-maroon' : danger ? 'bg-ivory/95 text-burgundy hover:bg-burgundy hover:text-cream' : 'bg-ivory/95 text-wine hover:bg-wine hover:text-cream'
      }`}
    >
      {children}
    </button>
  );
}

export default function PhotoModeration({ photos, onStatus, onFeature, onDelete }) {
  const [filter, setFilter] = useState('waiting');
  const [selected, setSelected] = useState(() => new Set());
  const [confirm, setConfirm] = useState(null); // photo id, or 'bulk'

  const counts = useMemo(() => Object.fromEntries(FILTERS.map((f) => [f.id, photos.filter(f.test).length])), [photos]);
  const current = FILTERS.find((f) => f.id === filter);
  const visible = useMemo(() => photos.filter(current.test), [photos, current]);

  // drop selections for photos that left this view
  useEffect(() => {
    setSelected((prev) => {
      const ids = new Set(visible.map((p) => p.id));
      const next = new Set([...prev].filter((id) => ids.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [visible]);

  useEffect(() => {
    if (!confirm) return undefined;
    const t = setTimeout(() => setConfirm(null), 3200);
    return () => clearTimeout(t);
  }, [confirm]);

  const toggle = (id) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const ids = [...selected];
  const allSelected = visible.length > 0 && selected.size === visible.length;

  const bulk = (fn) => {
    fn(ids);
    setSelected(new Set());
  };

  const emptyText = {
    waiting: 'Nothing is waiting. New guest uploads appear here.',
    approved: 'No approved photos yet.',
    featured: 'Star a photo to feature it. Featured photos get the large slot on the screen.',
    rejected: 'No rejected photos.',
    all: 'No photos yet. Share the QR code to get started.',
  }[filter];

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label="Filter photos" className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full border px-4 py-2 text-[15px] transition-colors ${
                filter === f.id ? 'border-wine bg-wine text-cream' : 'border-wine/20 text-ink/75 hover:border-wine/50'
              }`}
            >
              {f.label} <span className={filter === f.id ? 'text-cream/70' : 'text-ink/45'}>{counts[f.id]}</span>
            </button>
          ))}
        </div>

        {visible.length > 0 && (
          <button
            onClick={() => setSelected(allSelected ? new Set() : new Set(visible.map((p) => p.id)))}
            className="inline-flex items-center gap-2 self-start text-[15px] font-medium text-wine lg:self-auto"
          >
            {allSelected ? <CheckSquare size={18} /> : <Square size={18} />}
            {allSelected ? 'Clear selection' : `Select all ${visible.length}`}
          </button>
        )}
      </div>

      <div className="mt-6">
        {visible.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-wine/25 px-6 py-20 text-center">
            <p className="mx-auto max-w-sm text-ink/60">{emptyText}</p>
          </div>
        ) : (
          <PhotoGrid
            photos={visible}
            renderOverlay={(p) => {
              const isSel = selected.has(p.id);
              return (
                <>
                  <span aria-hidden="true" className={`pointer-events-none absolute inset-0 rounded-[20px] ring-[3px] ring-inset transition-opacity duration-200 ${isSel ? 'opacity-100 ring-gold' : 'opacity-0'}`} />
                  <button
                    onClick={() => toggle(p.id)}
                    aria-label={isSel ? 'Deselect photo' : 'Select photo'}
                    aria-pressed={isSel}
                    className={`absolute left-3 top-3 grid h-7 w-7 place-items-center rounded-full border-2 transition-colors ${isSel ? 'border-gold bg-gold text-maroon' : 'border-ivory/90 bg-maroon/25 text-transparent hover:bg-maroon/45'}`}
                  >
                    <Check size={14} strokeWidth={3} />
                  </button>
                  <span className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium ${BADGE[p.status]}`}>
                    {p.status === 'waiting' ? 'Waiting' : p.status === 'approved' ? (p.featured ? 'Featured' : 'Approved') : 'Rejected'}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-maroon/85 via-maroon/40 to-transparent px-3 pb-3 pt-14 opacity-100 transition-opacity duration-300 sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
                    <p className="mb-2 truncate text-xs text-cream/85">{p.guest} · {timeAgo(p.createdAt)}</p>
                    <div className="flex items-center gap-1.5">
                      {p.status !== 'approved' && (
                        <ActionButton label="Approve" onClick={() => onStatus([p.id], 'approved')}>
                          <Check size={18} />
                        </ActionButton>
                      )}
                      {p.status !== 'rejected' && (
                        <ActionButton label="Reject" onClick={() => onStatus([p.id], 'rejected')}>
                          <X size={18} />
                        </ActionButton>
                      )}
                      <ActionButton label={p.featured ? 'Remove from featured' : 'Feature'} active={p.featured} onClick={() => onFeature(p.id)}>
                        <Star size={17} fill={p.featured ? 'currentColor' : 'none'} />
                      </ActionButton>
                      <span className="flex-1" />
                      {confirm === p.id ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete([p.id]);
                            setConfirm(null);
                          }}
                          className="rounded-full bg-burgundy px-3.5 py-2.5 text-xs font-medium text-cream"
                        >
                          Delete for good
                        </button>
                      ) : (
                        <ActionButton label="Delete" danger onClick={() => setConfirm(p.id)}>
                          <Trash2 size={16} />
                        </ActionButton>
                      )}
                    </div>
                  </div>
                </>
              );
            }}
          />
        )}
      </div>

      {/* bulk actions */}
      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 28 }}
            className="fixed inset-x-0 bottom-0 z-30 px-4 pb-4 sm:pb-6"
          >
            <div className="on-dark mx-auto flex max-w-[680px] flex-wrap items-center gap-2 rounded-[28px] bg-maroon px-5 py-3 text-cream shadow-lift">
              <p className="mr-auto text-[15px]">{selected.size} selected</p>
              <button onClick={() => bulk((x) => onStatus(x, 'approved'))} className="rounded-full bg-cream px-4 py-2 text-sm font-medium text-wine hover:bg-ivory">
                Approve
              </button>
              <button onClick={() => bulk((x) => onStatus(x, 'rejected'))} className="rounded-full border border-cream/30 px-4 py-2 text-sm hover:bg-cream/10">
                Reject
              </button>
              {confirm === 'bulk' ? (
                <button onClick={() => { bulk(onDelete); setConfirm(null); }} className="rounded-full bg-burgundy px-4 py-2 text-sm font-medium">
                  Delete {selected.size} for good
                </button>
              ) : (
                <button onClick={() => setConfirm('bulk')} className="rounded-full border border-cream/30 px-4 py-2 text-sm hover:bg-cream/10">
                  Delete
                </button>
              )}
              <button onClick={() => setSelected(new Set())} className="rounded-full px-3 py-2 text-sm text-cream/70 hover:text-cream">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
