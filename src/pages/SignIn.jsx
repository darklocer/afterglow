import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import Button from '../components/Button';

export default function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setError('Enter an email address like name@example.com.');
    navigate('/events');
  };

  return (
    <div className="min-h-screen bg-cream">
      <SiteNav />
      <main className="mx-auto max-w-[460px] px-5 pt-10 sm:pt-20">
        <h1 className="text-5xl font-medium leading-none text-wine">Welcome back</h1>
        <p className="mt-4 text-ink/70">Sign in to manage your events and photos.</p>
        <form onSubmit={submit} className="mt-10 space-y-6" noValidate>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-ink/80">Email</span>
            <input className="field" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(''); }} placeholder="name@example.com" autoComplete="email" />
            {error && <span role="alert" className="mt-1.5 block text-sm text-burgundy">{error}</span>}
          </label>
          <Button type="submit" size="lg" className="w-full">Continue</Button>
        </form>
        <p className="mt-6 text-sm text-ink/55">
          This is a demo, so there’s no password. Continuing opens the sample events. New here?{' '}
          <Link to="/events/new" className="font-medium text-wine underline decoration-gold underline-offset-4">Create an event</Link>
        </p>
      </main>
    </div>
  );
}
