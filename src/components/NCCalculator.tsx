import { useState, useMemo } from 'react';
import { Calculator, Info, CheckCircle2, GraduationCap, School, Lock } from 'lucide-react';
import { useGrade } from '@/context/GradeContext';
import { navigate } from '@/lib/router';

type EducationLevel = 'lise' | 'lisans';

interface ScaleConfig {
  label: string;
  nMax: number;
  nPass: number;
  step: number;
  placeholder: string;
  description: string;
  inputLabel: string;
}

const SCALES: Record<EducationLevel, ScaleConfig> = {
  lise: {
    label: 'Lise Diploma Notu (100 Üzerinden)',
    nMax: 100,
    nPass: 50,
    step: 0.5,
    placeholder: '78',
    description: 'N_max = 100, N_pass = 50 (Yüzlük not sistemi)',
    inputLabel: 'Lise Diploma Notu (100 Üzerinden)',
  },
  lisans: {
    label: 'Lisans GNO / GPA (4.00 Üzerinden)',
    nMax: 4.0,
    nPass: 2.0,
    step: 0.01,
    placeholder: '3.20',
    description: 'N_max = 4.0, N_pass = 2.0 (ABD/Türkiye 4\'lük sistem)',
    inputLabel: 'Lisans GNO / GPA (4.00 Üzerinden)',
  },
};

function getGermanGradeLabel(grade: number): { label: string; labelTr: string; color: string } {
  if (grade <= 1.5) return { label: 'Sehr Gut', labelTr: 'Pekiyi', color: 'text-emerald-400' };
  if (grade <= 2.5) return { label: 'Gut', labelTr: 'İyi', color: 'text-blue-400' };
  if (grade <= 3.5) return { label: 'Befriedigend', labelTr: 'Orta', color: 'text-amber-400' };
  if (grade <= 4.0) return { label: 'Ausreichend', labelTr: 'Geçer', color: 'text-orange-400' };
  return { label: 'Nicht bestanden', labelTr: 'Başarısız', color: 'text-red-400' };
}

