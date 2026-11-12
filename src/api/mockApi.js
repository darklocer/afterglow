// Mock backend. Everything the UI needs from a server goes through this file,
// so swapping in real endpoints later means replacing these functions only.
//
//   load()                       -> GET  /api/state
//   save(state)                  -> (server persists on every mutation)
//   uploadPhoto(file, onProgress)-> POST /api/events/:id/photos  (multipart)
//
// State lives in localStorage so a guest tab and a host tab update each other.

import { seedState } from '../data/mock';

const KEY = 'afterglow:v1';

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore corrupt storage */
  }
  return seedState();
}

export function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked: the app keeps working in memory */
  }
}

export function reset() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  return seedState();
}

// Downscale to keep demo storage small; a real backend would receive the file.
function toDataUrl(file, max = 900) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.72));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('That file could not be read as an image.'));
    };
    img.src = url;
  });
}

// Simulates network progress, then resolves with the stored photo source.
export async function uploadPhoto(file, onProgress) {
  const dataUrl = await toDataUrl(file);
  await new Promise((resolve) => {
    let p = 0;
    const tick = setInterval(() => {
      p = Math.min(100, p + 8 + Math.random() * 18);
      onProgress?.(Math.round(p));
      if (p >= 100) {
        clearInterval(tick);
        resolve();
      }
    }, 110);
  });
  return { srcs: [dataUrl] };
}
