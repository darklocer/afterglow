import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Photo from '../Photo';
import { photoSrcs } from '../../data/photos';
import { typeById } from '../../data/eventTypes';

// Desktop: a 3x3 grid. Wedding takes a 2x2 block, birthday and graduation sit beside it,
// and the last three fill the bottom row. Mobile: two columns, wedding and anniversary full width.
const picks = [
  { id: 'wedding', wrap: 'col-span-2 lg:col-span-2 lg:row-span-2', shape: 'aspect-[4/3] lg:aspect-auto lg:h-full' },
  { id: 'birthday', wrap: '', shape: 'aspect-[4/5] lg:aspect-[4/3]' },
  { id: 'graduation', wrap: '', shape: 'aspect-[4/5] lg:aspect-[4/3]' },
  { id: 'party', wrap: '', shape: 'aspect-[4/5] lg:aspect-[4/3]' },
  { id: 'corporate', wrap: '', shape: 'aspect-[4/5] lg:aspect-[4/3]' },
  { id: 'anniversary', wrap: 'col-span-2 lg:col-span-1', shape: 'aspect-[4/3]' },
];

export default function Occasions() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-24 sm:px-8 lg:py-32">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h2 className="max-w-xl text-[clamp(2.4rem,5vw,4rem)] font-medium leading-[1.02] text-wine">
          Made for every kind of celebration.
        </h2>
        <p className="max-w-sm text-ink/70">Pick an occasion and we’ll set up the wording, the guest page and the screen to match.</p>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
        {picks.map(({ id, wrap, shape }, i) => {
          const t = typeById(id);
          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
              className={wrap}
            >
              <Link
                to={`/events/new?type=${id}`}
                className={`group relative block overflow-hidden rounded-[28px] shadow-soft ${shape}`}
              >
                <Photo
                  srcs={photoSrcs(id, t.keywords, i + 21, 900, 900)}
                  seed={id}
                  className="absolute inset-0"
                  imgClassName="transition-transform duration-700 ease-soft group-hover:scale-[1.05]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-maroon/80 via-maroon/30 to-transparent p-5 pt-20 text-cream sm:p-6">
                  <p className="font-display text-3xl font-medium leading-none sm:text-4xl">{t.label.replace(' Event', '')}</p>
                  <p className="mt-1.5 text-sm text-cream/75">{t.blurb}</p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
