import { 
  Wrench, StickyNote, Calendar, CalendarCheck, FileText, 
  Wallet, Shield, RotateCcw, Tag, CreditCard 
} from "lucide-react";

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: typeof Wrench;
  url: string;
  color: string;
  category: string;
}

export const modules: Module[] = [
  {
    id: "spare-parts",
    title: "Yedek Parça Hub",
    description: "Zorlu Plaza yedek parça yönetimi, satış ve stok takibi",
    icon: Wrench,
    url: "https://zorluyedekparcapaneli.lovable.app",
    color: "199 89% 48%",
    category: "Operasyon",
  },
  {
    id: "notes",
    title: "Digital Plaza Notes",
    description: "Hızlı not alma ve düzenleme paneli",
    icon: StickyNote,
    url: "https://notkagidi.lovable.app",
    color: "45 93% 58%",
    category: "Araçlar",
  },
  {
    id: "izin-takip",
    title: "İzin Takip Paneli",
    description: "Personel izin yönetimi ve onay süreçleri",
    icon: Calendar,
    url: "https://zdp-wht.lovable.app",
    color: "142 71% 45%",
    category: "İnsan Kaynakları",
  },
  {
    id: "kolay-izin",
    title: "ZDC Kolay İzin",
    description: "Kolay izin talep ve takip sistemi",
    icon: CalendarCheck,
    url: "https://zdp-izintalep.lovable.app",
    color: "262 83% 58%",
    category: "İnsan Kaynakları",
  },
  {
    id: "quote-creator",
    title: "Teklif Oluşturucu",
    description: "Online müşteri teklif formu hazırlama",
    icon: FileText,
    url: "https://onlinemusteriteklifformu.lovable.app",
    color: "199 89% 48%",
    category: "Satış",
  },
  {
    id: "maas-kesinti",
    title: "Maaş Kesinti & Ödeme",
    description: "Maaş kesinti ve ödeme takip paneli",
    icon: Wallet,
    url: "https://maaskesintiodemepaneli.lovable.app",
    color: "16 85% 56%",
    category: "Finans",
  },
  {
    id: "sigorta-ekspertiz",
    title: "Sigorta & Ekspertiz",
    description: "Sigorta ve ekspertiz rapor oluşturma paneli",
    icon: Shield,
    url: "https://sigortaxpertizraporu.lovable.app",
    color: "330 81% 60%",
    category: "Operasyon",
  },
  {
    id: "return-refund",
    title: "İade & Refund",
    description: "Ürün iade ve geri ödeme takip sistemi",
    icon: RotateCcw,
    url: "https://refund-gentle.lovable.app",
    color: "0 72% 51%",
    category: "Satış",
  },
  {
    id: "print-label",
    title: "Etiket Yazdırma",
    description: "Kargo ve ürün etiketi oluşturma",
    icon: Tag,
    url: "https://zlabel.lovable.app",
    color: "173 80% 40%",
    category: "Operasyon",
  },
  {
    id: "dis-borc",
    title: "Dış Borç Takip & Ödeme",
    description: "Dış borç takip ve ödeme yönetim paneli",
    icon: CreditCard,
    url: "https://disariodenecekacikhesappaneli.lovable.app",
    color: "38 92% 50%",
    category: "Finans",
  },
];

export const categories = [...new Set(modules.map(m => m.category))];
