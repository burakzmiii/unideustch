import { useState } from 'react';
import { Calculator, TrendingUp, GraduationCap, MapPin, Euro } from 'lucide-react';
import { universities } from '@/data/universities';
import { navigate } from '@/lib/router';
import { useAuth } from '@/context/AuthContext';
import { NCCalculator } from '@/components/NCCalculator';
import { UnifiedRoadmap } from '@/components/UnifiedRoadmap';
import { DecisionCounter } from '@/components/DecisionCounter';

interface CityData {
  rent: number;
  food: number;
  transport: number;
  insurance: number;
}

const cityData: Record<string, CityData> = {
  'Münih': { rent: 850, food: 280, transport: 70, insurance: 120 },
  'Berlin': { rent: 650, food: 260, transport: 86, insurance: 120 },
  'Hamburg': { rent: 700, food: 270, transport: 70, insurance: 120 },
  'Köln': { rent: 600, food: 250, transport: 99, insurance: 120 },
  'Stuttgart': { rent: 680, food: 260, transport: 70, insurance: 120 },
  'Dresden': { rent: 420, food: 230, transport: 60, insurance: 120 },
  'Bremen': { rent: 450, food: 240, transport: 65, insurance: 120 },
  'Leipzig': { rent: 400, food: 230, transport: 60, insurance: 120 },
  'Aachen': { rent: 480, food: 240, transport: 75, insurance: 120 },
  'Dortmund': { rent: 430, food: 240, transport: 75, insurance: 120 },
};

const BLOCKED_ACCOUNT_MONTHLY = 934; // 11,208€ / 12

