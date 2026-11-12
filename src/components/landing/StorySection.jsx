import { motion } from 'framer-motion';
import Photo from '../Photo';
import { eventPhotoSrcs } from '../../data/photos';

const shots = [
  { seed: 4, who: 'Meera, table four', cls: 'col-span-7 row-span-2 aspect-[4/5]', offset: 'mt-0' },
  { seed: 9, who: 'Karthik, dance floor', cls: 'col-span-5 aspect-square', offset: 'mt-10' },
  { seed: 15, who: 'Aditi, the long way round', cls: 'col-span-5 aspect-[4/5]', offset: 'mt-2' },
];

export default function StorySection() {
  return (
    <section className="mx-auto grid max-w-[1280px] items-center gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[5fr_7fr] lg:gap-20 lg:py-32">
      <div>
        <h2 className="text-[clamp(2.4rem,5vw,4rem)] font-medium leading-[1.02] text-wine">
          Every guest has a story to add.
        </h2>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-ink/75">
          The best photos of the night are rarely the official ones. They’re taken by the cousin on the
          dance floor and the friend at table nine. Afterglow gives everyone one place to put them.
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4 sm:gap-6">
        {shots.map((s, i) => (
          <motion.figure
            key={s.seed}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 0.7, 0.2, 1] }}
            className={`${s.cls} ${s.offset}`}
          >
            <Photo
              srcs={eventPhotoSrcs('wedding', s.seed)}
              seed={`story-${s.seed}`}
              className="h-full w-full rounded-[28px] shadow-soft"
              imgClassName="transition-transform duration-700 ease-soft hover:scale-[1.04]"
            />
            <figcaption className="mt-2.5 px-1 text-sm text-ink/60">{s.who}</figcaption>
          </motion.figure>
        ))}
      </div>
    </section>
  );
}
