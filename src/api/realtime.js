// Real-time channel. The UI only calls subscribe(); how updates arrive is
// hidden here. Today: the browser's `storage` event, which fires in every
// other open tab (guest phone tab -> host dashboard tab -> display tab).
//
// To go live, replace the body with a WebSocket / SSE / Supabase channel:
//   const ws = new WebSocket(`${WS_URL}/events/${eventId}`);
//   ws.onmessage = () => handler();
//   return () => ws.close();

export function subscribe(handler) {
  const onStorage = (e) => {
    if (e.key === 'afterglow:v1') handler();
  };
  window.addEventListener('storage', onStorage);
  return () => window.removeEventListener('storage', onStorage);
}
