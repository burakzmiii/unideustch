import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { universities } from '@/data/universities';
import { UniversityCard } from '@/components/UniversityCard';

export function UniversitiesPage() {
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'rating'>('rating');

  const states = useMemo(() => [...new Set(universities.map((u) => u.state))].sort(), []);
  const types = useMemo(() => [...new Set(universities.map((u) => u.type))], []);

  const filtered = useMemo(() => {
    let result = universities.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.city.toLowerCase().includes(search.toLowerCase()) ||
        u.state.toLowerCase().includes(search.toLowerCase());
      const matchesState = stateFilter === 'all' || u.state === stateFilter;
      const matchesType = typeFilter === 'all' || u.type === typeFilter;
      return matchesSearch && matchesState && matchesType;
    });

    if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result = [...result].sort((a, b) => {
        const avgA = (a.ratings.easeOfAcceptance + a.ratings.easeOfGraduation + a.ratings.campusLife + a.ratings.facilities) / 4;
        const avgB = (b.ratings.easeOfAcceptance + b.ratings.easeOfGraduation + b.ratings.campusLife + b.ratings.facilities) / 4;
        return avgB - avgA;
      });
    }

    return result;
  }, [search, stateFilter, typeFilter, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-100 mb-2">Almanya Üniversiteleri</h1>
        <p className="text-slate-400">Uluslararası öğrenciler için en çok tercih edilen 30 üniversite</p>
      </div>

      {/* Filters */}
      <div className="bg-card rounded-2xl border border-border p-4 mb-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Üniversite, şehir veya eyalet ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 outline-none text-slate-200 placeholder:text-slate-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Eyalet</label>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface border border-border focus:border-blue-500 outline-none text-slate-200 text-sm"
            >
              <option value="all">Tüm Eyaletler</option>
              {states.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Kurum Türü</label>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-surface border border-border focus:border-blue-500 outline-none text-slate-200 text-sm"
            >
              <option value="all">Tüm Türler</option>
              {types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">Sıralama</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'rating')}
              className="w-full px-3 py-2 rounded-xl bg-surface border border-border focus:border-blue-500 outline-none text-slate-200 text-sm"
            >
              <option value="rating">Puana Göre</option>
              <option value="name">İsme Göre (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">
          <span className="font-semibold text-slate-300">{filtered.length}</span> üniversite bulundu
        </p>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <SlidersHorizontal className="w-12 h-12 mx-auto text-slate-600 mb-4" />
          <p className="text-slate-400 text-lg">Arama kriterlerinize uygun üniversite bulunamadı.</p>
          <button
            onClick={() => { setSearch(''); setStateFilter('all'); setTypeFilter('all'); }}
            className="mt-4 text-blue-400 font-medium hover:underline"
          >
            Filtreleri Temizle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((u) => <UniversityCard key={u.id} university={u} />)}
        </div>
      )}
    </div>
  );
}
