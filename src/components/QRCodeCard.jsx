import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Check, Copy, ExternalLink } from 'lucide-react';
import { guestLink } from '../lib/format';

export default function QRCodeCard({ event }) {
  const [copied, setCopied] = useState(false);
  const link = guestLink(event.id);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = link;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="rounded-[28px] border border-wine/15 bg-ivory p-6">
      <div className="mx-auto w-fit rounded-2xl border border-wine/10 bg-white p-4">
        <QRCodeSVG value={link} size={176} fgColor="#3B0D18" bgColor="#ffffff" level="M" />
      </div>
      <p className="mt-5 text-center text-sm text-ink/60">Event code</p>
      <p className="text-center font-display text-4xl font-medium tracking-wide text-wine">{event.code}</p>

      <div className="mt-5 flex items-center gap-2 rounded-2xl border border-wine/15 bg-cream px-4 py-3">
        <p className="min-w-0 flex-1 truncate text-sm text-ink/70" title={link}>{link.replace(/^https?:\/\//, '')}</p>
        <button
          onClick={copy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-wine transition-colors hover:bg-wine/5"
          aria-live="polite"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied' : 'Copy link'}
        </button>
      </div>
      <a
        href={`/events/${event.id}/guest`}
        target="_blank"
        rel="noreferrer"
        className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-wine underline decoration-gold underline-offset-4"
      >
        Preview the guest page <ExternalLink size={14} />
      </a>
    </div>
  );
}
