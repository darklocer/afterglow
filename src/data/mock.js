import { eventPhotoSrcs } from './photos';

const GUESTS = [
  'Meera S.', 'Karthik R.', 'Aditi P.', 'Rohan D.', 'Ishaan K.', 'Tanvi B.', 'Farah Q.', 'Dev M.',
  'Sneha L.', 'Vikram T.', 'Nisha G.', 'Arun J.', 'Pooja V.', 'Zoya A.', 'Harsh C.', 'Lata N.',
];

function makePhotos(eventId, type, count, baseSeed) {
  const now = Date.now();
  return Array.from({ length: count }, (_, i) => {
    let status = 'approved';
    if (i % 5 === 3) status = 'waiting';
    if (i >= count - 4) status = 'waiting';
    if (i === 7) status = 'rejected';
    return {
      id: `${eventId}-p${i + 1}`,
      eventId,
      srcs: eventPhotoSrcs(type, baseSeed + i),
      guest: GUESTS[(i * 5 + baseSeed) % GUESTS.length],
      status,
      featured: i === 0 || i === 4,
      createdAt: now - (count - i) * 1000 * 60 * 4,
    };
  });
}

const events = [
  {
    id: 'ananya-rahul',
    name: 'Ananya & Rahul’s Wedding',
    type: 'wedding',
    host: 'Ananya Mehta',
    email: 'ananya@example.com',
    date: '2026-12-12',
    location: 'Jaipur, Rajasthan',
    description: 'Three days of celebration. Add everything you shoot.',
    code: 'AR-1212',
    status: 'live',
    requireName: true,
    autoApprove: false,
    slideSeconds: 6,
    demo: true,
  },
  {
    id: 'arjun-21',
    name: 'Arjun’s 21st Birthday',
    type: 'birthday',
    host: 'Arjun Nair',
    email: 'arjun@example.com',
    date: '2026-11-22',
    location: 'Kochi, Kerala',
    description: 'Rooftop dinner, then everything after.',
    code: 'AN-2122',
    status: 'upcoming',
    requireName: false,
    autoApprove: true,
    slideSeconds: 5,
    demo: true,
  },
  {
    id: 'grad-night-2026',
    name: 'Graduation Night 2026',
    type: 'graduation',
    host: 'Kavya Iyer',
    email: 'kavya@example.com',
    date: '2026-06-14',
    location: 'Bengaluru, Karnataka',
    description: 'Batch of 2026. One last night on campus.',
    code: 'GN-2026',
    status: 'ended',
    requireName: false,
    autoApprove: false,
    slideSeconds: 6,
    demo: false,
  },
  {
    id: 'neha-vishal',
    name: 'Neha & Vishal’s Engagement',
    type: 'engagement',
    host: 'Neha Sharma',
    email: 'neha@example.com',
    date: '2027-01-09',
    location: 'Udaipur, Rajasthan',
    description: 'A small evening with the people who matter most.',
    code: 'NV-0109',
    status: 'upcoming',
    requireName: true,
    autoApprove: false,
    slideSeconds: 6,
    demo: false,
  },
];

const photosByEvent = {
  'ananya-rahul': makePhotos('ananya-rahul', 'wedding', 30, 1),
  'arjun-21': makePhotos('arjun-21', 'birthday', 22, 40),
  'grad-night-2026': makePhotos('grad-night-2026', 'graduation', 26, 80),
  'neha-vishal': makePhotos('neha-vishal', 'engagement', 16, 120),
};

export const seedState = () => ({
  events: structuredClone(events),
  photos: structuredClone(photosByEvent),
});

export const GUEST_NAMES = GUESTS;
