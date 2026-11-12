import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import EventCircle from './EventCircle';
import { ORBIT_TYPES } from '../data/eventTypes';

// Animation timeline (seconds from mount)
export const TIMELINE = {
  headline: 0.2,
  message: 0.9,
  firstPop: 1.5, // photographs begin to pop in
  popGap: 0.18, // stagger between photographs
  orbitStart: 2.2, // photographs spread out into the orbit and start moving
  orbitRamp: 2.8,
  cta: 3.4,
};

const N = ORBIT_TYPES.length;
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/**
 * Photographs float on an elliptical path around the centre. Photos at the
 * bottom of the ellipse are "closer": larger, brighter, drawn on top. Photos at
 * the top recede: smaller, softer, drawn beneath the headline.
 * `children` sits in the middle and never moves.
 */
export default function HeroOrbit({ children }) {
  const stageRef = useRef(null);
  const nodes = useRef([]);
  const [size, setSize] = useState({ w: 1200, h: 720 });
  const reduced = useReducedMotion();

  const rx = Math.min(size.w * 0.41, 600);
  const ry = size.h * 0.37;

  // The animation loop reads these refs, so a window resize never restarts the timeline.
  const dims = useRef({ rx, ry });
  dims.current = { rx, ry };
  const state = useRef({ base: 0.35, t: 0, ramp: 0 });

  useEffect(() => {
    const el = stageRef.current;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  const place = useCallback(() => {
    const { rx: a, ry: b } = dims.current;
    const { base, t, ramp } = state.current;
    const rf = 0.55 + 0.45 * ramp;
    nodes.current.forEach((node, i) => {
      if (!node) return;
      const th = base + (i * Math.PI * 2) / N;
      const depth = (Math.sin(th) + 1) / 2;
      const x = Math.cos(th) * a * rf;
      const y = Math.sin(th) * b * rf;
      const bob = Math.sin(t * 0.9 + i * 1.7) * 6 * ramp;
      const tilt = Math.sin(t * 0.45 + i) * 3 * ramp;
      const scale = 0.76 + 0.34 * depth;
      node.style.transform = `translate3d(${x.toFixed(1)}px, ${(y + bob).toFixed(1)}px, 0) translate(-50%, -50%) rotate(${tilt.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      node.style.zIndex = String(Math.round(depth * 10));
      node.style.opacity = (0.55 + 0.45 * depth).toFixed(2);
    });
  }, []);

  // Reduced motion: a still, fully arranged composition.
  useEffect(() => {
    if (!reduced) return;
    state.current = { base: 0.35, t: 0, ramp: 1 };
    place();
  }, [reduced, rx, ry, place]);

  useEffect(() => {
    if (reduced) return undefined;
    let raf;
    const start = performance.now();
    let last = start;
    const loop = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = (now - start) / 1000;
      const ramp = ease(clamp((t - TIMELINE.orbitStart) / TIMELINE.orbitRamp, 0, 1));
      state.current.base += dt * ((Math.PI * 2) / 80) * ramp; // one full turn every 80s
      state.current.t = t;
      state.current.ramp = ramp;
      place();
      raf = requestAnimationFrame(loop);
    };
    place();
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced, place]);

  return (
    <div ref={stageRef} className="relative mx-auto h-[700px] w-full max-w-[1400px] overflow-x-clip sm:h-[800px]">
      {/* the path the photographs follow */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-gold/35"
        style={{ width: rx * 2, height: ry * 2 }}
      />
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-wine/10"
        style={{ width: rx * 1.42, height: ry * 1.42 }}
      />

      {ORBIT_TYPES.map((type, i) => (
        <EventCircle
          key={type.id}
          ref={(el) => (nodes.current[i] = el)}
          type={type}
          index={i}
          reduced={reduced}
          popDelay={TIMELINE.firstPop + i * TIMELINE.popGap}
        />
      ))}

      {/* above every photograph, so a passing photo never covers the headline or button */}
      <div className="absolute inset-0 z-20 flex items-center justify-center px-6">{children}</div>
    </div>
  );
}
