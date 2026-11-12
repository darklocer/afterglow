export function formatDate(iso, opts = { day: 'numeric', month: 'long', year: 'numeric' }) {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString('en-IN', opts);
}

export function guestLink(eventId) {
  return `${window.location.origin}/events/${eventId}/guest`;
}

export function timeAgo(ts) {
  const s = Math.max(1, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return 'just now';
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} h ago`;
  return `${Math.round(h / 24)} d ago`;
}

export const STATUS_LABEL = { live: 'Live', upcoming: 'Upcoming', ended: 'Ended' };