export function DashboardPage() {
  const { user, loading } = useAuth();

  // Cost calculator state
  const [selectedCity, setSelectedCity] = useState<string>('Berlin');

  // Admission simulator state
  const [gpa, setGpa] = useState<number>(2.0);
  const [selectedUniId, setSelectedUniId] = useState<string>(universities[0]?.id ?? '');

  if (!user && !loading) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600" />
      </div>
    );
  }

  // Cost calculator logic
  const city = cityData[selectedCity];
  const totalCost = city ? city.rent + city.food + city.transport + city.insurance : 0;
  const costComparisonPercent = Math.min((totalCost / BLOCKED_ACCOUNT_MONTHLY) * 100, 200);

  // Admission simulator logic
  const selectedUni = universities.find((u) => u.id === selectedUniId);
  const easeOfAcceptance = selectedUni?.ratings.easeOfAcceptance ?? 3;

  let admissionResult: 'garanti' | 'orta' | 'riskli';
  if (gpa <= 2.0) {
    admissionResult = 'garanti';
  } else if (gpa <= 2.8) {
    admissionResult = 'orta';
  } else if (gpa <= 3.2 && easeOfAcceptance >= 4) {
    admissionResult = 'orta';
  } else {
    admissionResult = 'riskli';
  }

  const admissionBadge = {
    garanti: { label: 'Garanti', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', description: 'Notunuz bu üniversite için oldukça rekabetçi. Kabul şansınız yüksek!' },
    orta: { label: 'Orta', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', description: 'Kabul şansınız orta düzeyde. Motivasyon mektubunuz belirleyici olabilir.' },
    riskli: { label: 'Riskli', color: 'bg-red-500/20 text-red-400 border-red-500/30', description: 'Bu not ortalamasıyla kabul zor olabilir. Alternatif üniversiteleri değerlendirin.' },
  };

  const badge = admissionBadge[admissionResult];

  return (
    <div className="min-h-screen bg-surface py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold text-text flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            Öğrenci Kontrol Paneli
          </h1>
          <p className="mt-2 text-text-muted">
            UniDeutsch ile Almanya'daki üniversite yolculuğunuzu buradan takip edin.
          </p>
        </div>

        {/* NC Calculator & Decision Counter */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <NCCalculator />
          <DecisionCounter />
        </div>

        {/* Unified Roadmap */}
        <div className="mb-6">
          <UnifiedRoadmap />
        </div>

        {/* Two columns grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ============ 1. Cost of Living Calculator ============ */}
          <div className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:border-blue-600/40 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-text">Yaşam Maliyeti Hesaplayıcı</h2>
            </div>

            {/* City selector */}
            <div className="mb-5">
              <label className="block text-sm text-text-muted mb-1.5">
                <MapPin className="w-4 h-4 inline mr-1" />
                Şehir Seçin
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-input-bg border border-border-light rounded-xl px-3 py-2.5 text-text text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              >
                {Object.keys(cityData).map((cityName) => (
                  <option key={cityName} value={cityName}>
                    {cityName}
                  </option>
                ))}
              </select>
            </div>

            {/* Cost breakdown */}
            {city && (
              <div className="space-y-3 mb-5">
                <div className="flex justify-between items-center px-3 py-2 bg-surface-2/50 rounded-lg">
                  <span className="text-sm text-text">🏠 Kira</span>
                  <span className="text-sm font-medium text-text">{city.rent}€</span>
                </div>
                <div className="flex justify-between items-center px-3 py-2 bg-surface-2/50 rounded-lg">
                  <span className="text-sm text-text">🍽️ Yemek</span>
                  <span className="text-sm font-medium text-text">{city.food}€</span>
                </div>
                <div className="flex justify-between items-center px-3 py-2 bg-surface-2/50 rounded-lg">
                  <span className="text-sm text-text">🚌 Ulaşım</span>
                  <span className="text-sm font-medium text-text">{city.transport}€</span>
                </div>
                <div className="flex justify-between items-center px-3 py-2 bg-surface-2/50 rounded-lg">
                  <span className="text-sm text-text">🏥 Sigorta</span>
                  <span className="text-sm font-medium text-text">{city.insurance}€</span>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center px-3 py-3 bg-blue-600/10 border border-blue-600/20 rounded-xl">
                  <span className="text-sm font-semibold text-text flex items-center gap-1">
                    <Euro className="w-4 h-4" /> Toplam Aylık
                  </span>
                  <span className="text-lg font-bold text-blue-400">{totalCost}€</span>
                </div>
              </div>
            )}

            {/* Comparison bar */}
            <div>
              <div className="flex justify-between text-xs text-text-muted mb-1.5">
                <span>Bloke Hesap Minimum (aylık)</span>
                <span>{BLOCKED_ACCOUNT_MONTHLY}€</span>
              </div>
              <div className="relative w-full h-4 bg-surface-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                    totalCost > BLOCKED_ACCOUNT_MONTHLY ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(costComparisonPercent, 100)}%` }}
                />
                {/* Marker line at 100% */}
                <div className="absolute top-0 right-0 h-full w-0.5 bg-border-light" />
              </div>
              <p className="mt-2 text-xs text-text-muted">
                {totalCost > BLOCKED_ACCOUNT_MONTHLY
                  ? `⚠️ Aylık harcamanız bloke hesap minimumunu ${totalCost - BLOCKED_ACCOUNT_MONTHLY}€ aşıyor.`
                  : `✅ Bütçeniz bloke hesap minimumunun altında. ${BLOCKED_ACCOUNT_MONTHLY - totalCost}€ tasarruf edebilirsiniz.`}
              </p>
            </div>
          </div>

          {/* ============ 2. Admission Chance Simulator ============ */}
          <div className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:border-blue-600/40 animate-slide-up">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-text">Kabul Şansı Simülatörü</h2>
            </div>

            {/* GPA Slider */}
            <div className="mb-5">
              <label className="block text-sm text-text-muted mb-1.5">
                Not Ortalaması (GPA/NC)
              </label>
              <input
                type="range"
                min="1.0"
                max="4.0"
                step="0.1"
                value={gpa}
                onChange={(e) => setGpa(parseFloat(e.target.value))}
                className="w-full h-2 bg-surface-2 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-text-subtle mt-1">
                <span>1.0 (En İyi)</span>
                <span className="text-sm font-semibold text-text">{gpa.toFixed(1)}</span>
                <span>4.0 (En Düşük)</span>
              </div>
            </div>

            {/* University selector */}
            <div className="mb-5">
              <label className="block text-sm text-text-muted mb-1.5">
                <GraduationCap className="w-4 h-4 inline mr-1" />
                Üniversite Seçin
              </label>
              <select
                value={selectedUniId}
                onChange={(e) => setSelectedUniId(e.target.value)}
                className="w-full bg-input-bg border border-border-light rounded-xl px-3 py-2.5 text-text text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
              >
                {universities.map((uni) => (
                  <option key={uni.id} value={uni.id}>
                    {uni.name}
                  </option>
                ))}
              </select>
              {selectedUni && (
                <p className="mt-1.5 text-xs text-text-subtle">
                  Kabul Kolaylığı: {selectedUni.ratings.easeOfAcceptance}/5
                </p>
              )}
            </div>

            {/* Result */}
            <div className="bg-surface-2/50 border border-border rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm text-text-muted">Sonuç:</span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold border ${badge.color}`}
                >
                  {badge.label}
                </span>
              </div>
              <p className="text-sm text-text leading-relaxed">{badge.description}</p>

              {/* Visual bar indicator */}
              <div className="mt-3 flex gap-1">
                <div
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    admissionResult === 'garanti' ? 'bg-emerald-500' : 'bg-surface-2'
                  }`}
                />
                <div
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    admissionResult === 'orta' ? 'bg-amber-500' : 'bg-surface-2'
                  }`}
                />
                <div
                  className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                    admissionResult === 'riskli' ? 'bg-red-500' : 'bg-surface-2'
                  }`}
                />
              </div>
              <div className="flex justify-between text-xs text-text-subtle mt-1">
                <span>Garanti</span>
                <span>Orta</span>
                <span>Riskli</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
