import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Photo from './Photo';
import { photoSrcs } from '../data/photos';

export default function EventCard({ type, index = 0, selected, onSelect }) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(type.id)}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: 0.05 * index, ease: [0.22, 0.7, 0.2, 1] }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.99 }}
      className={`group relative w-full overflow-hidden rounded-[28px] bg-ivory text-left transition-shadow duration-300 ${
        selected ? 'shadow-lift' : 'shadow-soft'
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Photo
          srcs={photoSrcs(type.id, type.keywords, index + 41, 800, 600)}
          seed={type.id}
          className="h-full w-full"
          imgClassName="transition-transform duration-700 ease-soft group-hover:scale-[1.05]"
        />
        <motion.span
          initial={false}
          animate={{ scale: selected ? 1 : 0.6, opacity: selected ? 1 : 0 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          className="absolute right-3.5 top-3.5 grid h-9 w-9 place-items-center rounded-full bg-wine text-cream shadow-soft"
        >
          <Check size={18} strokeWidth={2.2} />
        </motion.span>
      </div>
      <div className="px-5 pb-5 pt-4">
        <p className="font-display text-[28px] font-medium leading-none text-wine">{type.label}</p>
        <p className="mt-1.5 text-sm text-ink/65">{type.blurb}</p>
      </div>

      {/* selection border slides in on top of the card */}
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ opacity: selected ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        className="pointer-events-none absolute inset-0 rounded-[28px] ring-[2.5px] ring-inset ring-wine"
      />
    </motion.button>
  );
}
