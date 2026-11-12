import { EVENT_TYPES } from '../data/eventTypes';
import EventCard from './EventCard';

export default function EventSelector({ value, onChange }) {
  return (
    <div role="radiogroup" aria-label="Event type" className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
      {EVENT_TYPES.map((t, i) => (
        <EventCard key={t.id} type={t} index={i} selected={value === t.id} onSelect={onChange} />
      ))}
    </div>
  );
}
