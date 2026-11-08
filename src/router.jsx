import React, { useState, useEffect } from 'react';

export function useRouter() {
  const [pathWithSearch, setPathWithSearch] = useState(
    () => window.location.pathname + window.location.search
  );

  const scrollToTop = () => {
    // Forcer le scroll tout en haut sur window, document et documentElement
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  };

  useEffect(() => {
    const onPopState = () => {
      setPathWithSearch(window.location.pathname + window.location.search);
      scrollToTop();
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = (to) => {
    if (to === pathWithSearch) {
      scrollToTop();
      return;
    }
    window.history.pushState({}, '', to);
    setPathWithSearch(window.location.pathname + window.location.search);
    scrollToTop();
  };

  return {
    pathname: window.location.pathname,
    search: window.location.search,
    navigate
  };
}

export const RouterContext = React.createContext({
  pathname: '/',
  search: '',
  navigate: () => {}
});

export function Link({ to, children, className = '', title, onClick }) {
  const { navigate } = React.useContext(RouterContext);
  return (
    <a
      href={to}
      title={title}
      className={className}
      onClick={(e) => {
        if (onClick) onClick(e);
        if (!e.defaultPrevented && e.button === 0 && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          navigate(to);
        }
      }}
    >
      {children}
    </a>
  );
}

export function NavLink({ to, end, className, children }) {
  const { pathname, navigate } = React.useContext(RouterContext);
  const cleanTarget = to.split('?')[0];
  const isActive = end ? pathname === cleanTarget : pathname.startsWith(cleanTarget);
  const resolvedClass = typeof className === 'function' ? className({ isActive }) : className;

  return (
    <a
      href={to}
      className={resolvedClass}
      onClick={(e) => {
        if (e.button === 0 && !e.metaKey && !e.ctrlKey) {
          e.preventDefault();
          navigate(to);
        }
      }}
    >
      {children}
    </a>
  );
}

export function useLocation() {
  const { pathname, search } = React.useContext(RouterContext);
  return { pathname, search };
}

export function useSearchParams() {
  const { search } = React.useContext(RouterContext);
  const params = React.useMemo(() => new URLSearchParams(search), [search]);
  return [params];
}

