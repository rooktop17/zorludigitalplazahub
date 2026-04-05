interface SpecialDate {
  month: number;
  day: number;
  tr: string;
  en: string;
}

const specialDates: SpecialDate[] = [
  { month: 1, day: 1, tr: 'Mutlu Yıllar! 🎆', en: 'Happy New Year! 🎆' },
  { month: 4, day: 23, tr: '23 Nisan Ulusal Egemenlik ve Çocuk Bayramı Kutlu Olsun! 🇹🇷', en: 'Happy National Sovereignty and Children\'s Day! 🇹🇷' },
  { month: 5, day: 1, tr: '1 Mayıs Emek ve Dayanışma Günü Kutlu Olsun!', en: 'Happy Labour Day!' },
  { month: 5, day: 19, tr: '19 Mayıs Atatürk\'ü Anma, Gençlik ve Spor Bayramı Kutlu Olsun! 🇹🇷', en: 'Happy Commemoration of Atatürk, Youth and Sports Day! 🇹🇷' },
  { month: 7, day: 20, tr: '20 Temmuz Barış ve Özgürlük Bayramı Kutlu Olsun! 🇹🇷🇨🇾', en: 'Happy Peace and Freedom Day! 🇹🇷🇨🇾' },
  { month: 8, day: 1, tr: '1 Ağustos TMT Günü Kutlu Olsun!', en: 'Happy TMT Day!' },
  { month: 8, day: 30, tr: '30 Ağustos Zafer Bayramı Kutlu Olsun! 🇹🇷', en: 'Happy Victory Day! 🇹🇷' },
  { month: 10, day: 29, tr: 'Cumhuriyet Bayramı Kutlu Olsun! 🇹🇷', en: 'Happy Republic Day! 🇹🇷' },
  { month: 11, day: 10, tr: 'Saygıyla Anıyoruz. Atam İzindeyiz. 🖤🇹🇷', en: 'We Remember with Respect. 🖤🇹🇷' },
  { month: 11, day: 15, tr: '15 Kasım KKTC Cumhuriyet Bayramı Kutlu Olsun! 🇨🇾', en: 'Happy TRNC Republic Day! 🇨🇾' },
];

const islamicHolidays2025: SpecialDate[] = [
  { month: 3, day: 30, tr: 'Ramazan Bayramınız Mübarek Olsun! 🌙', en: 'Happy Eid al-Fitr! 🌙' },
  { month: 3, day: 31, tr: 'Ramazan Bayramınız Mübarek Olsun! 🌙', en: 'Happy Eid al-Fitr! 🌙' },
  { month: 4, day: 1, tr: 'Ramazan Bayramınız Mübarek Olsun! 🌙', en: 'Happy Eid al-Fitr! 🌙' },
  { month: 6, day: 6, tr: 'Kurban Bayramınız Mübarek Olsun! 🐑', en: 'Happy Eid al-Adha! 🐑' },
  { month: 6, day: 7, tr: 'Kurban Bayramınız Mübarek Olsun! 🐑', en: 'Happy Eid al-Adha! 🐑' },
  { month: 6, day: 8, tr: 'Kurban Bayramınız Mübarek Olsun! 🐑', en: 'Happy Eid al-Adha! 🐑' },
  { month: 6, day: 9, tr: 'Kurban Bayramınız Mübarek Olsun! 🐑', en: 'Happy Eid al-Adha! 🐑' },
];

export function getGreeting(lang: 'tr' | 'en'): { timeGreeting: string; specialGreeting?: string } {
  const now = new Date();
  const istanbulTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Istanbul' }));
  const hour = istanbulTime.getHours();
  const month = istanbulTime.getMonth() + 1;
  const day = istanbulTime.getDate();
  const dayOfWeek = istanbulTime.getDay();

  let timeGreeting: string;
  if (hour >= 6 && hour < 12) timeGreeting = lang === 'tr' ? 'Günaydın' : 'Good Morning';
  else if (hour >= 12 && hour < 18) timeGreeting = lang === 'tr' ? 'İyi Günler' : 'Good Afternoon';
  else if (hour >= 18 && hour < 22) timeGreeting = lang === 'tr' ? 'İyi Akşamlar' : 'Good Evening';
  else timeGreeting = lang === 'tr' ? 'İyi Geceler' : 'Good Night';

  const special = [...specialDates, ...islamicHolidays2025].find(d => d.month === month && d.day === day);
  if (special) return { timeGreeting, specialGreeting: special[lang] };

  if (dayOfWeek === 5 && lang === 'tr') {
    return { timeGreeting, specialGreeting: 'Hayırlı Cumalar 🤲' };
  }

  return { timeGreeting };
}
