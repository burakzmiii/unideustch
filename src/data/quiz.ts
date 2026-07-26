export interface QuizOption {
  id: string;
  label: string;
  // weights for matching
  states?: string[];
  budget?: 'dusuk' | 'orta' | 'yuksek';
  workOpportunities?: number;
  englishPrograms?: number;
  institutionType?: 'araastirma' | 'teknik' | 'uygulamali';
}

export interface QuizQuestion {
  id: string;
  question: string;
  description?: string;
  options: QuizOption[];
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'education_level',
    question: 'Eğitim Durumun Nedir?',
    description: 'Başvuru türünüze göre hesaplama yapılır.',
    options: [
      { id: 'lise', label: 'Lisans Başvurusu (Lise 11/12. Sınıf veya Lise Mezunuyum)' },
      { id: 'lisans', label: 'Yüksek Lisans Başvurusu (Üniversite Öğrencisi veya Mezunuyum)' },
    ],
  },
  {
    id: 'state',
    question: 'Almanya\'da hangi eyalette/bölgede yaşamak istersiniz?',
    description: 'Yaşam tarzınıza ve tercihlerinize göre bir bölge seçin.',
    options: [
      { id: 'bayern', label: 'Bavyera (Münih, Erlangen)', states: ['Bavyera'] },
      { id: 'bw', label: 'Baden-Württemberg (Stuttgart, Heidelberg)', states: ['Baden-Württemberg'] },
      { id: 'nrw', label: 'Kuzey Ren-Vestfalya (Köln, Aachen, Dortmund)', states: ['Kuzey Ren-Vestfalya'] },
      { id: 'hamburg', label: 'Hamburg', states: ['Hamburg'] },
      { id: 'berlin', label: 'Berlin', states: ['Berlin'] },
      { id: 'hessen', label: 'Hessen (Frankfurt, Darmstadt)', states: ['Hessen'] },
      { id: 'niedersachsen', label: 'Aşağı Saksonya (Hannover, Göttingen)', states: ['Aşağı Saksonya'] },
      { id: 'sachsen', label: 'Saksonya (Dresden, Leipzig)', states: ['Saksonya'] },
      { id: 'bremen', label: 'Bremen', states: ['Bremen'] },
      { id: 'rheinland', label: 'Renanya-Palatina (Mainz)', states: ['Renanya-Palatina'] },
      { id: 'no_pref', label: 'Fark etmez, tüm Almanya açık' },
    ],
  },
  {
    id: 'budget',
    question: 'Aylık yaşam bütçeniz (kira dahil) yaklaşık ne kadar?',
    description: 'Bu, konut ve yaşam tarzı seçeneklerinizi belirler.',
    options: [
      { id: 'dusuk', label: '700€\'dan az — ekonomik', budget: 'dusuk' },
      { id: 'orta', label: '700€ - 1.000€ — orta', budget: 'orta' },
      { id: 'yuksek', label: '1.000€ ve üzeri — yüksek', budget: 'yuksek' },
      { id: 'no_budget', label: 'Bütçe sorun değil' },
    ],
  },
  {
    id: 'work',
    question: 'Çalışma ve iş imkanları sizin için ne kadar önemli?',
    description: 'Werkstudent pozisyonları ve endüstri bağlantıları.',
    options: [
      { id: 'w5', label: 'Çok önemli — çalışarak okumak istiyorum', workOpportunities: 5 },
      { id: 'w4', label: 'Önemli — iş deneyimi kazanmak isterim', workOpportunities: 4 },
      { id: 'w3', label: 'Orta — fırsat olursa değerlendiririm', workOpportunities: 3 },
      { id: 'w2', label: 'Çok önemli değil — odak noktam akademik', workOpportunities: 2 },
    ],
  },
  {
    id: 'language',
    question: 'Program dili tercihiniz nedir?',
    description: 'Tamamen İngilizce mi, Almanca mı, yoksa karışık mı?',
    options: [
      { id: 'e5', label: 'Tamamen İngilizce — Almanca bilmek istemiyorum', englishPrograms: 5 },
      { id: 'e4', label: 'Ağırlıklı İngilizce, biraz Almanca olabilir', englishPrograms: 4 },
      { id: 'e3', label: 'Karışık — hem İngilizce hem Almanca', englishPrograms: 3 },
      { id: 'e2', label: 'Almanca biliyorum, sorun değil', englishPrograms: 2 },
    ],
  },
  {
    id: 'institution',
    question: 'Hangi tür kurumu tercih edersiniz?',
    description: 'Araştırma üniversitesi, teknik üniversite veya uygulamalı bilimler.',
    options: [
      { id: 'araastirma', label: 'Araştırma Üniversitesi — geniş akademik yelpaze', institutionType: 'araastirma' },
      { id: 'teknik', label: 'Teknik Üniversite — mühendislik ve BT odaklı', institutionType: 'teknik' },
      { id: 'uygulamali', label: 'Uygulamalı Bilimler — pratik ve endüstri odaklı', institutionType: 'uygulamali' },
      { id: 'no_inst', label: 'Fark etmez' },
    ],
  },
  {
    id: 'field',
    question: 'Hangi akademik alanla ilgileniyorsunuz?',
    options: [
      { id: 'muhendislik', label: 'Mühendislik (Makine, Elektrik, İnşaat)', institutionType: 'teknik' },
      { id: 'bt', label: 'Bilgisayar Bilimi / Yapay Zeka', institutionType: 'teknik' },
      { id: 'tip', label: 'Tıp / Sağlık Bilimleri' },
      { id: 'iktisat', label: 'İktisat / İşletme', institutionType: 'araastirma' },
      { id: 'sosyal', label: 'Sosyal Bilimler / Beşeri Bilimler', institutionType: 'araastirma' },
      { id: 'cevre', label: 'Çevre / Orman / Enerji Bilimleri' },
      { id: 'doga', label: 'Doğa Bilimleri (Fizik, Kimya, Biyoloji)', institutionType: 'araastirma' },
    ],
  },
  {
    id: 'citysize',
    question: 'Ne büyüklükte bir şehir tercih edersiniz?',
    options: [
      { id: 'buyuk', label: 'Büyük şehir (1M+ nüfus)', states: ['Bavyera', 'Hamburg', 'Berlin', 'Kuzey Ren-Vestfalya', 'Hessen'] },
      { id: 'orta', label: 'Orta ölçekli şehir (200K-1M)', states: ['Baden-Württemberg', 'Kuzey Ren-Vestfalya', 'Aşağı Saksonya', 'Saksonya'] },
      { id: 'kucuk', label: 'Küçük üniversite kenti (<200K)', states: ['Bremen', 'Renanya-Palatina', 'Aşağı Saksonya', 'Saksonya'] },
      { id: 'no_city', label: 'Önemli değil' },
    ],
  },
  {
    id: 'housing',
    question: 'Konut bulma konusunda ne kadar endişelisiniz?',
    description: 'Bazı şehirlerde konut bulmak çok zor olabilir.',
    options: [
      { id: 'h_easy', label: 'Kolay olsun — stres istemiyorum', budget: 'dusuk' },
      { id: 'h_medium', label: 'Orta — biraz çaba harcarım', budget: 'orta' },
      { id: 'h_hard', label: 'Sorun değil — mücadele ederim', budget: 'yuksek' },
    ],
  },
  {
    id: 'graduation',
    question: 'Mezuniyet kolaylığı sizin için ne kadar önemli?',
    description: 'Bazı üniversiteler daha esnek, bazıları daha zorludur.',
    options: [
      { id: 'g_easy', label: 'Çok önemli — kolay mezun olmak istiyorum', institutionType: 'uygulamali' },
      { id: 'g_medium', label: 'Orta — dengeli bir program isterim' },
      { id: 'g_hard', label: 'Önemli değil — zorlu bir programı kabul ederim', institutionType: 'teknik' },
    ],
  },
  {
    id: 'international',
    question: 'Uluslararası öğrenci topluluğu sizin için ne kadar önemli?',
    options: [
      { id: 'i5', label: 'Çok önemli — çok uluslu ortam istiyorum', states: ['Berlin', 'Bavyera', 'Kuzey Ren-Vestfalya', 'Hamburg'] },
      { id: 'i4', label: 'Önemli — çeşitlilik isterim' },
      { id: 'i3', label: 'Orta — önemli ama şart değil' },
      { id: 'i2', label: 'Önemli değil' },
    ],
  },
  {
    id: 'research',
    question: 'Araştırma yapmayı planlıyor musunuz?',
    description: 'Doktora veya akademik kariyer düşünceniz var mı?',
    options: [
      { id: 'r_yes', label: 'Evet — araştırma ve akademik kariyer istiyorum', institutionType: 'araastirma' },
      { id: 'r_maybe', label: 'Belki — fırsat olursa düşünürüm', institutionType: 'teknik' },
      { id: 'r_no', label: 'Hayır — mezun olup çalışmak istiyorum', institutionType: 'uygulamali' },
    ],
  },
  {
    id: 'social',
    question: 'Sosyal ve kültürel yaşam sizin için ne kadar önemli?',
    options: [
      { id: 's5', label: 'Çok önemli — canlı bir şehir istiyorum', states: ['Berlin', 'Hamburg', 'Bavyera', 'Kuzey Ren-Vestfalya'] },
      { id: 's4', label: 'Önemli — sosyal aktiviteler isterim' },
      { id: 's3', label: 'Orta — önemli ama şart değil' },
      { id: 's2', label: 'Önemli değil — odak noktam akademik' },
    ],
  },
  {
    id: 'industry',
    question: 'Mezuniyet sonrası Almanya\'da çalışmayı planlıyor musunuz?',
    options: [
      { id: 'ind_yes', label: 'Evet — Almanya\'da kalmak istiyorum', workOpportunities: 5 },
      { id: 'ind_maybe', label: 'Belki — fırsatları değerlendiririm', workOpportunities: 4 },
      { id: 'ind_no', label: 'Hayır — ülkeme döneceğim', workOpportunities: 2 },
    ],
  },
  {
    id: 'climate',
    question: 'İklim tercihiniz nedir?',
    description: 'Almanya\'da kuzey ve güney arasında iklim farkları vardır.',
    options: [
      { id: 'c_mild', label: 'Ilıman — deniz etkisi olsun', states: ['Hamburg', 'Bremen'] },
      { id: 'c_warm', label: 'Daha sıcak — güney olsun', states: ['Bavyera', 'Baden-Württemberg'] },
      { id: 'c_any', label: 'İklim önemli değil' },
    ],
  },
  {
    id: 'difficulty',
    question: 'Akademik zorluk seviyesi tercihiniz nedir?',
    options: [
      { id: 'd_high', label: 'Yüksek — en zorlu ve prestijli programı isterim', institutionType: 'teknik' },
      { id: 'd_medium', label: 'Orta — dengeli bir program isterim', institutionType: 'araastirma' },
      { id: 'd_low', label: 'Düşük — daha esnek ve pratik olsun', institutionType: 'uygulamali' },
    ],
  },
];

export interface QuizAnswer {
  questionId: string;
  optionId: string;
}

export interface RecommendationResult {
  universityId: string;
  score: number;
  reasons: string[];
}
