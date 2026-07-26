import { useEffect, useState } from 'react';
import { MessageSquare, ChevronRight, Search, PlusCircle, Filter } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { universities } from '@/data/universities';
import { navigate } from '@/lib/router';

const TOPICS = ['Tümü', 'Konaklama', 'Vize', 'Staj', 'Dersler', 'Burs', 'Genel'] as const;

export function ForumPage() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const cities = [...new Set(universities.map((u) => u.city))].sort();

  useEffect(() => {
    loadCounts();
  }, []);

  async function loadCounts() {
    const { data } = await supabase.from('questions').select('university_id');
    const countMap: Record<string, number> = {};
    (data || []).forEach((row: { university_id: string }) => {
      countMap[row.university_id] = (countMap[row.university_id] || 0) + 1;
    });
    setCounts(countMap);
    setLoading(false);
  }

  const filtered = universities.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.city.toLowerCase().includes(search.toLowerCase());
    const matchesCity = cityFilter === 'all' || u.city === cityFilter;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-2">Topluluk Forumu</h1>
        <p className="text-slate-400">Üniversiteye özel soru-cevap bölümü. Deneyimlerinizi paylaşın, bilgi alın.</p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Üniversite ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 outline-none text-slate-200 placeholder:text-slate-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-blue-500 outline-none text-slate-200 appearance-none"
          >
            <option value="all">Tüm Şehirler</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Topic tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TOPICS.map((topic) => (
          <span
            key={topic}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-card border border-border text-slate-400 cursor-default"
          >
            {topic}
          </span>
        ))}
      </div>

      <div className="bg-card/50 border border-blue-500/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <PlusCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-slate-300">
          Soru sormak ve cevap vermek için{' '}
          <button onClick={() => navigate('/login')} className="font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-2">giriş yapın</button>{' '}
          veya{' '}
          <button onClick={() => navigate('/signup')} className="font-semibold text-blue-400 hover:text-blue-300 underline underline-offset-2">kayıt olun</button>.
        </p>
      </div>

      {/* University list */}
      <div className="space-y-2">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-slate-500 mt-3 text-sm">Yükleniyor...</p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-slate-500 py-12">Üniversite bulunamadı.</p>
        ) : (
          filtered.map((u) => (
            <button
              key={u.id}
              onClick={() => navigate(`/forum/${u.id}`)}
              className="w-full flex items-center gap-4 p-4 bg-card rounded-xl border border-border hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all text-left group"
            >
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex-shrink-0 border border-blue-500/20">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-200 truncate group-hover:text-blue-300 transition-colors">{u.name}</h3>
                <p className="text-sm text-slate-500">{u.city}, {u.state}</p>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                {counts[u.id] > 0 && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {counts[u.id]} soru
                  </span>
                )}
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
