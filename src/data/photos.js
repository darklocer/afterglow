// Photo sources. Each photo gets an ordered list of candidates:
//   1. a local file you drop into /public/photos (e.g. wedding-1.jpg)
//   2. a keyword-matched stock photo for the demo
// <Photo> tries them in order and falls back to a tonal burgundy gradient,
// so the UI never shows a broken image.

export function photoSrcs(key, keywords, seed = 1, w = 900, h = 900) {
  return [
    `/photos/${key}-${(seed % 6) + 1}.jpg`,
    `https://loremflickr.com/${w}/${h}/${keywords}?lock=${seed + 10}`,
  ];
}

const WIDE_KEYWORDS = {
  wedding: 'wedding,bride,couple',
  birthday: 'birthday,party,cake',
  anniversary: 'anniversary,couple',
  graduation: 'graduation,graduate',
  babyshower: 'baby,balloons',
  engagement: 'engagement,couple',
  party: 'party,friends',
  corporate: 'conference,team',
  other: 'celebration,friends',
};

export function eventPhotoSrcs(type, seed) {
  // alternate portrait / landscape shapes for a natural-looking wall
  const portrait = seed % 3 !== 0;
  return photoSrcs(type, WIDE_KEYWORDS[type] ?? WIDE_KEYWORDS.other, seed, portrait ? 800 : 1000, portrait ? 1000 : 750);
}