export function NCCalculator() {
  const { isSaved } = useGrade();
  const [educationLevel, setEducationLevel] = useState<EducationLevel>('lisans');
  const [nActualInput, setNActualInput] = useState('');
  const [customNMax, setCustomNMax] = useState('');
  const [customNPass, setCustomNPass] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  const config = SCALES[educationLevel];

  const result = useMemo(() => {
    const nActual = parseFloat(nActualInput);
    if (isNaN(nActual)) return null;

    const nMax = useCustom && customNMax ? parseFloat(customNMax) : config.nMax;
    const nPass = useCustom && customNPass ? parseFloat(customNPass) : config.nPass;

    if (isNaN(nMax) || isNaN(nPass)) return null;
    if (nMax <= nPass) return null;
    if (nActual > nMax || nActual < nPass) return null;

    const germanGrade = 1 + 3 * ((nMax - nActual) / (nMax - nPass));
    const clamped = Math.min(Math.max(germanGrade, 1.0), 4.0);
    const rounded = Math.round(clamped * 100) / 100;

    return {
      grade: rounded,
      ...getGermanGradeLabel(rounded),
    };
  }, [nActualInput, educationLevel, customNMax, customNPass, useCustom, config]);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:border-blue-600/40 animate-slide-up">
      <div className="flex items-center gap-2 mb-1">
        <Calculator className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-text">Alman NC Hesaplayıcı</h2>
      </div>
      <p className="text-xs text-text-muted mb-5">Bavyera Formülü (Uni-Assist Resmi)</p>

      {/* Education Level Selector */}
      <div className="mb-4">
        <label className="block text-sm text-text-muted mb-2">Eğitim Durumun</label>
        <div className="grid grid-cols-1 gap-2">
          <button
            onClick={() => { setEducationLevel('lise'); setNActualInput(''); }}
            className={`flex items-start gap-3 p-3 rounded-lg text-left border transition-all duration-200 ${
              educationLevel === 'lise'
                ? 'bg-blue-600/20 border-blue-600/50 text-blue-400'
                : 'bg-surface-2/50 border-border-light text-text-muted hover:border-border-light'
            }`}
          >
            <School className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Lise Başvurusu</p>
              <p className="text-xs text-text-subtle mt-0.5">Lise 11/12. Sınıf veya Lise Mezunuyum</p>
            </div>
          </button>
          <button
            onClick={() => { setEducationLevel('lisans'); setNActualInput(''); }}
            className={`flex items-start gap-3 p-3 rounded-lg text-left border transition-all duration-200 ${
              educationLevel === 'lisans'
                ? 'bg-blue-600/20 border-blue-600/50 text-blue-400'
                : 'bg-surface-2/50 border-border-light text-text-muted hover:border-border-light'
            }`}
          >
            <GraduationCap className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium">Yüksek Lisans Başvurusu</p>
              <p className="text-xs text-text-subtle mt-0.5">Üniversite Öğrencisi veya Mezunuyum</p>
            </div>
          </button>
        </div>
      </div>

      {/* Formula Info */}
      <div className="mb-4 p-3 bg-surface-2/60 border border-border rounded-xl">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-xs text-text-muted font-mono">
              Not = 1 + 3 x ((N_max - N_actual) / (N_max - N_pass))
            </p>
            <p className="text-xs text-text-subtle">{config.description}</p>
          </div>
        </div>
      </div>

      {/* Custom toggle */}
      <button
        onClick={() => setUseCustom(!useCustom)}
        className="text-xs text-blue-400 hover:text-blue-300 mb-3 transition-colors"
      >
        {useCustom ? '— Varsayılan değerleri kullan' : '+ Özel N_max / N_pass gir'}
      </button>

      {/* Custom fields */}
      {useCustom && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs text-text-subtle mb-1">N_max (En yüksek not)</label>
            <input
              type="number"
              step={config.step}
              value={customNMax}
              onChange={(e) => setCustomNMax(e.target.value)}
              placeholder={String(config.nMax)}
              className="w-full bg-input-bg border border-border-light rounded-lg px-3 py-2 text-text text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs text-text-subtle mb-1">N_pass (Geçme notu)</label>
            <input
              type="number"
              step={config.step}
              value={customNPass}
              onChange={(e) => setCustomNPass(e.target.value)}
              placeholder={String(config.nPass)}
              className="w-full bg-input-bg border border-border-light rounded-lg px-3 py-2 text-text text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Actual Grade Input */}
      <div className="mb-5">
        <label className="block text-sm text-text-muted mb-1.5">
          {config.inputLabel}
        </label>
        <input
          type="number"
          step={config.step}
          value={nActualInput}
          onChange={(e) => setNActualInput(e.target.value)}
          placeholder={config.placeholder}
          className="w-full bg-input-bg border border-border-light rounded-xl px-4 py-3 text-text text-base font-medium focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
        />
        <p className="mt-1 text-xs text-text-subtle">
          {config.nPass} ile {config.nMax} arasında bir değer girin
        </p>
      </div>

      {/* Result Display — Gated */}
      {result && (
        isSaved ? (
          <div className="animate-fade-in p-4 bg-gradient-to-br from-blue-600/10 to-emerald-500/5 border border-blue-600/30 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-medium text-text-muted">Hesaplama Sonucu</span>
            </div>

            <div className="text-center space-y-2">
              <p className="text-3xl font-bold text-text">
                {result.grade.toFixed(2)}
              </p>
              <p className={`text-sm font-semibold ${result.color}`}>
                {result.label} / {result.labelTr}
              </p>
            </div>

            <div className="pt-2 border-t border-border/50">
              <p className="text-xs text-text-muted text-center leading-relaxed">
                Alman Not Karşılığın: <span className="font-semibold text-text">{result.grade.toFixed(2)}</span>
                {' — '}
                <span className={result.color}>{result.label} / {result.labelTr}</span>
                {' — '}
                <span className="text-emerald-400">Uni-Assist Resmi Hesaplaması ile %100 Uyumlu</span>
              </p>
            </div>

            {/* Visual grade bar */}
            <div className="pt-2">
              <div className="flex justify-between text-xs text-text-subtle mb-1">
                <span>1.0</span>
                <span>2.0</span>
                <span>3.0</span>
                <span>4.0</span>
              </div>
              <div className="relative w-full h-3 bg-surface-2 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-emerald-500 via-blue-500 to-amber-500 opacity-30"
                  style={{ width: '100%' }}
                />
                <div
                  className="absolute top-0 h-full w-2 bg-white rounded-full shadow-lg transition-all duration-500"
                  style={{ left: `${((result.grade - 1.0) / 3.0) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative rounded-xl overflow-hidden animate-fade-in">
            {/* Blurred preview */}
            <div className="p-4 bg-gradient-to-br from-blue-600/10 to-emerald-500/5 border border-blue-600/30 rounded-xl space-y-3 blur-sm select-none pointer-events-none" aria-hidden="true">
              <div className="text-center space-y-2">
                <p className="text-3xl font-bold text-text">X.XX</p>
                <p className="text-sm font-semibold text-blue-400">--- / ---</p>
              </div>
              <div className="pt-2">
                <div className="relative w-full h-3 bg-surface-2 rounded-full overflow-hidden">
                  <div className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-emerald-500 via-blue-500 to-amber-500 opacity-30" style={{ width: '100%' }} />
                </div>
              </div>
            </div>
            {/* Lock overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface/50 backdrop-blur-[2px] rounded-xl">
              <div className="flex items-center gap-2 px-4 py-2 bg-surface-2/90 border border-border rounded-lg">
                <Lock className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-text-muted">Sonuçlar kilitli</span>
              </div>
              <button
                onClick={() => navigate('/profile')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors shadow-lg shadow-blue-600/20"
              >
                <Lock className="w-3.5 h-3.5" />
                Bavyera NC Notumu ve Üniversite Eşleşmelerimi Görmek İçin Kaydet
              </button>
            </div>
          </div>
        )
      )}

      {/* Edge case: invalid input */}
      {nActualInput && !result && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
          <p className="text-xs text-red-400">
            Geçersiz değer. Notunuz {useCustom && customNPass ? customNPass : config.nPass} ile{' '}
            {useCustom && customNMax ? customNMax : config.nMax} arasında olmalıdır.
          </p>
        </div>
      )}

      {/* 30-day notice */}
      <div className="mt-4 p-3 bg-surface-2/60 border border-border rounded-xl">
        <p className="text-xs text-text-subtle leading-relaxed">
          Hesaplanan Bavyera NC notunuzun ve üniversite eşleşmelerinizin doğruluğu için not bilginiz 30 günde bir güncellenebilir.
        </p>
      </div>
    </div>
  );
}
