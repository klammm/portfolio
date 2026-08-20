import { useEffect } from 'react';
import { useLocation } from 'react-router';

// Handles landing on "/#work" from another route (e.g. clicking "Work" while
// on /blog). A same-page anchor click already scrolls natively; this only
// needs to run on navigation/mount, matching the hash against an element id.
export function useScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = hash.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [hash]);
}
