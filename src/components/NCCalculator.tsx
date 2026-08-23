import React, { useState } from 'react';
import { Calculator, Info, Lock, CheckCircle2 } from 'lucide-react';
import { useGrade } from '../context/GradeContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from '../lib/router';

export const NCCalculator: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const {
    educationType,
    setEducationType,
    turkishGrade,
    setTurkishGrade,
    customMax,
    setCustomMax,
    customPass,
    setCustomPass,
    germanGrade,
    setGermanGrade,
  } = useGrade();

  const [showCustom, setShowCustom] = useState(false);

  const N_max = showCustom ? customMax : 100;
  const N_pass = showCustom ? customPass : 50;

  const calculateNC = (grade: number) => {
    if (!grade || grade < N_pass || grade > N_max) return null;
    const result = 1 + 3 * ((N_max - grade) / (N_max - N_pass));
    return Math.max(1.0, Math.min(4.0, Math.round(result * 10) / 10));
  };

  const currentGrade = calculateNC(turkishGrade);

  const handleGradeChange = (val: number) => {
    setTurkishGrade(val);
    const nc = calculateNC(val);
    setGermanGrade(nc);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">Alman NC Hesaplayıcı</h2>
          <p className="text-xs text-slate-400">Bavyera Formülü (Uni-Assist Resmi)</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-2">Eğitim Durumun</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setEducationType('bachelor')}
              className={`p-3 rounded-xl border text-left transition-all ${
                educationType === 'bachelor'
                  ? 'bg-blue-600/10 border-blue-500 text-white'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="font-semibold text-xs text-white">Lise Başvurusu</div>
              <div className="text-[10px] text-slate-400 mt-0.5">11/12. Sınıf veya Lise Mezunuyum</div>
            </button>
            <button
              onClick={() => setEducationType('master')}
              className={`p-3 rounded-xl border text-left transition-all ${
                educationType === 'master'
                  ? 'bg-blue-600/10 border-blue-500 text-white'
                  : 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:bg-slate-800'
              }`}
            >
              <div className="font-semibold text-xs text-white">Yüksek Lisans Başvurusu</div>
              <div className="text-[10px] text-slate-400 mt-0.5">Üniversite Öğrencisi veya Mezunuyum</div>
            </button>
          </div>
        </div>

        <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl flex items-start gap-2.5">
          <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Not = 1 + 3 x ((N_max - N_actual) / (N_max - N_pass))
            <br />
            <span className="text-slate-500">N_max = 100, N_pass = 50 (Yüzlük not sistemi)</span>
          </p>
        </div>

        <div>
          <button
            onClick={() => setShowCustom(!showCustom)}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            {showCustom ? '- Varsayılan Not Sistemine Dön' : '+ Özel N_max / N_pass gir'}
          </button>

          {showCustom && (
            <div className="grid grid-cols-2 gap-3 mt-2 p-3 bg-slate-800/30 border border-slate-800 rounded-xl">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Maksimum Not (N_max)</label>
                <input
                  type="number"
                  value={customMax}
                  onChange={(e) => setCustomMax(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Geçme Notu (N_pass)</label>
                <input
                  type="number"
                  value={customPass}
                  onChange={(e) => setCustomPass(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1.5">
            {educationType === 'bachelor' ? 'Lise Diploma Notu (100 Üzerinden)' : 'Lisans GPA Notu'}
          </label>
          <input
            type="number"
            value={turkishGrade || ''}
            onChange={(e) => handleGradeChange(Number(e.target.value))}
            placeholder={`${N_pass} ile ${N_max} arasında bir değer girin`}
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* KİLİTLİ / AÇIK SONUÇ BÖLÜMÜ */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          {user ? (
            // KULLANICI GİRİŞ YAPTIYSA AÇIK SONUÇ
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center">
              <div className="flex items-center justify-center gap-1.5 text-emerald-400 text-xs font-semibold mb-1">
                <CheckCircle2 className="w-4 h-4" /> Bavyera NC Notunuz Hesaplandı
              </div>
              <div className="text-4xl font-extrabold text-emerald-300">
                {currentGrade ? currentGrade.toFixed(1) : '-'}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Tebrikler! Oturum açtığınız için üniversite eşleşmeleriniz açıldı.
              </p>
            </div>
          ) : (
            // GİRİŞ YAPMAYANLARA KİLİTLİ EKRAN
            <div className="relative rounded-xl overflow-hidden border border-slate-800 p-5 text-center bg-slate-950/80">
              <div className="filter blur-sm select-none opacity-30">
                <span className="text-xs text-slate-400">Bavyera NC Notunuz</span>
                <div className="text-3xl font-bold text-white my-1">
                  {currentGrade ? currentGrade.toFixed(1) : '2.1'}
                </div>
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center p-3 bg-slate-950/70 backdrop-blur-xs">
                <Lock className="w-5 h-5 text-blue-400 mb-1" />
                <p className="text-xs text-slate-300 mb-3 font-medium">
                  NC Notunu ve Üniversite Eşleşmelerini Görmek İçin
                </p>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all"
                >
                  Ücretsiz Kayıt Ol & Sonucu Gör
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
