import { useEffect, useState } from 'react';

export type Route =
  | { name: 'home' }
  | { name: 'universities' }
  | { name: 'university'; id: string }
  | { name: 'quiz' }
  | { name: 'dashboard' }
  | { name: 'forum' }
  | { name: 'forum-university'; id: string }
  | { name: 'question'; id: string }
  | { name: 'login' }
  | { name: 'signup' }
  | { name: 'profile' };

export function parseHash(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '');
  const parts = clean.split('/').filter(Boolean);

  if (parts.length === 0) return { name: 'home' };
  if (parts[0] === 'universities' && parts.length === 1) return { name: 'universities' };
  if (parts[0] === 'universities' && parts[1]) return { name: 'university', id: parts[1] };
  if (parts[0] === 'quiz') return { name: 'quiz' };
  if (parts[0] === 'dashboard') return { name: 'dashboard' };
  if (parts[0] === 'forum' && parts.length === 1) return { name: 'forum' };
  if (parts[0] === 'forum' && parts[1] && parts[1] !== 'question') return { name: 'forum-university', id: parts[1] };
  if (parts[0] === 'forum' && parts[1] === 'question' && parts[2]) return { name: 'question', id: parts[2] };
  if (parts[0] === 'login') return { name: 'login' };
  if (parts[0] === 'signup') return { name: 'signup' };
  if (parts[0] === 'profile') return { name: 'profile' };
  return { name: 'home' };
}

export function navigate(path: string) {
  window.location.hash = path.startsWith('#') ? path : `#${path}`;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const handler = () => {
      setRoute(parseHash(window.location.hash));
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, []);

  return route;
}
