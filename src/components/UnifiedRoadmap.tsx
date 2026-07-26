import { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ClipboardList,
  Loader2,
  Clock,
  CalendarDays,
  AlertTriangle,
  Sun,
  Snowflake,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';

interface ChecklistItem {
  id: string;
  label: string;
  description?: string;
}

interface Phase {
  id: string;
  title: string;
  subtitle: string;
  items: ChecklistItem[];
}

const PHASES: Phase[] = [
  {
    id: 'research',
    title: 'Araştırma & Not Hesaplama',
    subtitle: 'Üniversite seçimi ve NC hesaplama',
    items: [
      { id: 'select-uni', label: 'Hedef Üniversiteleri Belirle', description: 'UniDeutsch üzerinden favori üniversitelerini seç ve karşılaştır.' },
      { id: 'nc-calc', label: 'NC Hesapla (Bavarian Formula)', description: 'Türkiye notunu Almanya sistemine çevir ve kabul şansını ölç.' },
      { id: 'check-deadlines', label: 'Başvuru Tarihlerini Kontrol Et', description: 'Yaz/Kış dönemi son başvuru tarihlerini not et.' },
    ],
  },
  {
    id: 'documents',
    title: 'Belgeler & Dil Hazırlığı',
    subtitle: 'Pasaport, çeviriler ve dil yeterliliği',
    items: [
      { id: 'passport', label: 'Pasaport Çıkartma / Yenileme', description: 'Pasaportunun geçerliliğini kontrol et.' },
      { id: 'translations', label: 'Transkript & Diploma Çevirileri', description: 'Almanca/İngilizce yeminli çevirileri hazırlat.' },
      { id: 'language', label: 'Dil Belgesi Alma (Goethe/IELTS)', description: 'Goethe, TestDaF veya IELTS sınavına gir.' },
    ],
  },
  {
    id: 'uniassist',
    title: 'Uni-Assist & Başvuru Süreci',
    subtitle: 'Uni-Assist portalı üzerinden başvuru',
    items: [
      { id: 'uniassist-account', label: 'Uni-Assist Hesabı Açma', description: 'uni-assist.de üzerinden hesap oluştur.' },
      { id: 'vpd', label: 'VPD Başvurusu', description: 'Belgelerini yükle ve VPD (Vorprüfungsdokumentation) al.' },
      { id: 'submit-apps', label: 'Üniversite Başvurularını Gönder', description: 'VPD ile birlikte üniversitelere başvur.' },
    ],
  },
  {
    id: 'acceptance',
    title: 'Kabul, Blokeli Hesap & Vize',
    subtitle: 'Kabul mektubu, Sperrkonto ve vize',
    items: [
      { id: 'acceptance-letter', label: 'Kabul Mektubunu Bekle', description: 'Zulassungsbescheid geldiğinde sonraki adımlara geç.' },
      { id: 'sperrkonto', label: 'Blokeli Hesap (Sperrkonto) Aç', description: 'Expatrio veya Fintiba üzerinden hesap aç.' },
      { id: 'insurance', label: 'Sağlık Sigortası Yaptır', description: 'Almanya için geçerli sağlık sigortası yaptır.' },
      { id: 'visa', label: 'Vize Randevusu & Mülakat', description: 'iDATA üzerinden randevu al, vize mülakatına hazırlan.' },
    ],
  },
];

const ALL_ITEM_IDS = PHASES.flatMap((p) => p.items.map((i) => i.id));

type SemesterType = 'yaz' | 'kis';

interface SemesterConfig {
  id: SemesterType;
  toggleLabel: string;
  targetDate: Date;
  targetLabel: string;
  icon: typeof Sun;
  accent: string;
}

const SEMESTERS: Record<SemesterType, SemesterConfig> = {
  yaz: {
    id: 'yaz',
    toggleLabel: '2027 Yaz Dönemi (Sommersemester) - Hedef: 15 Ocak',
    targetDate: new Date(2027, 0, 15, 23, 59, 59),
    targetLabel: '15 Ocak 2027',
    icon: Sun,
    accent: 'text-amber-400',
  },
  kis: {
    id: 'kis',
    toggleLabel: '2027 Kış Dönemi (Wintersemester) - Hedef: 15 Temmuz',
    targetDate: new Date(2027, 6, 15, 23, 59, 59),
    targetLabel: '15 Temmuz 2027',
    icon: Snowflake,
    accent: 'text-blue-400',
  },
};

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateRemaining(target: Date): TimeRemaining {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function UnifiedRoadmap() {
  const { user } = useAuth();
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>(
    () => Object.fromEntries(PHASES.map((p) => [p.id, true])),
  );

  const [semester, setSemester] = useState<SemesterType>('yaz');
  const config = SEMESTERS[semester];
  const deadline = config.targetDate;
  const [time, setTime] = useState<TimeRemaining>(() => calculateRemaining(deadline));

  useEffect(() => {
    if (!user) {
      try {
        const local = localStorage.getItem('roadmap_progress');
        if (local) setCompleted(JSON.parse(local));
      } catch {
        // ignore malformed storage
      }
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('roadmap_progress')
        .select('steps')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!cancelled) {
        if (!error && data?.steps) setCompleted(data.steps as Record<string, boolean>);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  useEffect(() => {
    setTime(calculateRemaining(deadline));
    const interval = setInterval(() => {
      setTime(calculateRemaining(deadline));
    }, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const toggle = async (itemId: string) => {
    const next = { ...completed, [itemId]: !completed[itemId] };
    setCompleted(next);

    if (!user) {
      localStorage.setItem('roadmap_progress', JSON.stringify(next));
      return;
    }

    setSaving(true);
    await supabase
      .from('roadmap_progress')
      .upsert({ user_id: user.id, steps: next, updated_at: new Date().toISOString() }, { onConflict: 'user_id' });
    setSaving(false);
  };

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const doneCount = ALL_ITEM_IDS.filter((id) => completed[id]).length;
  const progress = Math.round((doneCount / ALL_ITEM_IDS.length) * 100);

  const isExpired =
    time.days === 0 && time.hours === 0 && time.minutes === 0 && time.seconds === 0;
  const showWarning = !isExpired && time.days < 60;
  const units = [
    { value: time.days, label: 'Gün' },
    { value: time.hours, label: 'Saat' },
    { value: time.minutes, label: 'Dakika' },
    { value: time.seconds, label: 'Saniye' },
  ];

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 transition-all duration-300 hover:border-blue-600/40 animate-slide-up">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-text">UniDeutsch Almanya Başvuru Yol Haritası</h2>
        </div>
        {saving && <Loader2 className="w-4 h-4 text-text-subtle animate-spin" />}
      </div>
      <p className="text-xs text-text-muted mb-5">Başvuru sürecini adım adım takip et</p>

      <div className="mb-5 p-4 bg-gradient-to-br from-blue-600/15 to-surface-2/40 border border-blue-600/30 rounded-xl">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-blue-500" />
          <h3 className="text-sm font-semibold text-text">Başvuru Son Tarih Sayacı</h3>
        </div>

        <div className="grid grid-cols-1 gap-2 mb-3">
          {(Object.values(SEMESTERS) as SemesterConfig[]).map((s) => {
            const Icon = s.icon;
            const isActive = s.id === semester;
            return (
              <button
                key={s.id}
                onClick={() => setSemester(s.id)}
                className={`flex items-center gap-2.5 p-2.5 rounded-lg text-left border transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600/20 border-blue-600/50 text-text'
                    : 'bg-surface-2/40 border-border-light text-text-muted hover:text-text'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? s.accent : ''}`} />
                <span className="text-xs font-medium">{s.toggleLabel}</span>
              </button>
            );
          })}
        </div>

        {isExpired ? (
          <div className="text-center py-3">
            <p className="text-lg font-bold text-amber-400">Süre Doldu</p>
            <p className="text-xs text-text-muted mt-1">{config.targetLabel} son başvuru tarihi geçti.</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {units.map((unit) => (
              <div key={unit.label} className="bg-surface-2/60 border border-border rounded-lg p-2 text-center">
                <div className="text-xl font-bold text-text tabular-nums">
                  {String(unit.value).padStart(2, '0')}
                </div>
                <div className="text-xs text-text-muted">{unit.label}</div>
              </div>
            ))}
          </div>
        )}

        {showWarning && (
          <div className="mt-3 flex items-start gap-2 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-amber-300 leading-relaxed">
              Uni-Assist portalları açık! Belgenlerini hazır ettiğinden emin ol.
            </p>
          </div>
        )}

        <div className="mt-3 flex items-center gap-1.5 text-xs text-text-subtle">
          <CalendarDays className="w-3.5 h-3.5" />
          <span>Hedef: {deadline.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex justify-between text-xs text-text-muted mb-1.5">
          <span>Süreç İlerlemen</span>
          <span className="font-medium text-blue-400">%{progress}</span>
        </div>
        <div className="w-full h-2.5 bg-surface-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-text-subtle mt-1.5">{doneCount}/{ALL_ITEM_IDS.length} adım tamamlandı</p>
      </div>

      <div className="space-y-3">
        {PHASES.map((phase, phaseIndex) => {
          const phaseItems = phase.items;
          const phaseDoneCount = phaseItems.filter((i) => completed[i.id]).length;
          const phaseComplete = phaseDoneCount === phaseItems.length;
          const isExpanded = expandedPhases[phase.id];

          return (
            <div
              key={phase.id}
              className={`rounded-xl border transition-all duration-200 ${
                phaseComplete
                  ? 'bg-emerald-500/5 border-emerald-500/30'
                  : 'bg-surface-2/30 border-border'
              }`}
            >
              <button
                onClick={() => togglePhase(phase.id)}
                className="w-full flex items-center gap-3 p-3 text-left"
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold flex-shrink-0 ${
                    phaseComplete
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-blue-600/15 text-blue-400'
                  }`}
                >
                  {phaseIndex + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-text block">{phase.title}</span>
                  <span className="text-xs text-text-subtle">{phase.subtitle}</span>
                </div>
                <span className="text-xs text-text-muted flex-shrink-0">
                  {phaseDoneCount}/{phaseItems.length}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-text-subtle flex-shrink-0 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isExpanded && (
                <div className="px-3 pb-3 space-y-2">
                  {phaseItems.map((item) => {
                    const isDone = !!completed[item.id];
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggle(item.id)}
                        className={`w-full flex items-start gap-3 p-3 rounded-lg border text-left transition-all duration-200 ${
                          isDone
                            ? 'bg-emerald-500/10 border-emerald-500/30'
                            : 'bg-surface-2/40 border-border hover:border-border-light hover:bg-surface-2/70'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-5 h-5 text-text-subtle flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <span className={`text-sm font-medium block ${isDone ? 'text-emerald-400' : 'text-text'}`}>
                            {item.label}
                          </span>
                          {item.description && (
                            <p className="text-xs text-text-subtle mt-0.5">{item.description}</p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {progress === 100 && (
        <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
          <p className="text-sm font-medium text-emerald-400">Tüm adımlar tamamlandı! Başvuruna hazırsın.</p>
        </div>
      )}
    </div>
  );
}
