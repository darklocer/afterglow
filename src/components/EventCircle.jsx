import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import Photo from './Photo';
import { photoSrcs } from '../data/photos';

/**
 * One circular photograph in the orbit. The outer node is positioned every
 * frame by HeroOrbit; the inner node owns the soft pop-in (0.7 -> 1 scale,
 * 0 -> 1 opacity, light spring).
 */
const EventCircle = forwardRef(function EventCircle({ type, index, popDelay, reduced }, ref) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-1/2 will-change-transform"
      style={{ transform: 'translate(-50%, -50%)' }}
    >
      <motion.figure
        initial={reduced ? { opacity: 0 } : { scale: 0.7, opacity: 0 }}
        animate={reduced ? { opacity: 1 } : { scale: 1, opacity: 1 }}
        transition={
          reduced
            ? { duration: 0.5, delay: popDelay }
            : { type: 'spring', stiffness: 130, damping: 15, mass: 0.9, delay: popDelay, opacity: { duration: 0.7, delay: popDelay } }
        }
        className="flex flex-col items-center"
      >
        <Photo
          srcs={photoSrcs(type.id, type.keywords, index + 3, 500, 500)}
          seed={type.id}
          eager
          className="h-[74px] w-[74px] rounded-full border-[3px] border-ivory shadow-lift sm:h-[104px] sm:w-[104px] lg:h-[148px] lg:w-[148px]"
        />
        <figcaption className="mt-2 rounded-full bg-ivory/90 px-3 py-1 text-[11px] font-medium text-wine shadow-soft sm:text-xs">
          {type.label}
        </figcaption>
      </motion.figure>
    </div>
  );
});

export default EventCircle;
