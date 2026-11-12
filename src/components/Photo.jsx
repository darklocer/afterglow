import { useEffect, useMemo, useState } from 'react';

// Tonal fallback so a missing image still looks intentional.
function artFor(seed) {
  let h = 0;
  for (const c of String(seed)) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  // unsigned shifts only: a signed shift can go negative and index outside the palette
  const a = 8 + (h % 40);
  const b = 30 + ((h >>> 3) % 50);
  const tones = ['#5A1625', '#7A2638', '#9B5361', '#B8806F', '#C9A96E', '#8C3A4B'];
  const t1 = tones[h % tones.length];
  const t2 = tones[((h >>> 2) + 2) % tones.length];
  return {
    backgroundImage: `radial-gradient(120% 90% at ${a}% ${b}%, #FFF9EF55 0%, transparent 55%), linear-gradient(${(h % 180) + 20}deg, ${t1}, ${t2})`,
  };
}

/**
 * <Photo srcs={[...]} /> tries each source in order, fades the image in once
 * loaded, and keeps a gradient underneath if everything fails.
 */
export default function Photo({ srcs, seed = 'photo', alt = '', className = '', imgClassName = '', style, eager = false }) {
  const list = useMemo(() => (Array.isArray(srcs) ? srcs : [srcs]).filter(Boolean), [srcs]);
  const key = list.join('|');
  const [idx, setIdx] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setIdx(0);
    setLoaded(false);
  }, [key]);

  const src = list[idx];
  return (
    <div className={`${/\b(absolute|fixed)\b/.test(className) ? '' : 'relative'} overflow-hidden ${className}`} style={{ ...artFor(seed), ...style }}>
      {src && (
        <img
          key={src}
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          draggable="false"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false);
            setIdx((i) => i + 1);
          }}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${imgClassName}`}
        />
      )}
    </div>
  );
}
