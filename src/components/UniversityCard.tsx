import { MapPin, Star, Flame } from 'lucide-react';
import type { University } from '@/data/universities';
import { navigate } from '@/lib/router';
import { useDecision } from '@/context/DecisionContext';

export function UniversityCard({ university }: { university: University }) {
  const { universityCounts } = useDecision();
  const choiceCount = universityCounts[university.id] ?? university.studentChoiceCount;

  const avgRating =
    Math.round(
      ((university.ratings.easeOfAcceptance +
        university.ratings.easeOfGraduation +
        university.ratings.campusLife +
        university.ratings.facilities) /
        4) *
        10
    ) / 10;

  return (
    <button
      onClick={() => navigate(`/universities/${university.id}`)}
      className="group text-left bg-card rounded-2xl overflow-hidden border border-border hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300"
    >
      <div className="relative h-44 overflow-hidden">
        <img
          src={university.coverImage}
          alt={university.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-blue-600/80 text-blue-100 backdrop-blur-sm mb-2">
            {university.type}
          </span>
          <h3 className="text-white font-bold text-base leading-tight line-clamp-2 drop-shadow-lg">{university.name}</h3>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="flex items-center gap-1.5 text-sm text-text-muted">
            <MapPin className="w-3.5 h-3.5" />
            {university.city}, {university.state}
          </span>
          <span className="flex items-center gap-1 text-sm font-semibold text-amber-400">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            {avgRating}
          </span>
        </div>
        <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">{university.summary}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {university.highlights.slice(0, 2).map((h, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-blue-500/10 text-blue-300 rounded-md border border-blue-500/20">
              {h.length > 28 ? h.slice(0, 28) + '...' : h}
            </span>
          ))}
        </div>

        {/* Student Choice Badge */}
        <div className="mt-3 pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs font-medium text-orange-400 bg-orange-500/10 rounded-lg px-2.5 py-1.5 border border-orange-500/20">
            <Flame className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1">
              Bu platformdan <span className="font-bold tabular-nums">{choiceCount}</span> öğrenci bu üniversiteyi tercih etti
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
