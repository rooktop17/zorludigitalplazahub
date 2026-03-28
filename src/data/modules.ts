import iconSpareParts from "@/assets/icons/spare-parts.png";
import iconNotes from "@/assets/icons/notes.png";
import iconIzinTakip from "@/assets/icons/izin-takip.png";
import iconKolayIzin from "@/assets/icons/kolay-izin.png";
import iconQuoteCreator from "@/assets/icons/quote-creator.png";
import iconMaasKesinti from "@/assets/icons/maas-kesinti.png";
import iconSigorta from "@/assets/icons/sigorta.png";
import iconReturnRefund from "@/assets/icons/return-refund.png";
import iconPrintLabel from "@/assets/icons/print-label.png";
import iconDisBorc from "@/assets/icons/dis-borc.png";

export interface Module {
  id: string;
  title: string;
  description: string;
  icon3d: string;
  url: string;
  category: string;
}

export const modules: Module[] = [
  {
    id: "spare-parts",
    title: "Yedek Parça Hub",
    description: "Zorlu Plaza yedek parça yönetimi, satış ve stok takibi",
    icon3d: iconSpareParts,
    url: "https://zorluyedekparcapaneli.lovable.app",
    category: "Operasyon",
  },
  {
    id: "notes",
    title: "Digital Plaza Notes",
    description: "Hızlı not alma ve düzenleme paneli",
    icon3d: iconNotes,
    url: "https://notkagidi.lovable.app",
    category: "Araçlar",
  },
  {
    id: "izin-takip",
    title: "İzin Takip Paneli",
    description: "Personel izin yönetimi ve onay süreçleri",
    icon3d: iconIzinTakip,
    url: "https://zdp-wht.lovable.app",
    category: "İnsan Kaynakları",
  },
  {
    id: "kolay-izin",
    title: "ZDC Kolay İzin",
    description: "Kolay izin talep ve takip sistemi",
    icon3d: iconKolayIzin,
    url: "https://zdp-izintalep.lovable.app",
    category: "İnsan Kaynakları",
  },
  {
    id: "quote-creator",
    title: "Teklif Oluşturucu",
    description: "Online müşteri teklif formu hazırlama",
    icon3d: iconQuoteCreator,
    url: "https://onlinemusteriteklifformu.lovable.app",
    category: "Satış",
  },
  {
    id: "maas-kesinti",
    title: "Maaş Kesinti & Ödeme",
    description: "Maaş kesinti ve ödeme takip paneli",
    icon3d: iconMaasKesinti,
    url: "https://maaskesintiodemepaneli.lovable.app",
    category: "Finans",
  },
  {
    id: "sigorta-ekspertiz",
    title: "Sigorta & Ekspertiz",
    description: "Sigorta ve ekspertiz rapor oluşturma paneli",
    icon3d: iconSigorta,
    url: "https://sigortaxpertizraporu.lovable.app",
    category: "Operasyon",
  },
  {
    id: "return-refund",
    title: "İade & Refund",
    description: "Ürün iade ve geri ödeme takip sistemi",
    icon3d: iconReturnRefund,
    url: "https://refund-gentle.lovable.app",
    category: "Satış",
  },
  {
    id: "print-label",
    title: "Etiket Yazdırma",
    description: "Kargo ve ürün etiketi oluşturma",
    icon3d: iconPrintLabel,
    url: "https://zlabel.lovable.app",
    category: "Operasyon",
  },
  {
    id: "dis-borc",
    title: "Dış Borç Takip & Ödeme",
    description: "Dış borç takip ve ödeme yönetim paneli",
    icon3d: iconDisBorc,
    url: "https://disariodenecekacikhesappaneli.lovable.app",
    category: "Finans",
  },
];

export const categories = [...new Set(modules.map(m => m.category))];
