import { useEffect } from 'react';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';

function Count({ value }) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.8, ease: [0.22, 0.7, 0.2, 1] });
    return () => c.stop();
  }, [value, mv]);
  return <motion.span>{rounded}</motion.span>;
}

export default function StatsCard({ icon: Icon, label, value, note, highlight = false }) {
  return (
    <div className={`rounded-[24px] border p-5 ${highlight ? 'border-wine bg-wine text-cream' : 'border-wine/15 bg-ivory'}`}>
      <div className="flex items-center justify-between">
        <p className={`text-sm ${highlight ? 'text-cream/75' : 'text-ink/60'}`}>{label}</p>
        {Icon && <Icon size={18} strokeWidth={1.6} className={highlight ? 'text-gold' : 'text-burgundy'} />}
      </div>
      <p className={`mt-4 font-display text-[44px] font-medium leading-none ${highlight ? 'text-cream' : 'text-wine'}`}>
        <Count value={value} />
      </p>
      {note && <p className={`mt-2 text-sm ${highlight ? 'text-cream/65' : 'text-ink/50'}`}>{note}</p>}
    </div>
  );
}
