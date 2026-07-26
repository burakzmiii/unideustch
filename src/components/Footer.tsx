import { GraduationCap } from 'lucide-react';
import { navigate } from '@/lib/router';

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-text font-bold text-lg mb-3">
              <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                <GraduationCap className="w-5 h-5" />
              </span>
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent font-extrabold">
                UniDeutsch
              </span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed">
              Uluslararası öğrenciler için Almanya'da eğitim rehberi. 30 üniversitenin detaylı profilleri, öneri quizi ve topluluk forumu.
            </p>
          </div>

          <div>
            <h4 className="text-text font-semibold mb-3">Bağlantılar</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigate('/')} className="text-text-muted hover:text-blue-400 transition-colors">Ana Sayfa</button></li>
              <li><button onClick={() => navigate('/universities')} className="text-text-muted hover:text-blue-400 transition-colors">Üniversiteler</button></li>
              <li><button onClick={() => navigate('/quiz')} className="text-text-muted hover:text-blue-400 transition-colors">Üniversite Öneri Quizi</button></li>
              <li><button onClick={() => navigate('/forum')} className="text-text-muted hover:text-blue-400 transition-colors">Forum</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-text font-semibold mb-3">Hakkında</h4>
            <p className="text-sm text-text-muted leading-relaxed">
              Bu platform, Almanya'da eğitim almak isteyen uluslararası öğrencilere rehberlik etmek amacıyla hazırlanmıştır. Tüm bilgiler Türkçe olarak sunulmaktadır.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="text-xs text-text-subtle leading-relaxed text-center max-w-3xl mx-auto mb-4">
            UniDeutsch, öğrencilerin Almanya üniversite başvuru süreçlerini kolaylaştırmak amacıyla hazırlanmış bir bilgilendirme ve rehberlik platformudur. Resmi bir eğitim danışmanlığı acentesi değildir. Güncel şartlar için üniversitelerin ve Uni-Assist'in resmi siteleri esas alınmalıdır.
          </p>
          <div className="text-center text-sm text-text-muted">
            &copy; 2026 UniDeutsch. Tüm hakları saklıdır.
          </div>
        </div>
      </div>
    </footer>
  );
}
