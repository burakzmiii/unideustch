import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { universities as initialUniversities, type University } from '@/data/universities';

interface DecisionContextValue {
  universityCounts: Record<string, number>;
  hasDecided: boolean;
  decidedUniversityId: string | null;
  submitDecision: (universityId: string, city: string) => Promise<boolean>;
  resetDecision: () => void;
}

const DecisionContext = createContext<DecisionContextValue | undefined>(undefined);

const STORAGE_KEY = 'has_decided';
const STORAGE_UNI_KEY = 'decided_university_id';

export function DecisionProvider({ children }: { children: ReactNode }) {
  const [universityCounts, setUniversityCounts] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    for (const u of initialUniversities) map[u.id] = u.studentChoiceCount;
    return map;
  });
  const [hasDecided, setHasDecided] = useState(false);
  const [decidedUniversityId, setDecidedUniversityId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) === 'true';
    const storedUni = localStorage.getItem(STORAGE_UNI_KEY);
    setHasDecided(stored);
    setDecidedUniversityId(storedUni);
  }, []);

  const submitDecision = useCallback(async (universityId: string, _city: string): Promise<boolean> => {
    // Optimistic update
    setUniversityCounts((prev) => ({
      ...prev,
      [universityId]: (prev[universityId] ?? 0) + 1,
    }));
    setHasDecided(true);
    setDecidedUniversityId(universityId);
    localStorage.setItem(STORAGE_KEY, 'true');
    localStorage.setItem(STORAGE_UNI_KEY, universityId);
    return true;
  }, []);

  const resetDecision = useCallback(() => {
    setHasDecided(false);
    setDecidedUniversityId(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_UNI_KEY);
  }, []);

  return (
    <DecisionContext.Provider value={{ universityCounts, hasDecided, decidedUniversityId, submitDecision, resetDecision }}>
      {children}
    </DecisionContext.Provider>
  );
}

export function useDecision() {
  const ctx = useContext(DecisionContext);
  if (!ctx) throw new Error('useDecision must be used within DecisionProvider');
  return ctx;
}

export function getUniversityChoiceCount(id: string, counts: Record<string, number>, baseData: University[]): number {
  return counts[id] ?? baseData.find((u) => u.id === id)?.studentChoiceCount ?? 0;
}
