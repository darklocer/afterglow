import SiteNav from '../components/SiteNav';
import Button from '../components/Button';

export default function NotFound({ what = 'page' }) {
  return (
    <div className="min-h-screen bg-cream">
      <SiteNav />
      <main className="mx-auto max-w-xl px-5 pt-20 text-center">
        <h1 className="text-5xl font-medium leading-none text-wine">We can’t find that {what}</h1>
        <p className="mt-4 text-ink/70">The link may be old or mistyped. Your events are one click away.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button to="/events">Your events</Button>
          <Button to="/" variant="secondary">Home</Button>
        </div>
      </main>
    </div>
  );
}
