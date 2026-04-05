

# Batch 2 Taşıma Planı: Return Refund, Quote Creator, Maaş Kesinti, Kolay İzin

## Analiz Özeti

| Modül | Dosya Sayısı | Supabase Tabloları | Veri Depolama |
|-------|-------------|-------------------|---------------|
| Return Refund | 1 bileşen + assets | `return_forms` (1 tablo) | Supabase |
| Quote Creator | 7 bileşen + 1 hook + 1 type + 1 util + assets | `quotes` (1 tablo) | Supabase + localStorage |
| Maaş Kesinti | 4 bileşen + 2 hook + 2 type + 2 util + assets | `employees`, `advances`, `payments` (3 tablo) | Supabase |
| Kolay İzin | 4 sayfa + 1 data + 1 store + 1 type + assets | Yok (Edge Function fire-and-forget) | localStorage |

**Toplam:** ~30 dosya taşınacak, 5 veritabanı tablosu oluşturulacak

## Uygulama Adımları

### Adım 1: Supabase Bağlantısı ve Veritabanı Tabloları
Hub projesine Supabase/Lovable Cloud bağlanmalı. Ardından 5 tablo oluşturulacak:
- `return_forms` — müşteri iade kayıtları
- `quotes` — teklif formları (rows JSON olarak)
- `mk_employees` — maaş kesinti çalışanları (prefix ile çakışma önlenir)
- `mk_advances` — avans kayıtları
- `mk_payments` — ödeme geçmişi

### Adım 2: Dosya Taşıma

Her modül `src/modules/{id}/` altına namespace ile yerleştirilecek:

```text
src/modules/
  return-refund/
    components/ReturnForm.tsx
    pages/ReturnRefundPage.tsx
  quote-creator/
    components/quote/ (7 dosya: QuoteForm, QuoteHeader, QuoteTable, QuoteSummary, QuoteFooter, QuoteActions, PrintPreview)
    hooks/useQuoteForm.ts
    types/quote.ts
    utils/formatMoney.ts
    pages/QuoteCreatorPage.tsx
  maas-kesinti/
    components/ (Dashboard, EmployeeCard, FlagIcon, Navigation)
    hooks/ (useEmployees, usePaymentHistory)
    types/ (employee, payment)
    utils/ (printPaySlips, printIndividualPaySlip)
    pages/ (MaasKesinti, MaasKesentiReports)
  kolay-izin/
    data/employees.ts
    lib/store.ts
    types/leave.ts
    pages/ (KolayIzinLogin, KolayIzinEmployee, KolayIzinAdmin, KolayIzinAdminLogin)
```

Her dosyada:
- `@/components/ui/*` import'ları → zaten hub'da mevcut, değişiklik yok
- `@/integrations/supabase/client` → hub'ın tek supabase client'ına yönlendirilecek
- `@/assets/*` → gerekli görseller (logo, QR, imza) hub'a kopyalanacak
- Internal import'lar → `@/modules/{id}/...` olarak güncellenecek

### Adım 3: Asset Kopyalama
- `refund-gentle`: `zorlu-logo.png`, `yetkili-imza.png`, `zorlu-qr.jpg` (zaten hub'da mevcut)
- `onlinemusteriteklifformu`: `zorlu-logo.jpeg`, `zorlu-qr.png`, `brands/` klasörü
- `maaskesintiodemepaneli`: `zorlu-logo.png`, `flags/` klasörü
- `zdp-izintalep`: `logo.png`

### Adım 4: Routing Güncelleme
`App.tsx`'e yeni lazy route'lar ekleme:

```text
/module/return-refund         → ReturnRefundPage
/module/quote-creator         → QuoteCreatorPage
/module/maas-kesinti          → MaasKesintiPage
/module/maas-kesinti/raporlar → MaasKesintiReportsPage
/module/kolay-izin            → KolayIzinLogin
/module/kolay-izin/employee   → KolayIzinEmployee
/module/kolay-izin/panel      → KolayIzinAdminLogin
/module/kolay-izin/admin      → KolayIzinAdmin
```

### Adım 5: modules.ts Güncelleme
4 modülü `embedded: true` olarak işaretleme ve URL'leri internal path'lere çevirme.

### Adım 6: Bağımlılık Ekleme
- `html2pdf.js` (Return Refund için)
- `date-fns` (Kolay İzin için — zaten mevcut olabilir)

## Kritik Not: Supabase Gereksinimi
Return Refund, Quote Creator ve Maaş Kesinti modülleri Supabase kullanıyor. Hub'a Supabase bağlanmadan bu modüller yalnızca **form UI** olarak çalışır, veri kaydı yapılamaz. Önce Supabase bağlantısı kurulmalı ve tablolar migrate edilmeli.

Kolay İzin modülü tamamen localStorage tabanlı — hemen çalışır. Edge Function (izin bildirimi) ayrı ayarlanmalı.

## Uygulama Sırası
1. Kolay İzin (Supabase gerektirmez — hemen çalışır)
2. Return Refund (1 tablo, basit)
3. Quote Creator (1 tablo, orta)
4. Maaş Kesinti (3 tablo, en karmaşık)

