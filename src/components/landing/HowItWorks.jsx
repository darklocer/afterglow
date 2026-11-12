import { Camera, ShieldCheck, Tv, UploadCloud } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  { icon: Camera, title: 'Capture', body: 'Guests take photos on their own phones. There’s no app to install.' },
  { icon: UploadCloud, title: 'Upload', body: 'They scan your QR code, add their name, and send as many photos as they like.' },
  { icon: ShieldCheck, title: 'Approve', body: 'You see every photo first and choose what goes on screen. Or let them straight through.' },
  { icon: Tv, title: 'Display', body: 'Approved photos fade onto the big screen within seconds, ten at a time.' },
];

export default function HowItWorks() {
  return (
    <section id="how" className="on-dark relative overflow-hidden bg-maroon text-cream grain">
      <div className="relative mx-auto max-w-[1280px] px-5 py-24 sm:px-8 lg:py-32">
        <h2 className="max-w-2xl text-[clamp(2.4rem,5vw,4rem)] font-medium leading-[1.02]">From phone to big screen.</h2>

        <ol className="relative mt-16 grid gap-12 md:grid-cols-4 md:gap-8">
          {/* a single line through the four stages */}
          <div aria-hidden="true" className="absolute left-[28px] top-7 hidden h-px w-[calc(100%-56px)] bg-gold/30 md:block" />
          {steps.map(({ icon: Icon, title, body }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="relative"
            >
              <span className="relative z-10 grid h-14 w-14 place-items-center rounded-full border border-gold/60 bg-maroon text-gold">
                <Icon size={22} strokeWidth={1.5} />
              </span>
              <h3 className="mt-6 text-3xl font-medium">{title}</h3>
              <p className="mt-3 max-w-[16rem] leading-relaxed text-cream/70">{body}</p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
