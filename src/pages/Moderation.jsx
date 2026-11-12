import { useParams } from 'react-router-dom';
import { Wand2 } from 'lucide-react';
import HostShell from '../components/HostShell';
import PhotoModeration from '../components/PhotoModeration';
import Button from '../components/Button';
import NotFound from './NotFound';
import { useEvent, useStore } from '../store/EventStore';

export default function Moderation() {
  const { eventId } = useParams();
  const { setStatus, toggleFeature, deletePhotos, simulateGuestUpload } = useStore();
  const { event, photos, stats } = useEvent(eventId);
  if (!event) return <NotFound what="event" />;

  return (
    <HostShell event={event} stats={stats}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <p className="max-w-xl text-ink/70">
          Approve photos to send them to the screen. Star a photo to give it the large slot. Rejected photos stay hidden from guests and the screen.
        </p>
        <Button variant="secondary" size="sm" onClick={() => simulateGuestUpload(event.id)}>
          <Wand2 size={16} /> Simulate a guest upload
        </Button>
      </div>

      <PhotoModeration
        photos={photos}
        onStatus={(ids, status) => setStatus(event.id, ids, status)}
        onFeature={(id) => toggleFeature(event.id, id)}
        onDelete={(ids) => deletePhotos(event.id, ids)}
      />
    </HostShell>
  );
}
