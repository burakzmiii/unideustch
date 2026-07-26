import { GraduationCap, Menu, X, Home, Building2, HelpCircle, MessageSquare, LogIn, LogOut, User, LayoutDashboard, Settings } from 'lucide-react';
import { useState } from 'react';
import { navigate, useRoute } from '@/lib/router';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const [open, setOpen] = useState(false);
  const route = useRoute();
  const { user, signOut } = useAuth();

  const links = [
    { label: 'Ana Sayfa', path: '/', icon: Home, routeName: 'home' },
    { label: 'Üniversiteler', path: '/universities', icon: Building2, routeName: 'universities' },
    { label: 'Quiz', path: '/quiz', icon: HelpCircle, routeName: 'quiz' },
    { label: 'Forum', path: '/forum', icon: MessageSquare, routeName: 'forum' },
    ...(user ? [{ label: 'Panel', path: '/dashboard', icon: LayoutDashboard, routeName: 'dashboard' }] : []),
    ...(user ? [{ label: 'Profil', path: '/profile', icon: Settings, routeName: 'profile' }] : []),
  ];

  const isActive = (routeName: string) => {
    if (routeName === 'universities') return route.name === 'universities' || route.name === 'university';
    if (routeName === 'forum') return route.name === 'forum' || route.name === 'forum-university' || route.name === 'question';
    return route.name === routeName;
  };

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-md border-b border-border transition-colors duration-300">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => { navigate('/'); setOpen(false); }}
            className="flex items-center gap-2.5 text-text font-bold text-lg"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/20">
              <GraduationCap className="w-5 h-5" />
            </span>
            <span className="hidden sm:inline bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent font-extrabold">
              UniDeutsch
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.routeName);
              return (
                <button
                  key={link.path}
                  onClick={() => navigate(link.path)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-blue-600/15 text-blue-400 shadow-inner'
                      : 'text-text-muted hover:bg-card hover:text-text'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </button>
              );
            })}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <span className="flex items-center gap-2 text-sm text-text-muted px-3">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-text max-w-[120px] truncate">{user.user_metadata?.name || user.email}</span>
                </span>
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-text-muted hover:bg-card hover:text-text transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-text-muted hover:bg-card hover:text-text transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Giriş
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                >
                  Kayıt Ol
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-text-muted hover:bg-card"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-border py-3 space-y-1 animate-fade-in">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.path}
                  onClick={() => { navigate(link.path); setOpen(false); }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-text hover:bg-card"
                >
                  <Icon className="w-4 h-4 text-text-muted" />
                  {link.label}
                </button>
              );
            })}
            <div className="pt-2 border-t border-border space-y-1">
              {user ? (
                <button
                  onClick={() => { signOut(); setOpen(false); }}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-text hover:bg-card"
                >
                  <LogOut className="w-4 h-4 text-text-muted" />
                  Çıkış
                </button>
              ) : (
                <>
                  <button
                    onClick={() => { navigate('/login'); setOpen(false); }}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-text hover:bg-card"
                  >
                    <LogIn className="w-4 h-4 text-text-muted" />
                    Giriş
                  </button>
                  <button
                    onClick={() => { navigate('/signup'); setOpen(false); }}
                    className="w-full px-3 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 text-white text-center"
                  >
                    Kayıt Ol
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
