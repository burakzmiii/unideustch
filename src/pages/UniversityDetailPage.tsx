import { ArrowLeft, MapPin, CheckCircle2, AlertTriangle, FileText, MessageSquare, Star, Building2, Flame } from 'lucide-react';
import { getUniversityById } from '@/data/universities';
import { navigate } from '@/lib/router';
import { RatingBar } from '@/components/RatingBar';
import { useDecision } from '@/context/DecisionContext';

export function UniversityDetailPage({ id }: { id: string }) {
  const university = getUniversityById(id);
  const { universityCounts } = useDecision();

  const choiceCount = university ? (universityCounts[university.id] ?? university.studentChoiceCount) : 0;

  if (!university) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-text-muted text-lg mb-4">Üniversite bulunamadı.</p>
        <button onClick={() => navigate('/universities')} className="text-blue-400 font-medium hover:underline">
          Üniversite listesine dön
        </button>
      </div>
    );
  }

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
    <div className="animate-fade-in">
      {/* Cover */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img src={university.coverImage} alt={university.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-5xl mx-auto">
            <button
              onClick={() => navigate('/universities')}
              className="flex items-center gap-2 text-text-muted hover:text-text mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Üniversiteler
            </button>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-600/80 text-blue-100 backdrop-blur-sm mb-3">
              {university.type}
            </span>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-2">{university.name}</h1>
            <div className="flex items-center gap-4 text-text-muted">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {university.city}, {university.state}
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {avgRating}/10
              </span>
            </div>
            <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-orange-400 bg-orange-500/15 rounded-lg px-3 py-1.5 border border-orange-500/30 backdrop-blur-sm">
              <Flame className="w-4 h-4 flex-shrink-0" />
              <span>Bu platformdan <span className="font-bold tabular-nums">{choiceCount}</span> öğrenci bu üniversiteyi tercih etti</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Summary */}
        <section className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-xl font-bold text-text mb-3">Genel Bakış</h2>
          <p className="text-text-muted leading-relaxed">{university.summary}</p>
        </section>

        {/* Highlights */}
        <section className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-xl font-bold text-text mb-4">Öne Çıkan Özellikler</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {university.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="text-text-muted">{h}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Ratings */}
        <section className="bg-card rounded-2xl border border-border p-6">
          <h2 className="text-xl font-bold text-text mb-1">Objektif Değerlendirmeler</h2>
          <p className="text-sm text-text-subtle mb-5">1-10 arası puanlama (10 en iyi)</p>
          <div className="space-y-4">
            <RatingBar label="Kabul Kolaylığı" value={university.ratings.easeOfAcceptance} description="Uluslararası öğrencilerin kabul alma olasılığı" />
            <RatingBar label="Mezuniyet Kolaylığı" value={university.ratings.easeOfGraduation} description="Programın tamamlanma kolaylığı ve esneklik" />
            <RatingBar label="Kampüs Hayatı" value={university.ratings.campusLife} description="Sosyal etkinlikler, öğrenci toplulukları ve kültürel yaşam" />
            <RatingBar label="Olanaklar ve Altyapı" value={university.ratings.facilities} description="Kütüphane, laboratuvar, spor tesisleri" />
            <RatingBar label="Zorluklar" value={university.ratings.challenges} description="Yüksek puan = daha fazla zorluk" />
          </div>
        </section>

        {/* Challenges */}
        <section className="bg-amber-500/5 rounded-2xl border border-amber-500/20 p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold text-text">Zorluklar ve Meydan Okumalar</h2>
          </div>
          <ul className="space-y-2.5">
            {university.challengeNotes.map((c, i) => (
              <li key={i} className="flex items-start gap-2.5 text-text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </section>

        {/* Application Notes */}
        <section className="bg-card rounded-2xl border border-border p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-text">Başvuru ve Kabul Bilgileri</h2>
          </div>
          <ul className="space-y-2.5">
            {university.applicationNotes.map((a, i) => (
              <li key={i} className="flex items-start gap-2.5 text-text-muted">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0" />
                {a}
              </li>
            ))}
          </ul>
        </section>

        {/* Forum CTA */}
        <section className="bg-gradient-to-br from-blue-600/20 to-emerald-600/10 rounded-2xl border border-blue-500/20 p-6 text-center">
          <Building2 className="w-10 h-10 mx-auto mb-3 text-blue-400" />
          <h2 className="text-xl font-bold text-text mb-2">Bu Üniversite Hakkında Sorunuz mu Var?</h2>
          <p className="text-text-muted mb-4">Topluluk forumunda bu üniversiteye özel soru sorun veya cevaplayın.</p>
          <button
            onClick={() => navigate(`/forum/${university.id}`)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            <MessageSquare className="w-5 h-5" />
            Forum'a Git
          </button>
        </section>
      </div>
    </div>
  );
}
