import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SiteNav from '../components/SiteNav';
import SiteFooter from '../components/SiteFooter';
import HeroOrbit, { TIMELINE } from '../components/HeroOrbit';
import Button from '../components/Button';
import StorySection from '../components/landing/StorySection';
import HowItWorks from '../components/landing/HowItWorks';
import Occasions from '../components/landing/Occasions';
import WallSection from '../components/landing/WallSection';
import FinalCta from '../components/landing/FinalCta';

const fade = (delay) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.22, 0.7, 0.2, 1] },
});

export default function Landing() {
  // The call to action wakes up once the photographs have settled into orbit.
  const [ctaReady, setCtaReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setCtaReady(true), TIMELINE.cta * 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="bg-cream">
      <SiteNav />

      <main>
        <section aria-label="Welcome">
          <HeroOrbit>
            <div className="mx-auto max-w-[860px] text-center">
              <motion.h1
                {...fade(TIMELINE.headline)}
                className="text-[clamp(2.6rem,6.4vw,5.4rem)] font-medium leading-[0.96] tracking-[-0.01em] text-wine"
              >
                Your event.
                <br />
                Everyone’s memories.
              </motion.h1>

              <motion.p
                {...fade(TIMELINE.message)}
                className="mx-auto mt-6 max-w-[27rem] text-[15px] leading-relaxed text-ink/75 sm:text-lg"
              >
                Guests scan a code and add their photos. The ones you approve glow on your big screen as the night happens.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: ctaReady ? 1 : 0.0, y: ctaReady ? 0 : 10 }}
                transition={{ duration: 0.8, ease: [0.22, 0.7, 0.2, 1] }}
                className="mt-9"
                style={{ pointerEvents: ctaReady ? 'auto' : 'none' }}
              >
                <Button to="/events/new" size="lg" tabIndex={ctaReady ? 0 : -1}>
                  Create an Event
                </Button>
              </motion.div>
            </div>
          </HeroOrbit>
        </section>

        <StorySection />
        <HowItWorks />
        <Occasions />
        <WallSection />
        <FinalCta />
      </main>

      <SiteFooter />
    </div>
  );
}
