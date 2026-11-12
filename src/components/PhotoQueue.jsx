import { AnimatePresence, motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import Photo from './Photo';
import { timeAgo } from '../lib/format';

/**
 * The two queues side by side: photos waiting for approval, and the approved
 * photos lined up for the screen. New arrivals slide into the top of the list.
 */
export default function PhotoQueue({ waiting, approved, onApprove, onReject, limit = 5 }) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section aria-labelledby="waiting-h" className="rounded-[28px] border border-wine/15 bg-ivory p-5 sm:p-6">
        <div className="flex items-baseline justify-between">
          <h2 id="waiting-h" className="text-3xl font-medium text-wine">Waiting</h2>
          <p className="text-sm text-ink/55">{waiting.length} to review</p>
        </div>

        <ul className="mt-5 space-y-3">
          <AnimatePresence initial={false} mode="popLayout">
            {waiting.slice(0, limit).map((p) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 32 }}
                transition={{ duration: 0.4, ease: [0.22, 0.7, 0.2, 1] }}
                className="flex items-center gap-4 rounded-2xl border border-wine/10 bg-cream p-2.5 pr-3"
              >
                <Photo srcs={p.srcs} seed={p.id} className="h-16 w-16 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{p.guest}</p>
                  <p className="text-sm text-ink/55">{timeAgo(p.createdAt)}</p>
                </div>
                <button onClick={() => onReject([p.id])} aria-label={`Reject photo from ${p.guest}`} className="grid h-10 w-10 place-items-center rounded-full border border-wine/20 text-burgundy transition-colors hover:bg-burgundy/10">
                  <X size={18} />
                </button>
                <button onClick={() => onApprove([p.id])} aria-label={`Approve photo from ${p.guest}`} className="grid h-10 w-10 place-items-center rounded-full bg-wine text-cream transition-colors hover:bg-burgundy">
                  <Check size={18} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
          {waiting.length === 0 && (
            <li className="rounded-2xl border border-dashed border-wine/20 px-5 py-10 text-center text-ink/55">
              Nothing to review. New uploads from guests show up here.
            </li>
          )}
        </ul>
        {waiting.length > limit && <p className="mt-4 text-sm text-ink/55">and {waiting.length - limit} more in Photos</p>}
      </section>

      <section aria-labelledby="display-h" className="rounded-[28px] border border-wine/15 bg-ivory p-5 sm:p-6">
        <div className="flex items-baseline justify-between">
          <h2 id="display-h" className="text-3xl font-medium text-wine">Up next on screen</h2>
          <p className="text-sm text-ink/55">{approved.length} approved</p>
        </div>
        <ul className="mt-5 grid grid-cols-4 gap-2.5 sm:grid-cols-5">
          <AnimatePresence initial={false} mode="popLayout">
            {approved.slice(0, 10).map((p) => (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, ease: [0.22, 0.7, 0.2, 1] }}
              >
                <Photo srcs={p.srcs} seed={p.id} className="aspect-square w-full rounded-xl" />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
        {approved.length === 0 && (
          <p className="rounded-2xl border border-dashed border-wine/20 px-5 py-10 text-center text-ink/55">
            Approve a photo and it joins the screen queue.
          </p>
        )}
        {approved.length > 10 && <p className="mt-4 text-sm text-ink/55">The screen shows 10 at a time and rotates through the other {approved.length - 10}.</p>}
      </section>
    </div>
  );
}
