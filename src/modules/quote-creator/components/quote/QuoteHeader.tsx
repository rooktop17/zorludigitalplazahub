import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Currency, QuoteData } from '@/modules/quote-creator/types/quote';
import zorluLogo from '@/assets/zorlu-logo.jpeg';
import samsungLogo from '@/assets/brands/samsung.jpg';
import lgLogo from '@/assets/brands/lg.png';
import mideaLogo from '@/assets/brands/midea.png';
import auxLogo from '@/assets/brands/aux.png';
import toshibaLogo from '@/assets/brands/toshiba.png';
import philipsLogo from '@/assets/brands/philips.jpeg';
import krupsLogo from '@/assets/brands/krups.png';
import sharpLogo from '@/assets/brands/sharp.png';

const BRAND_LOGOS = [
  { name: "Samsung", logo: samsungLogo }, { name: "LG", logo: lgLogo },
  { name: "Midea", logo: mideaLogo }, { name: "AUX", logo: auxLogo },
  { name: "Toshiba", logo: toshibaLogo }, { name: "Philips", logo: philipsLogo },
  { name: "Krups", logo: krupsLogo }, { name: "Sharp", logo: sharpLogo },
];

interface QuoteHeaderProps {
  quoteData: QuoteData;
  onQuoteFieldChange: <K extends keyof QuoteData>(field: K, value: QuoteData[K]) => void;
  onCustomerFieldChange: (field: keyof QuoteData['customer'], value: string) => void;
}

export function QuoteHeader({ quoteData, onQuoteFieldChange, onCustomerFieldChange }: QuoteHeaderProps) {
  return (
    <div className="border-b border-border pb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-44 h-14 rounded-lg border border-border bg-white flex items-center justify-center p-2 overflow-hidden">
            <img src={zorluLogo} alt="Zorlu Digital Plaza Logo" className="max-w-full max-h-full object-contain" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-primary">MÜŞTERİ TEKLİF FORMU</h1>
            <p className="text-sm text-muted-foreground">Web Tabanlı Teklif Paneli</p>
          </div>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="quoteNo" className="text-xs">Teklif No</Label>
            <Input id="quoteNo" className="w-36 h-10" placeholder="Örn: ZDP-00123" value={quoteData.quoteNo} onChange={(e) => onQuoteFieldChange('quoteNo', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="quoteDate" className="text-xs">Tarih</Label>
            <Input id="quoteDate" type="date" className="w-40 h-10" value={quoteData.quoteDate} onChange={(e) => onQuoteFieldChange('quoteDate', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="currency" className="text-xs">Para Birimi</Label>
            <Select value={quoteData.currency} onValueChange={(v) => onQuoteFieldChange('currency', v as Currency)}>
              <SelectTrigger className="w-28 h-10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="TRY">TRY ₺</SelectItem>
                <SelectItem value="EUR">EUR €</SelectItem>
                <SelectItem value="GBP">GBP £</SelectItem>
                <SelectItem value="USD">USD $</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        <div className="flex flex-col gap-1.5"><Label className="text-xs">Müşteri Detayları</Label><Input placeholder="Ad Soyad / Firma" value={quoteData.customer.name} onChange={(e) => onCustomerFieldChange('name', e.target.value)} /></div>
        <div className="flex flex-col gap-1.5"><Label className="text-xs">Telefon</Label><Input placeholder="+90 ..." value={quoteData.customer.phone} onChange={(e) => onCustomerFieldChange('phone', e.target.value)} /></div>
        <div className="flex flex-col gap-1.5"><Label className="text-xs">E-posta</Label><Input type="email" placeholder="mail@..." value={quoteData.customer.email} onChange={(e) => onCustomerFieldChange('email', e.target.value)} /></div>
        <div className="flex flex-col gap-1.5"><Label className="text-xs">Adres</Label><Input placeholder="Şehir / Bölge / Açık adres" value={quoteData.customer.address} onChange={(e) => onCustomerFieldChange('address', e.target.value)} /></div>
      </div>
      <div className="flex flex-wrap items-center gap-2 mt-5">
        {BRAND_LOGOS.map((brand) => (
          <div key={brand.name} className="w-20 h-8 rounded-md border border-border bg-white p-1 flex items-center justify-center">
            <img src={brand.logo} alt={`${brand.name} logo`} className="max-w-full max-h-full object-contain" />
          </div>
        ))}
      </div>
    </div>
  );
}
