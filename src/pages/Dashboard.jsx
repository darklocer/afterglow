import { Link, useLocation, useParams } from 'react-router-dom';
import { CalendarDays, Clock, Images, MapPin, MonitorPlay, ShieldCheck, Smartphone, Users, Wand2 } from 'lucide-react';
import { motion } from 'framer-motion';
import HostShell from '../components/HostShell';
import StatsCard from '../components/StatsCard';
import QRCodeCard from '../components/QRCodeCard';
import PhotoQueue from '../components/PhotoQueue';
import Button from '../components/Button';
import NotFound from './NotFound';
import { useEvent, useStore } from '../store/EventStore';
import { typeById } from '../data/eventTypes';
import { formatDate } from '../lib/format';

export default function Dashboard() {
  const { eventId } = useParams();
  const { state } = useLocation();
  const { setStatus, simulateGuestUpload, setEventStatus } = useStore();
  const { event, photos, stats } = useEvent(eventId);
  if (!event) return <NotFound what="event" />;

  const waiting = photos.filter((p) => p.status === 'waiting');
  const approved = photos.filter((p) => p.status === 'approved');
  const type = typeById(event.type);

  return (
    <HostShell event={event} stats={stats}>
      {state?.created && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 rounded-2xl border border-gold/50 bg-ivory px-5 py-4 text-[15px] text-ink/80"
        >
          Your event is ready. Share the QR code or link with your guests, then open the screen when you’re set up.
        </motion.div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          {/* Overview */}
          <section aria-label="Event overview" className="rounded-[28px] border border-wine/15 bg-ivory p-6 sm:p-8">
            <dl className="grid gap-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-ink/55">Occasion</dt>
                <dd className="mt-1 font-display text-2xl font-medium text-wine">{type.label}</dd>
              </div>
              <div>
                <dt className="text-sm text-ink/55">Hosted by</dt>
                <dd className="mt-1 font-display text-2xl font-medium text-wine">{event.host}</dd>
              </div>
              <div className="flex items-start gap-3">
                <CalendarDays size={18} className="mt-1 text-burgundy" />
                <div>
                  <dt className="text-sm text-ink/55">Date</dt>
                  <dd className="mt-0.5">{formatDate(event.date)}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 text-burgundy" />
                <div>
                  <dt className="text-sm text-ink/55">Location</dt>
                  <dd className="mt-0.5">{event.location}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:col-span-2">
                <ShieldCheck size={18} className="mt-1 text-burgundy" />
                <div>
                  <dt className="text-sm text-ink/55">Approval</dt>
                  <dd className="mt-0.5">{event.autoApprove ? 'Photos go to the screen as soon as they’re uploaded' : 'You approve each photo before it reaches the screen'}</dd>
                </div>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-wine/10 pt-6">
              <Button to={`/events/${event.id}/display`} size="sm">
                <MonitorPlay size={16} /> Open the screen
              </Button>
              <Button to={`/events/${event.id}/guest`} variant="secondary" size="sm">
                <Smartphone size={16} /> Guest page
              </Button>
              <Button to={`/events/${event.id}/moderation`} variant="secondary" size="sm">
                <Images size={16} /> Review photos
              </Button>
              <label className="ml-auto flex items-center gap-2 text-sm text-ink/65">
                Status
                <select
                  value={event.status}
                  onChange={(e) => setEventStatus(event.id, e.target.value)}
                  className="rounded-full border border-wine/20 bg-cream px-3 py-1.5 text-sm text-wine"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="ended">Ended</option>
                </select>
              </label>
            </div>
          </section>

          {/* Stats */}
          <section aria-label="Photo statistics">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <StatsCard icon={Images} label="Photos uploaded" value={stats.uploaded} highlight />
              <StatsCard icon={ShieldCheck} label="Approved" value={stats.approved} />
              <StatsCard icon={Clock} label="Waiting" value={stats.waiting} note={stats.waiting ? 'Needs your review' : 'All caught up'} />
              <StatsCard icon={Users} label="Guests" value={stats.guests} />
              <StatsCard icon={MonitorPlay} label="On the screen" value={stats.displayed} note="of 10 slots" />
            </div>
          </section>

          {/* Queue */}
          <section aria-label="Photo queue">
            <PhotoQueue
              waiting={waiting}
              approved={approved}
              onApprove={(ids) => setStatus(event.id, ids, 'approved')}
              onReject={(ids) => setStatus(event.id, ids, 'rejected')}
            />
          </section>
        </div>

        <aside className="space-y-6">
          <QRCodeCard event={event} />
          <div className="rounded-[24px] border border-wine/15 bg-ivory p-5">
            <p className="font-display text-2xl font-medium text-wine">Try it live</p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/65">
              Send a sample photo as if a guest had just uploaded it. Open the screen in another tab to watch it arrive.
            </p>
            <Button variant="secondary" size="sm" className="mt-4" onClick={() => simulateGuestUpload(event.id)}>
              <Wand2 size={16} /> Simulate a guest upload
            </Button>
          </div>
          <Link to="/events" className="block text-center text-sm text-ink/55 underline decoration-wine/20 underline-offset-4 hover:text-wine">
            Back to all events
          </Link>
        </aside>
      </div>
    </HostShell>
  );
}
