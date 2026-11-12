import { Navigate, useSearchParams } from 'react-router-dom';
import SiteNav from '../components/SiteNav';
import RegistrationWizard from '../components/RegistrationWizard';
import { EVENT_TYPES } from '../data/eventTypes';

export default function Register() {
  const [params] = useSearchParams();
  const type = EVENT_TYPES.find((t) => t.id === params.get('type'));

  // Registration always follows the occasion step.
  if (!type) return <Navigate to="/events/new" replace />;

  return (
    <div className="min-h-screen bg-cream pb-24">
      <SiteNav />
      <main className="px-5 pt-6 sm:px-8 sm:pt-12">
        <RegistrationWizard key={type.id} type={type} />
      </main>
    </div>
  );
}
