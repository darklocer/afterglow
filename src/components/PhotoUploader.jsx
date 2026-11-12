import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Check, ImagePlus, Plus, UploadCloud, X } from 'lucide-react';
import Button from './Button';
import { uploadPhoto } from '../api/mockApi';

const MAX_FILES = 24;
const uid = () => Math.random().toString(36).slice(2, 9);

function Ring({ value }) {
  const r = 16;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 40 40" className="h-11 w-11 -rotate-90">
      <circle cx="20" cy="20" r={r} fill="rgba(36,23,26,.45)" stroke="rgba(255,249,239,.3)" strokeWidth="3" />
      <motion.circle
        cx="20"
        cy="20"
        r={r}
        fill="none"
        stroke="#C9A96E"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={c}
        animate={{ strokeDashoffset: c * (1 - value / 100) }}
        transition={{ duration: 0.2 }}
      />
    </svg>
  );
}

/**
 * Pick, preview and send photos. `onSubmit(uploaded)` receives
 * [{ srcs }] once every file has been uploaded.
 */
export default function PhotoUploader({ onSubmit, disabled = false }) {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [drag, setDrag] = useState(false);
  const [notice, setNotice] = useState('');
  const galleryRef = useRef(null);
  const cameraRef = useRef(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => () => itemsRef.current.forEach((i) => URL.revokeObjectURL(i.preview)), []);

  const patch = (id, change) => setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...change } : i)));

  const add = useCallback((fileList) => {
    const all = [...fileList];
    const images = all.filter((f) => f.type.startsWith('image/'));
    const room = MAX_FILES - itemsRef.current.length;
    const taken = images.slice(0, Math.max(0, room));
    const notes = [];
    if (images.length < all.length) notes.push('Only image files can be added.');
    if (images.length > taken.length) notes.push(`You can add up to ${MAX_FILES} photos at a time.`);
    setNotice(notes.join(' '));
    setItems((prev) => [
      ...prev,
      ...taken.map((file) => ({ id: uid(), file, preview: URL.createObjectURL(file), status: 'ready', progress: 0 })),
    ]);
  }, []);

  const remove = (id) => {
    const it = itemsRef.current.find((i) => i.id === id);
    if (it) URL.revokeObjectURL(it.preview);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const send = async () => {
    const queue = itemsRef.current.filter((i) => i.status !== 'done');
    if (!queue.length) return;
    setBusy(true);
    setNotice('');
    const uploaded = [];
    let index = 0;
    const worker = async () => {
      while (index < queue.length) {
        const it = queue[index++];
        patch(it.id, { status: 'uploading', progress: 0 });
        try {
          const res = await uploadPhoto(it.file, (p) => patch(it.id, { progress: p }));
          uploaded.push(res);
          patch(it.id, { status: 'done', progress: 100 });
        } catch (err) {
          patch(it.id, { status: 'error', progress: 0, error: err.message });
        }
      }
    };
    await Promise.all([worker(), worker(), worker()]); // three at a time
    setBusy(false);

    if (uploaded.length) {
      await new Promise((r) => setTimeout(r, 650)); // let the last ring finish
      onSubmit(uploaded);
      itemsRef.current.forEach((i) => URL.revokeObjectURL(i.preview));
      setItems((prev) => prev.filter((i) => i.status === 'error'));
    }
    if (itemsRef.current.some((i) => i.status === 'error')) {
      setNotice('Some photos couldn’t be uploaded. Remove them or try again.');
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    if (!busy && !disabled) add(e.dataTransfer.files);
  };

  const pending = items.filter((i) => i.status !== 'done').length;
  const inputs = (
    <>
      <input ref={galleryRef} type="file" accept="image/*" multiple hidden onChange={(e) => { add(e.target.files); e.target.value = ''; }} />
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" hidden onChange={(e) => { add(e.target.files); e.target.value = ''; }} />
    </>
  );

  return (
    <div>
      {inputs}

      {items.length === 0 ? (
        <>
          {/* desktop: large drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            className={`hidden rounded-[32px] border-2 border-dashed px-8 py-20 text-center transition-colors duration-300 sm:block ${
              drag ? 'border-wine bg-wine/5' : 'border-wine/25 bg-ivory'
            }`}
          >
            <UploadCloud size={44} strokeWidth={1.3} className="mx-auto text-burgundy" />
            <p className="mt-5 font-display text-4xl font-medium text-wine">Drop photos here</p>
            <p className="mt-2 text-ink/60">or choose them from your computer</p>
            <div className="mt-8 flex justify-center gap-3">
              <Button onClick={() => galleryRef.current?.click()} disabled={disabled}>
                <ImagePlus size={18} /> Choose photos
              </Button>
              <Button variant="secondary" onClick={() => cameraRef.current?.click()} disabled={disabled}>
                <Camera size={18} /> Use camera
              </Button>
            </div>
          </div>

          {/* mobile: one large button + camera */}
          <div className="space-y-3 sm:hidden">
            <button
              onClick={() => galleryRef.current?.click()}
              disabled={disabled}
              className="flex w-full flex-col items-center justify-center gap-3 rounded-[28px] border-2 border-dashed border-wine/30 bg-ivory py-14 text-wine active:bg-wine/5"
            >
              <span className="grid h-16 w-16 place-items-center rounded-full bg-wine text-cream"><Plus size={30} /></span>
              <span className="font-display text-3xl font-medium">Add Photos</span>
              <span className="text-sm text-ink/55">Choose as many as you like</span>
            </button>
            <Button variant="secondary" className="w-full" onClick={() => cameraRef.current?.click()} disabled={disabled}>
              <Camera size={18} /> Take a photo
            </Button>
          </div>
        </>
      ) : (
        <div>
          <ul className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 sm:gap-3.5">
            <AnimatePresence initial={false} mode="popLayout">
              {items.map((it) => (
                <motion.li
                  key={it.id}
                  layout
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  className="relative aspect-square overflow-hidden rounded-2xl bg-ivory shadow-soft"
                >
                  <img src={it.preview} alt="" className="h-full w-full object-cover" />
                  {it.status === 'uploading' && (
                    <div className="absolute inset-0 grid place-items-center bg-maroon/35"><Ring value={it.progress} /></div>
                  )}
                  {it.status === 'done' && (
                    <div className="absolute inset-0 grid place-items-center bg-maroon/40">
                      <span className="grid h-10 w-10 place-items-center rounded-full bg-gold text-maroon"><Check size={20} strokeWidth={2.6} /></span>
                    </div>
                  )}
                  {it.status === 'error' && (
                    <div className="absolute inset-0 grid place-items-center bg-burgundy/80 p-2 text-center text-xs text-cream">Couldn’t read this file</div>
                  )}
                  {it.status === 'ready' && (
                    <span className="absolute bottom-2 left-2 rounded-full bg-ivory/90 px-2 py-0.5 text-[11px] font-medium text-wine">Ready</span>
                  )}
                  {!busy && it.status !== 'done' && (
                    <button onClick={() => remove(it.id)} aria-label="Remove photo" className="absolute right-1.5 top-1.5 grid h-8 w-8 place-items-center rounded-full bg-ivory/95 text-wine shadow-soft hover:bg-wine hover:text-cream">
                      <X size={16} />
                    </button>
                  )}
                </motion.li>
              ))}
            </AnimatePresence>

            {!busy && items.length < MAX_FILES && (
              <li>
                <button onClick={() => galleryRef.current?.click()} className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-wine/30 text-wine transition-colors hover:bg-wine/5">
                  <Plus size={24} />
                  <span className="text-xs font-medium">Add more</span>
                </button>
              </li>
            )}
          </ul>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-ink/60" aria-live="polite">
              {busy ? 'Uploading. Keep this page open.' : `${pending} photo${pending === 1 ? '' : 's'} ready to share`}
            </p>
            <Button size="lg" onClick={send} disabled={busy || disabled || pending === 0} className="w-full sm:w-auto">
              {busy ? 'Sharing…' : 'Share Memories'}
            </Button>
          </div>
        </div>
      )}

      {notice && <p role="alert" className="mt-4 text-sm text-burgundy">{notice}</p>}
    </div>
  );
}
