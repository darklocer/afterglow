import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Radio, ScanLine, ShieldCheck, Users } from 'lucide-react';
import LivePhotoWall from '../LivePhotoWall';
import { useStore } from '../../store/EventStore';

const features = [
  { icon: Radio, title: 'Live on screen', body: 'New photos appear on the wall as soon as you approve them.' },
  { icon: ShieldCheck, title: 'You decide', body: 'Approve, reject or feature each photo. Or switch on auto-approve.' },
  { icon: ScanLine, title: 'One QR code', body: 'Guests scan, add a name and upload. No sign-up.' },
  { icon: Users, title: 'Every guest included', body: 'A single page collects photos from everyone in the room.' },
];

export default function WallSection() {
  const { photos } = useStore();
  const sample = useMemo(() => (photos['ananya-rahul'] ?? []).filter((p) => p.status === 'approved'), [photos]);

  return (
    <section id="features" className="mx-auto max-w-[1280px] px-5 pb-24 pt-8 sm:px-8 lg:pb-32">
      <h2 className="max-w-3xl text-[clamp(2.4rem,5vw,4rem)] font-medium leading-[1.02] text-wine">
        One event. Hundreds of memories.
      </h2>

      <div className="mt-12 overflow-hidden rounded-[32px] bg-maroon p-3 shadow-lift sm:p-5">
        <div className="relative aspect-[16/10] sm:aspect-video">
          <div className="absolute inset-0">
            <LivePhotoWall photos={sample} intervalSec={4} embedded />
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm text-ink/55">This is the live view: one featured photo and nine more, rotating as guests add them.</p>

      <dl className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {features.map(({ icon: Icon, title, body }) => (
          <div key={title}>
            <Icon size={22} strokeWidth={1.5} className="text-burgundy" />
            <dt className="mt-4 font-display text-2xl font-medium text-wine">{title}</dt>
            <dd className="mt-1.5 leading-relaxed text-ink/70">{body}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-12">
        <Link to="/events/ananya-rahul/display" className="text-[15px] font-medium text-wine underline decoration-gold decoration-2 underline-offset-[6px] hover:text-burgundy">
          Open the full-screen demo
        </Link>
      </div>
    </section>
  );
}
