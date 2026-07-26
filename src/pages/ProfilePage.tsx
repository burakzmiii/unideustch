import { useEffect, useState } from 'react';
import { Settings, User, Moon, Sun, Lock, Save, CheckCircle2, AlertCircle, GraduationCap } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { supabase } from '@/lib/supabase';
import { navigate } from '@/lib/router';

const LOCK_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

interface ProfileData {
  full_name: string;
  gpa: number | null;
  last_critical_edit_at: string | null;
}

export function ProfilePage() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [editName, setEditName] = useState('');
  const [editGpa, setEditGpa] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!user && !loading) {
      navigate('/login');
      return;
    }
    if (!user) return;

    let cancelled = false;
    (async () => {
      setLoadingProfile(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, gpa, last_critical_edit_at')
        .eq('id', user.id)
        .maybeSingle();

      if (cancelled) return;

      if (error || !data) {
        // Create profile from auth metadata
        const name = (user.user_metadata?.name as string) || user.email?.split('@')[0] || 'Öğrenci';
        const { data: created } = await supabase
          .from('profiles')
          .insert({ id: user.id, full_name: name })
          .select('full_name, gpa, last_critical_edit_at')
          .maybeSingle();
        if (!cancelled && created) {
          setProfile(created);
          setEditName(created.full_name);
          setEditGpa(created.gpa?.toString() ?? '');
        }
      } else {
        setProfile(data);
        setEditName(data.full_name);
        setEditGpa(data.gpa?.toString() ?? '');
      }
      setLoadingProfile(false);
    })();
    return () => { cancelled = true; };
  }, [user, loading]);

  const lockRemaining = (): number => {
    if (!profile?.last_critical_edit_at) return 0;
    const elapsed = Date.now() - new Date(profile.last_critical_edit_at).getTime();
    const remaining = LOCK_DAYS * MS_PER_DAY - elapsed;
    return Math.max(0, Math.ceil(remaining / MS_PER_DAY));
  };

  const isLocked = (): boolean => lockRemaining() > 0;

  const handleSave = async () => {
    if (!user || !profile) return;
    if (isLocked()) {
      setMessage({ type: 'error', text: `Kilitli: ${lockRemaining()} gün sonra tekrar düzenleyebilirsiniz.` });
      return;
    }
    if (!editName.trim()) {
      setMessage({ type: 'error', text: 'İsim boş bırakılamaz.' });
      return;
    }

    setSaving(true);
    const gpaNum = editGpa ? parseFloat(editGpa) : null;
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: editName.trim(),
        gpa: gpaNum,
        last_critical_edit_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    setSaving(false);
    if (error) {
      setMessage({ type: 'error', text: 'Kaydetme sırasında bir hata oluştu.' });
      return;
    }
    setProfile({
      full_name: editName.trim(),
      gpa: gpaNum,
      last_critical_edit_at: new Date().toISOString(),
    });
    setMessage({ type: 'success', text: 'Profil bilgileriniz güncellendi. 30 gün boyunca kilitlidir.' });
  };

  if (loading || loadingProfile) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600" />
      </div>
    );
  }

  if (!user || !profile) return null;

  const locked = isLocked();
  const daysLeft = lockRemaining();

  return (
    <div className="min-h-screen bg-surface py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold text-text flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-600" />
            Profil Ayarları
          </h1>
          <p className="mt-2 text-text-muted">Hesap bilgilerinizi ve görünüm tercihlerinizi yönetin.</p>
        </div>

        {/* Theme Settings */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6 animate-slide-up transition-colors duration-300">
          <div className="flex items-center gap-2 mb-4">
            {theme === 'dark' ? <Moon className="w-5 h-5 text-blue-500" /> : <Sun className="w-5 h-5 text-amber-500" />}
            <h2 className="text-lg font-semibold text-text">Görünüm Teması</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-muted">
                {theme === 'dark' ? 'Karanlık mod aktif' : 'Aydınlık mod aktif'}
              </p>
              <p className="text-xs text-text-subtle mt-0.5">Tek tıkla değiştir, anında uygulanır.</p>
            </div>
            <button
              onClick={toggleTheme}
              className="relative inline-flex h-8 w-14 items-center rounded-full border border-border bg-surface-2 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
              aria-label="Tema değiştir"
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                  theme === 'dark' ? 'translate-x-1' : 'translate-x-7'
                }`}
              >
                <span className="flex h-full w-full items-center justify-center">
                  {theme === 'dark' ? <Moon className="w-3.5 h-3.5 text-slate-700" /> : <Sun className="w-3.5 h-3.5 text-amber-500" />}
                </span>
              </span>
            </button>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6 animate-slide-up transition-colors duration-300">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-text">Hesap Bilgileri</h2>
          </div>
          <p className="text-xs text-text-subtle mb-4">E-posta adresiniz hesabınızın temelidir ve değiştirilemez.</p>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-surface-2 rounded-xl border border-border">
              <span className="text-sm text-text-muted">E-posta</span>
              <span className="text-sm font-medium text-text">{user.email}</span>
            </div>
          </div>
        </div>

        {/* Critical Info with Lock */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6 animate-slide-up transition-colors duration-300">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-text">Kritik Bilgiler</h2>
            </div>
            {locked ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/15 text-amber-500 border border-amber-500/30">
                <Lock className="w-3 h-3" />
                {daysLeft} gün kilitli
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                <CheckCircle2 className="w-3 h-3" />
                Düzenlenebilir
              </span>
            )}
          </div>
          <p className="text-xs text-text-subtle mb-4">
            İsim ve akademik not ortalamanız, hesap paylaşımını önlemek için 30 günde bir düzenlenebilir.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-text-muted mb-1.5">Ad Soyad</label>
              <input
                type="text"
                value={editName}
                disabled={locked}
                onChange={(e) => setEditName(e.target.value)}
                className={`w-full bg-input-bg border border-border rounded-xl px-4 py-2.5 text-text text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${
                  locked ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />
            </div>
            <div>
              <label className="block text-sm text-text-muted mb-1.5">Akademik Not Ortalaması (GPA)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={editGpa}
                disabled={locked}
                onChange={(e) => setEditGpa(e.target.value)}
                placeholder="Örn: 3.20"
                className={`w-full bg-input-bg border border-border rounded-xl px-4 py-2.5 text-text text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all ${
                  locked ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              />
            </div>
          </div>

          {message && (
            <div className={`mt-4 p-3 rounded-xl border text-sm flex items-center gap-2 ${
              message.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                : 'bg-red-500/10 border-red-500/30 text-red-500'
            }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {message.text}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={locked || saving}
            className={`mt-4 w-full inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              locked
                ? 'bg-surface-2 text-text-subtle cursor-not-allowed border border-border'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20'
            }`}
          >
            {saving ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {locked ? 'Kilitli — Düzenlenemez' : 'Değişiklikleri Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}
