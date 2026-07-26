import { ArrowRight, Building2, HelpCircle, MessageSquare, GraduationCap, Globe, Users, Star, LayoutDashboard } from 'lucide-react';
import { navigate } from '@/lib/router';
import { universities } from '@/data/universities';
import { UniversityCard } from '@/components/UniversityCard';
import { DecisionCounter } from '@/components/DecisionCounter';

export function HomePage() {
  const featuredUniversities = universities.slice(0, 6);

  const stats = [
    { label: 'Üniversite', value: '30', icon: Building2 },
    { label: 'Değerlendirme Kriteri', value: '5', icon: Star },
    { label: 'Quiz Sorusu', value: '15', icon: HelpCircle },
    { label: 'Türkçe', value: '100%', icon: Globe },
  ];

  const features = [
    {
      icon: Building2,
      title: 'Üniversite Profilleri',
      description:
        'Almanya\'daki en iyi üniversitelerin detaylı profillerini inceleyin. Bölümler, kabul koşulları, şehir bilgileri ve öğrenci yorumları tek bir yerde.',
    },
    {
      icon: HelpCircle,
      title: 'Öneri Quizi',
      description:
        'Kişiselleştirilmiş quiz ile size en uygun üniversiteleri keşfedin. Tercihlerinize göre akıllı eşleştirme sistemi.',
    },
    {
      icon: MessageSquare,
      title: 'Topluluk Forumu',
      description:
        'Almanya\'da okuyan veya okumayı planlayan öğrencilerle deneyimlerinizi paylaşın. Sorular sorun, cevaplar alın.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-surface to-surface-2">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/159490/yale-university-landscape-universities-702702.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
            alt="Üniversite kampüsü"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-surface/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-surface/60 via-surface/70 to-surface-2" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
          <div className="animate-fade-in text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm text-text-muted backdrop-blur-sm">
              <GraduationCap className="h-4 w-4 text-blue-600" />
              <span>UniDeutsch ile Almanya'da eğitim yolculuğunuz burada başlıyor</span>
            </div>

            <h1 className="animate-slide-up text-4xl font-bold tracking-tight text-text sm:text-5xl lg:text-6xl">
              Almanya'da Eğitim İçin{' '}
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                Tam Rehberiniz
              </span>
            </h1>

            <p className="animate-slide-up mx-auto mt-6 max-w-2xl text-lg text-text-muted sm:text-xl">
              Almanya'nın en prestijli üniversitelerini keşfedin, size en uygun olanı bulun ve
              hayalinizdeki eğitime bir adım daha yaklaşın.
            </p>

            <div className="animate-slide-up mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={() => navigate('/quiz')}
                className="group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-600/90 hover:shadow-xl hover:shadow-blue-600/30"
              >
                <HelpCircle className="h-5 w-5" />
                Quize Başla
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => navigate('/universities')}
                className="group inline-flex items-center gap-2 rounded-lg border border-border bg-card/80 px-6 py-3 text-base font-semibold text-text backdrop-blur-sm transition-all hover:border-blue-600/50 hover:bg-card"
              >
                <Building2 className="h-5 w-5" />
                Üniversiteleri Keşfet
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="relative z-10 -mt-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="animate-slide-up grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-6 shadow-2xl sm:grid-cols-4 sm:gap-6 sm:p-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10">
                  <stat.icon className="h-5 w-5 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-text sm:text-3xl">{stat.value}</div>
                <div className="mt-1 text-sm text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="animate-fade-in text-center">
            <h2 className="text-3xl font-bold text-text sm:text-4xl">
              Neden UniDeutsch?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-text-muted">
              Almanya'da eğitim almak isteyen Türk öğrenciler için özel olarak tasarlanmış kapsamlı
              bir platform.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="animate-slide-up group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-blue-600/50 hover:shadow-lg hover:shadow-blue-600/5 sm:p-8"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 inline-flex rounded-lg bg-blue-600/10 p-3 transition-colors group-hover:bg-blue-600/20">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-text">{feature.title}</h3>
                <p className="text-text-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Universities Grid */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="animate-fade-in mb-12 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-text sm:text-4xl">
                Öne Çıkan Üniversiteler
              </h2>
              <p className="mt-2 text-lg text-text-muted">
                Almanya'nın en popüler üniversitelerinden bir seçki
              </p>
            </div>
            <button
              onClick={() => navigate('/universities')}
              className="group hidden items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-muted transition-all hover:border-blue-600/50 hover:text-text sm:inline-flex"
            >
              Tümünü Gör
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="animate-slide-up grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredUniversities.map((university) => (
              <UniversityCard key={university.id} university={university} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <button
              onClick={() => navigate('/universities')}
              className="group inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-600/80"
            >
              Tüm üniversiteleri gör
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Social Proof - Decision Counter */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="animate-fade-in text-center mb-10">
            <h2 className="text-3xl font-bold text-text sm:text-4xl">
              Topluluğa Katıl
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-text-muted">
              Binlerce öğrenci hedef üniversitesini seçti. Sen de kararını ver!
            </p>
          </div>
          <DecisionCounter />
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="animate-fade-in relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-surface-2 to-surface p-8 text-center sm:p-12">
            {/* Decorative Elements */}
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-blue-600/10 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />

            <div className="relative">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600/10">
                <LayoutDashboard className="h-7 w-7 text-blue-600" />
              </div>

              <h2 className="text-2xl font-bold text-text sm:text-3xl">
                Hayalinizdeki Üniversiteyi Bulun
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-text-muted">
                Kısa bir quiz ile tercihlerinizi belirleyin ve size en uygun Alman üniversitelerini
                keşfedin. Sadece birkaç dakikanızı alır!
              </p>

              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <button
                  onClick={() => navigate('/quiz')}
                  className="group inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-500/90 hover:shadow-xl hover:shadow-emerald-500/30"
                >
                  <HelpCircle className="h-5 w-5" />
                  Hemen Quize Başla
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => navigate('/forum')}
                  className="group inline-flex items-center gap-2 rounded-lg border border-border px-6 py-3 text-base font-medium text-text-muted transition-all hover:border-border hover:text-text"
                >
                  <Users className="h-5 w-5" />
                  Topluluğa Katıl
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
