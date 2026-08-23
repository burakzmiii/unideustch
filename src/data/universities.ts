export interface University {
  id: string;
  name: string;
  city: string;
  state: string;
  type: 'University' | 'TU' | 'FH/HAW';
  tu9: boolean;
  excellence: boolean;
  ncStatus: 'Free' | 'NC' | 'Varies';
  minGrade?: number;
  languages: ('German' | 'English')[];
  programs: string[];
  image: string;
  website: string;
  description: string;
  uniAssist: boolean;
  semesterFee: number;
}

export const universities: University[] = [
  {
    id: 'tum',
    name: 'Technical University of Munich (TUM)',
    city: 'Münih',
    state: 'Bavyera',
    type: 'TU',
    tu9: true,
    excellence: true,
    ncStatus: 'NC',
    minGrade: 2.0,
    languages: ['German', 'English'],
    programs: ['Bilgisayar Mühendisliği', 'Mekanik Mühendislik', 'İşletme & Teknoloji', 'Veri Bilimi'],
    image: 'https://images.unsplash.com/photo-1592985177329-78811663f101?auto=format&fit=crop&w=800&q=80',
    website: 'https://www.tum.de',
    description: 'Almanya’nın en prestijli teknik üniversitelerinden biri. Mühendislik ve teknoloji alanlarında dünya lideridir.',
    uniAssist: false,
    semesterFee: 150,
  },
  {
    id: 'lmu',
    name: 'LMU Munich',
    city: 'Münih',
    state: 'Bavyera',
    type: 'University',
    tu9: false,
    excellence: true,
    ncStatus: 'NC',
    minGrade: 2.2,
    languages: ['German', 'English'],
    programs: ['Tıp', 'Hukuk', 'Psikoloji', 'Fizik', 'Ekonomi'],
    image: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?auto=format&fit=crop&w=800&q=80',
    website: 'https://www.lmu.de',
    description: 'Avrupa’nın en köklü ve araştırmada öne çıkan üniversitelerinden biridir.',
    uniAssist: false,
    semesterFee: 150,
  },
  {
    id: 'heidelberg',
    name: 'Heidelberg University',
    city: 'Heidelberg',
    state: 'Baden-Württemberg',
    type: 'University',
    tu9: false,
    excellence: true,
    ncStatus: 'NC',
    minGrade: 2.1,
    languages: ['German', 'English'],
    programs: ['Tıp', 'Biyoloji', 'Fizik', 'Felsefe'],
    image: 'https://images.unsplash.com/photo-1528728329032-2972f65dfb3f?auto=format&fit=crop&w=800&q=80',
    website: 'https://www.uni-heidelberg.de',
    description: 'Almanya’nın en eski üniversitesidir. Tıp ve doğa bilimlerinde dünya çapında tanınır.',
    uniAssist: true,
    semesterFee: 170,
  },
  {
    id: 'rwth-aachen',
    name: 'RWTH Aachen University',
    city: 'Aachen',
    state: 'Kuzey Ren-Vestfalya',
    type: 'TU',
    tu9: true,
    excellence: true,
    ncStatus: 'Varies',
    minGrade: 2.5,
    languages: ['German', 'English'],
    programs: ['Makine Mühendisliği', 'Elektrik Mühendisliği', 'Bilgisayar Mühendisliği', 'Otomotiv'],
    image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    website: 'https://www.rwth-aachen.de',
    description: 'Avrupa’nın en büyük teknik üniversitelerinden biri. Sanayi işbirlikleriyle ünlüdür.',
    uniAssist: false,
    semesterFee: 300,
  },
  {
    id: 'tu-berlin',
    name: 'TU Berlin',
    city: 'Berlin',
    state: 'Berlin',
    type: 'TU',
    tu9: true,
    excellence: false,
    ncStatus: 'Varies',
    minGrade: 2.7,
    languages: ['German', 'English'],
    programs: ['Mimarlık', 'Yazılım Mühendisliği', 'Ekonomi & Yönetim', 'Çevre Mühendisliği'],
    image: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?auto=format&fit=crop&w=800&q=80',
    website: 'https://www.tu.berlin',
    description: 'Almanya’nın başkentinde uluslararası odaklı bir teknik üniversitedir.',
    uniAssist: true,
    semesterFee: 310,
  }
];
