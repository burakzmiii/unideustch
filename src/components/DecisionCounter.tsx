import { useEffect, useState } from 'react';
import { Sparkles, MapPin, Loader2, CheckCircle2, TrendingUp, GraduationCap } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useDecision } from '@/context/DecisionContext';
import { universities } from '@/data/universities';

const STORAGE_KEY = 'has_decided';

interface CityTally {
  city: string;
  count: number;
}

export function DecisionCounter() {
  const { user } = useAuth();
  const { hasDecided, decidedUniversityId, submitDecision } = useDecision();
  const [total, setTotal] = useState(0);
  const [cityTallies, setCityTallies] = useState<CityTally[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [selectedUniversityId, setSelectedUniversityId] = useState('uni-bremen');
  const [justDecided, setJustDecided] = useState(false);

  const selectedUniversity = universities.find((u) => u.id === selectedUniversityId);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { count } = await supabase
        .from('decisions')
        .select('*', { count: 'exact', head: true });

      if (cancelled) return;
      setTotal(count ?? 0);

      const { data } = await supabase
        .from('decisions')
        .select('city');

      if (cancelled) return;
      if (data) {
        const tallyMap = new Map<string, number>();
        for (const row of data) {
          tallyMap.set(row.city, (tallyMap.get(row.city) ?? 0) + 1);
        }
        const tallies = Array.from(tallyMap.entries())
          .map(([city, count]) => ({ city, count }))
          .sort((a, b) => b.count - a.count);
        setCityTallies(tallies);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const handleDecide = async () => {
    if (hasDecided || !selectedUniversity) return;
    setSubmitting(true);

    const { error } = await supabase
      .from('decisions')
      .insert({
        city: selectedUniversity.city,
        university_id: selectedUniversity.id,
        user_id: user?.id ?? null,
      });

    setSubmitting(false);

    if (error) {
      return;
    }

    await submitDecision(selectedUniversity.id, selectedUniversity.city);
    setJustDecided(true);
    setTotal((prev) => prev + 1);
    setCityTallies((prev) => {
      const city = selectedUniversity.city;
      const existing = prev.find((t) => t.city === city);
      if (existing) {
        return prev.map((t) => t.city === city ? { ...t, count: t.count + 1 } : t)
          .sort((a, b) => b.count - a.count);
      }
      return [...prev, { city, count: 1 }].sort((a, b) => b.count - a.count);
    });
  };

  const maxTally = Math.max(1, ...cityTallies.map((t) => t.count));

  return (
    <div className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:border-blue-600/40 animate-slide-up">
      <div className="flex items-center gap-2 mb-1">
        <Sparkles className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-text">Kararımı Verdim!</h2>
      </div>
      <p className="text-xs text-text-subtle mb-5">Hedef üniversiteni seç, topluluğa katıl</p>

      {/* Total counter */}
      <div className="mb-5 p-4 bg-gradient-to-br from-blue-600/15 to-emerald-500/10 border border-blue-600/30 rounded-xl text-center">
        {loading ? (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
          </div>
        ) : (
          <>
            <p className="text-3xl font-bold text-text tabular-nums">{total}</p>
            <p className="text-sm text-text-muted mt-1">
              Öğrenci Platform Sayesinde Hedef Üniversitesini Seçti!
            </p>
          </>
        )}
      </div>

      {/* Decision form */}
      {!hasDecided ? (
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-text-muted mb-1.5">
              <GraduationCap className="w-4 h-4 inline mr-1" />
              Hedef Üniversiten
            </label>
            <select
              value={selectedUniversityId}
              onChange={(e) => setSelectedUniversityId(e.target.value)}
              className="w-full bg-input-bg border border-border rounded-xl px-3 py-2.5 text-text text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
            >
              {universities.map((uni) => (
                <option key={uni.id} value={uni.id}>{uni.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleDecide}
            disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/30 disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Kararımı Verdim!
          </button>
        </div>
      ) : (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <p className="text-sm text-emerald-500">
            {justDecided ? 'Kararın kaydedildi! Sen de listedesin.' : 'Zaten kararını verdin.'}
          </p>
        </div>
      )}

      {/* City distribution */}
      {cityTallies.length > 0 && (
        <div className="mt-5 pt-5 border-t border-border">
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-medium text-text-muted">Şehir Dağılımı</h3>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {cityTallies.map((tally) => (
              <div key={tally.city} className="flex items-center gap-3">
                <span className="text-xs text-text-muted w-20 flex-shrink-0 truncate">{tally.city}</span>
                <div className="flex-1 h-2 bg-surface-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${(tally.count / maxTally) * 100}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-text w-16 text-right">
                  {tally.count} Öğrenci
                </span>
              </div>
            ))}
          </div>
          {cityTallies.length > 0 && (
            <p className="text-xs text-text-subtle mt-3">
              {cityTallies[0].count} Öğrenci {cityTallies[0].city} Seçti
              {cityTallies[1] ? `, ${cityTallies[1].count} Öğrenci ${cityTallies[1].city} Seçti` : ''}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
