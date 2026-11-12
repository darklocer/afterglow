import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import NewEvent from './pages/NewEvent';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Guest from './pages/Guest';
import Moderation from './pages/Moderation';
import Display from './pages/Display';
import Events from './pages/Events';
import SignIn from './pages/SignIn';
import NotFound from './pages/NotFound';

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // let the page render before scrolling to an in-page anchor
      const id = hash.slice(1);
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }));
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/events" element={<Events />} />
        <Route path="/events/new" element={<NewEvent />} />
        <Route path="/events/register" element={<Register />} />
        <Route path="/events/:eventId" element={<Dashboard />} />
        <Route path="/events/:eventId/guest" element={<Guest />} />
        <Route path="/events/:eventId/moderation" element={<Moderation />} />
        <Route path="/events/:eventId/display" element={<Display />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
