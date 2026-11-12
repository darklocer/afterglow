import { AnimatePresence, motion } from 'framer-motion';
import Photo from './Photo';

/**
 * Responsive grid of photographs. `renderOverlay(photo)` lets each screen add its own
 * controls (moderation actions, remove buttons) on top of the image.
 */
export default function PhotoGrid({ photos, renderOverlay, ratio = 'aspect-square', cols = 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' }) {
  return (
    <motion.ul layout className={`grid gap-3 sm:gap-4 ${cols}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        {photos.map((p) => (
          <motion.li
            key={p.id}
            layout
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.35, ease: [0.22, 0.7, 0.2, 1] }}
            className={`group relative overflow-hidden rounded-[20px] bg-ivory shadow-soft ${ratio}`}
          >
            <Photo
              srcs={p.srcs}
              seed={p.id}
              alt={p.guest ? `Photo from ${p.guest}` : 'Event photo'}
              className="h-full w-full"
              imgClassName="transition-transform duration-700 ease-soft group-hover:scale-[1.05]"
            />
            {renderOverlay?.(p)}
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
