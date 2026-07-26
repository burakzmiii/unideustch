import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

const LOCK_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const LOCAL_KEY = 'grade_profile';

interface GradeProfile {
  gpa: number | null;
  savedAt: string | null;
}

interface GradeContextValue {
  gpa: number | null;
  isSaved: boolean;
  isLocked: boolean;
  lockDaysRemaining: number;
  saveGrade: (gpa: number) => Promise<void>;
  loading: boolean;
}

const GradeContext = createContext<GradeContextValue | undefined>(undefined);

export function GradeProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<GradeProfile>({ gpa: null, savedAt: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      try {
        const stored = localStorage.getItem(LOCAL_KEY);
        if (stored) setProfile(JSON.parse(stored));
      } catch {
        // ignore malformed storage
      }
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('profiles')
        .select('gpa, last_critical_edit_at')
        .eq('id', user.id)
        .maybeSingle();

      if (!cancelled) {
        if (data) {
          setProfile({ gpa: data.gpa, savedAt: data.last_critical_edit_at });
        }
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  const lockDaysRemaining = (() => {
    if (!profile.savedAt) return 0;
    const elapsed = Date.now() - new Date(profile.savedAt).getTime();
    const remaining = LOCK_DAYS * MS_PER_DAY - elapsed;
    return Math.max(0, Math.ceil(remaining / MS_PER_DAY));
  })();

  const isLocked = lockDaysRemaining > 0;
  const isSaved = profile.gpa !== null && profile.savedAt !== null;

  const saveGrade = async (gpa: number) => {
    const now = new Date().toISOString();
    const next: GradeProfile = { gpa, savedAt: now };

    if (!user) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
      setProfile(next);
      return;
    }

    await supabase
      .from('profiles')
      .update({ gpa, last_critical_edit_at: now })
      .eq('id', user.id);

    setProfile(next);
  };

  return (
    <GradeContext.Provider value={{ gpa: profile.gpa, isSaved, isLocked, lockDaysRemaining, saveGrade, loading }}>
      {children}
    </GradeContext.Provider>
  );
}

export function useGrade() {
  const ctx = useContext(GradeContext);
  if (!ctx) throw new Error('useGrade must be used within GradeProvider');
  return ctx;
}
