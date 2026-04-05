

# Aşama 2: Tüm 10 Modülü Hub'a Taşıma Planı

## Kritik Kısıtlama

Her projenin **kendi Supabase veritabanı** var. Lovable'da bir proje sadece **bir Supabase bağlantısı** destekler. Bu projeleri sildiğinizde, o projelere ait Supabase veritabanları da silinir.

**Çözüm:** Bu hub projesinin Supabase'inde tüm tabloları oluşturup, tüm kodu tek Supabase'e bağlayacağız.

## Proje Analizi

| # | Proje | Sayfa | Bileşen | Supabase | Karmaşıklık |
|---|-------|-------|---------|----------|-------------|
| 1 | Digital Plaza Notes | 1 | 1 (Notepad) | Yok (localStorage) | Düşük |
| 2 | Sigorta & Ekspertiz | 1 | 2 (Form+Preview) | Yok | Düşük |
| 3 | Etiket Yazdırma | 1 | 1 (ShippingLabel) | Yok | Düşük |
| 4 | Return REFUND | 1 | 1 (ReturnForm) | Var | Orta |
| 5 | Quote Creator | 1 | quote/ klasörü | Var | Orta |
| 6 | Maaş Kesinti | 2 | 4 bileşen | Var | Orta |
| 7 | ZDC Kolay İzin | 4 | Basit (data/store) | Edge Function | Orta |
| 8 | İzin Takip Paneli | 4 | 10 bileşen | Var (employees, leave) | Yüksek |
| 9 | Dış Borç Takip | 3 | 7 klasör (auth, dashboard, invoices...) | Var (invoices, payments, suppliers) | Yüksek |
| 10 | Yedek Parça Hub | 10 | 4 + contexts | Var (company_settings, parts, sales...) | Çok Yüksek |

## Uygulama Planı

### Adım 1: Proje Altyapısı
- Hub projesine Supabase/Lovable Cloud bağlantısı kurma
- Tüm 10 modülün tablolarını bu veritabanında oluşturma (migration)
- Ortak auth sistemi kurma (tek giriş, tüm modüllere erişim)

### Adım 2: Dosya Taşıma (Namespace ile)
Her modülün dosyaları çakışmaması için namespace yapısı:
```text
src/modules/
  notes/           → pages/, components/
  sigorta/         → pages/, components/
  print-label/     → pages/, components/
  return-refund/   → pages/, components/
  quote-creator/   → pages/, components/
  maas-kesinti/    → pages/, components/
  kolay-izin/      → pages/, components/, data/
  izin-takip/      → pages/, components/, types/
  dis-borc/        → pages/, components/ (auth, dashboard, invoices, payments, reports, suppliers)
  spare-parts/     → pages/, components/, contexts/
```

### Adım 3: Routing
Her modül `/module/{id}/*` altında çalışacak:
```text
/                              → Hub Ana Sayfa
/module/notes                  → Notes uygulaması
/module/spare-parts            → Yedek Parça Dashboard
/module/spare-parts/parts      → Parçalar sayfası
/module/spare-parts/sales      → Satışlar
/module/dis-borc               → Dış Borç Ana Sayfa
/module/dis-borc/auth          → Dış Borç Giriş
...vb
```

### Adım 4: Supabase Entegrasyonu
- Tüm modüller tek `supabase` client kullanacak
- Her modülün type tanımları birleştirilecek
- RLS politikaları yeniden oluşturulacak

## Önerilen Uygulama Sırası

**Batch 1 (Basit - Supabase'siz):** Notes, Sigorta, Etiket Yazdırma
**Batch 2 (Orta):** Return Refund, Quote Creator, Maaş Kesinti, Kolay İzin
**Batch 3 (Karmaşık):** İzin Takip, Dış Borç Takip, Yedek Parça Hub

## Teknik Detaylar

- **cross_project--copy_project_asset** ile tüm dosyalar kopyalanacak
- Her modülün import path'leri `@/modules/{id}/...` olarak güncellenecek
- Ortak UI bileşenleri (button, input, dialog vb.) zaten hub'da mevcut — tekrar kopyalanmayacak
- Her modülün kendi `supabase` import'ları `@/integrations/supabase/client` olarak değiştirilecek
- Toplam ~100+ dosya taşınacak, ~20+ veritabanı tablosu oluşturulacak

## Uyarı

Bu işlem çok büyük. **Tek seferde yapılamaz** — her batch için ayrı bir mesaj/adım gerekecek. Ancak plan onaylandıktan sonra Batch 1 ile hemen başlayabiliriz.

