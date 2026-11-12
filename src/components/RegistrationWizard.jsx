import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, CalendarDays, MapPin, Sparkles } from 'lucide-react';
import Button from './Button';
import Photo from './Photo';
import { photoSrcs } from '../data/photos';
import { useStore } from '../store/EventStore';
import { formatDate } from '../lib/format';

const STEPS = ['Event', 'Details', 'Customize', 'Ready'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const today = () => new Date().toISOString().slice(0, 10);

function Field({ label, hint, error, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-ink/80">{label}</span>
      {children}
      {error ? (
        <span role="alert" className="mt-1.5 block text-sm text-burgundy">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-sm text-ink/50">{hint}</span>
      ) : null}
    </label>
  );
}

function Choice({ selected, onClick, title, body }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-colors duration-200 ${
        selected ? 'border-wine bg-ivory shadow-soft' : 'border-wine/15 hover:border-wine/40'
      }`}
    >
      <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border ${selected ? 'border-wine bg-wine text-cream' : 'border-wine/30'}`}>
        {selected && <Check size={12} strokeWidth={3} />}
      </span>
      <span>
        <span className="block font-medium text-ink">{title}</span>
        <span className="mt-0.5 block text-sm text-ink/60">{body}</span>
      </span>
    </button>
  );
}

function Progress({ step }) {
  return (
    <nav aria-label="Progress" className="mb-12">
      <ol className="relative flex items-start justify-between">
        <div aria-hidden="true" className="absolute left-[18px] right-[18px] top-[17px] h-px bg-wine/15" />
        <motion.div
          aria-hidden="true"
          className="absolute left-[18px] top-[17px] h-px bg-wine"
          initial={false}
          animate={{ width: `calc((100% - 36px) * ${step / (STEPS.length - 1)})` }}
          transition={{ duration: 0.5, ease: [0.22, 0.7, 0.2, 1] }}
        />
        {STEPS.map((s, i) => {
          const done = i < step;
          const active = i === step;
          return (
            <li key={s} className="relative z-10 flex flex-col items-center gap-2" aria-current={active ? 'step' : undefined}>
              <span
                className={`grid h-9 w-9 place-items-center rounded-full border text-sm font-medium transition-colors duration-300 ${
                  done || active ? 'border-wine bg-wine text-cream' : 'border-wine/25 bg-cream text-ink/50'
                }`}
              >
                {done ? <Check size={16} strokeWidth={2.4} /> : i + 1}
              </span>
              <span className={`text-sm ${active ? 'font-medium text-wine' : 'text-ink/50'}`}>{s}</span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default function RegistrationWizard({ type }) {
  const navigate = useNavigate();
  const { createEvent } = useStore();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [tried, setTried] = useState(false);
  const [form, setForm] = useState({
    name: '',
    host: '',
    date: '',
    location: '',
    email: '',
    description: '',
    autoApprove: false,
    requireName: true,
    slideSeconds: 6,
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const put = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const errors = {};
  if (!form.name.trim()) errors.name = 'Give your event a name so guests know where they’ve landed.';
  if (!form.host.trim()) errors.host = 'Add the host’s name.';
  if (!form.date) errors.date = 'Choose the date of the event.';
  if (!form.location.trim()) errors.location = 'Add a venue or city.';
  if (!EMAIL_RE.test(form.email)) errors.email = 'Enter an email address like name@example.com.';

  const stepFields = [['name', 'host'], ['date', 'location', 'email'], [], []];
  const blocked = stepFields[step].some((k) => errors[k]);
  const show = (k) => (tried ? errors[k] : undefined);

  const go = (to) => {
    setDir(to > step ? 1 : -1);
    setStep(to);
    setTried(false);
  };
  const next = () => {
    if (blocked) return setTried(true);
    go(step + 1);
  };

  const finish = () => {
    const { name, host, date, location, email, description, autoApprove, requireName, slideSeconds } = form;
    const id = createEvent({
      name: name.trim(),
      type: type.id,
      host: host.trim(),
      date,
      location: location.trim(),
      email: email.trim(),
      description: description.trim(),
      autoApprove,
      requireName,
      slideSeconds,
    });
    navigate(`/events/${id}`, { state: { created: true } });
  };

  return (
    <div className="mx-auto w-full max-w-[640px]">
      <Progress step={step} />

      <AnimatePresence mode="wait" custom={dir}>
        <motion.div
          key={step}
          custom={dir}
          initial={{ opacity: 0, x: 28 * dir }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -28 * dir }}
          transition={{ duration: 0.32, ease: [0.22, 0.7, 0.2, 1] }}
        >
          {step === 0 && (
            <div className="space-y-8">
              <div>
                <h1 className="text-[clamp(2.4rem,5vw,3.6rem)] font-medium leading-[1.02] text-wine">{type.wizardTitle}</h1>
                <p className="mt-3 text-lg text-ink/70">{type.wizardIntro}</p>
              </div>

              <div className="flex items-center gap-4 rounded-2xl border border-wine/15 bg-ivory p-3 pr-5">
                <Photo srcs={photoSrcs(type.id, type.keywords, 41, 300, 300)} seed={type.id} className="h-16 w-16 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-ink/55">Occasion</p>
                  <p className="font-display text-2xl font-medium leading-tight text-wine">{type.label}</p>
                </div>
                <Link to={`/events/new?type=${type.id}`} className="text-sm font-medium text-wine underline decoration-gold underline-offset-4">
                  Change
                </Link>
              </div>

              <Field label="Event name" hint="This is the title guests and your screen will show." error={show('name')}>
                <input className="field" value={form.name} onChange={set('name')} placeholder={type.namePlaceholder} autoComplete="off" />
              </Field>
              <Field label={type.hostLabel} error={show('host')}>
                <input className="field" value={form.host} onChange={set('host')} placeholder={type.hostPlaceholder} autoComplete="name" />
              </Field>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-8">
              <div>
                <h1 className="text-[clamp(2.4rem,5vw,3.6rem)] font-medium leading-[1.02] text-wine">When and where?</h1>
                <p className="mt-3 text-lg text-ink/70">Guests see these on their upload page.</p>
              </div>
              <div className="grid gap-8 sm:grid-cols-2">
                <Field label="Event date" error={show('date')}>
                  <input type="date" min={today()} className="field" value={form.date} onChange={set('date')} />
                </Field>
                <Field label="Location" error={show('location')}>
                  <input className="field" value={form.location} onChange={set('location')} placeholder="Venue or city" autoComplete="off" />
                </Field>
              </div>
              <Field label="Your email" hint="We’ll send the guest link and QR code here." error={show('email')}>
                <input type="email" className="field" value={form.email} onChange={set('email')} placeholder="name@example.com" autoComplete="email" />
              </Field>
              <Field label="Description (optional)" hint="A line or two for your guests.">
                <textarea className="field min-h-[110px] resize-y" value={form.description} onChange={set('description')} placeholder="Add anything guests should know." />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-9">
              <div>
                <h1 className="text-[clamp(2.4rem,5vw,3.6rem)] font-medium leading-[1.02] text-wine">Make it yours</h1>
                <p className="mt-3 text-lg text-ink/70">You can change any of this later from your dashboard.</p>
              </div>

              <fieldset>
                <legend className="mb-3 text-sm font-medium text-ink/80">Which photos reach the screen?</legend>
                <div role="radiogroup" className="grid gap-3">
                  <Choice selected={!form.autoApprove} onClick={() => put('autoApprove', false)} title="I approve each photo" body="New photos wait in your queue until you approve them." />
                  <Choice selected={form.autoApprove} onClick={() => put('autoApprove', true)} title="Show every photo straight away" body="Photos go to the screen as soon as they’re uploaded. You can still remove any." />
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-3 text-sm font-medium text-ink/80">Guest names</legend>
                <div role="radiogroup" className="grid gap-3">
                  <Choice selected={form.requireName} onClick={() => put('requireName', true)} title="Ask guests for their name" body="Shows who shared each photo." />
                  <Choice selected={!form.requireName} onClick={() => put('requireName', false)} title="Upload without a name" body="Guests go straight to adding photos." />
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-3 text-sm font-medium text-ink/80">Time per photo on screen</legend>
                <div role="radiogroup" className="inline-flex rounded-full border border-wine/20 bg-ivory p-1">
                  {[4, 6, 8, 12].map((s) => (
                    <button
                      key={s}
                      type="button"
                      role="radio"
                      aria-checked={form.slideSeconds === s}
                      onClick={() => put('slideSeconds', s)}
                      className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${form.slideSeconds === s ? 'bg-wine text-cream' : 'text-ink/70 hover:text-wine'}`}
                    >
                      {s} sec
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div>
                <h1 className="text-[clamp(2.4rem,5vw,3.6rem)] font-medium leading-[1.02] text-wine">Ready when you are</h1>
                <p className="mt-3 text-lg text-ink/70">Check the details, then create your event. Your QR code is next.</p>
              </div>

              <div className="overflow-hidden rounded-[28px] border border-wine/15 bg-ivory shadow-soft">
                <Photo srcs={photoSrcs(type.id, type.keywords, 44, 1000, 500)} seed={`${type.id}-ready`} className="aspect-[2.2/1] w-full" />
                <div className="space-y-4 p-6">
                  <div>
                    <p className="text-sm text-ink/55">{type.label}</p>
                    <p className="font-display text-3xl font-medium text-wine">{form.name}</p>
                    <p className="text-ink/65">Hosted by {form.host}</p>
                  </div>
                  <dl className="grid gap-3 text-[15px] sm:grid-cols-2">
                    <div className="flex items-center gap-2.5"><CalendarDays size={18} className="text-burgundy" /><dd>{formatDate(form.date)}</dd></div>
                    <div className="flex items-center gap-2.5"><MapPin size={18} className="text-burgundy" /><dd>{form.location}</dd></div>
                    <div className="flex items-center gap-2.5 sm:col-span-2"><Sparkles size={18} className="text-burgundy" />
                      <dd>{form.autoApprove ? 'Photos go straight to the screen' : 'You approve each photo'} · {form.requireName ? 'guest names on' : 'no guest names'} · {form.slideSeconds} sec per photo</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 flex items-center justify-between gap-4">
        {step > 0 ? (
          <Button variant="secondary" onClick={() => go(step - 1)}>
            <ArrowLeft size={18} /> Back
          </Button>
        ) : (
          <Button to="/events/new" variant="secondary">
            <ArrowLeft size={18} /> Occasions
          </Button>
        )}
        {step < STEPS.length - 1 ? (
          <Button onClick={next}>
            Continue <ArrowRight size={18} />
          </Button>
        ) : (
          <Button onClick={finish}>Create event</Button>
        )}
      </div>
    </div>
  );
}
