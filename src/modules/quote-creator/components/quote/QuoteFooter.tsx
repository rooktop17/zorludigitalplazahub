import zorluQR from '@/assets/zorlu-qr.png';
import { Currency } from '@/modules/quote-creator/types/quote';

interface QuoteFooterProps { currency: Currency; }

export function QuoteFooter({ currency }: QuoteFooterProps) {
  const validityDays = currency === 'TRY' ? 7 : 14;
  return (
    <div className="mt-6 pt-4 border-t-4 border-double border-primary/30">
      <div className="flex items-center justify-between gap-4">
        <img src={zorluQR} alt="Zorlu QR" className="h-[5.5rem] w-[5.5rem] object-contain" />
        <div className="text-right">
          <div className="text-muted-foreground text-sm">📞 +90 548 878 31 31 • 🌐 www.zorluplus.com • 📧 info@zorluplus.com</div>
          <div className="text-xs text-muted-foreground mt-1">Geçerlilik: {validityDays} gün</div>
        </div>
      </div>
      <div className="text-center text-xs text-muted-foreground mt-4">Bu form bilgilendirme amaçlı düzenlenmiştir. ZORLU DIGITAL PLAZA Tüm hakları saklıdır.</div>
    </div>
  );
}
