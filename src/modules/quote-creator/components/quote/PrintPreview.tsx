import { QuoteData, QuoteRow } from '@/modules/quote-creator/types/quote';
import { formatMoney } from '@/modules/quote-creator/utils/formatMoney';
import zorluLogo from '@/assets/zorlu-logo.jpeg';
import zorluQR from '@/assets/zorlu-qr.png';
import samsungLogo from '@/assets/brands/samsung.jpg';
import lgLogo from '@/assets/brands/lg.png';
import mideaLogo from '@/assets/brands/midea.png';
import auxLogo from '@/assets/brands/aux.png';
import toshibaLogo from '@/assets/brands/toshiba.png';
import philipsLogo from '@/assets/brands/philips.jpeg';
import krupsLogo from '@/assets/brands/krups.png';
import sharpLogo from '@/assets/brands/sharp.png';

const BRAND_LOGO_MAP: Record<string, string> = {
  Samsung: samsungLogo, LG: lgLogo, Midea: mideaLogo, AUX: auxLogo,
  Toshiba: toshibaLogo, Philips: philipsLogo, Krups: krupsLogo, Sharp: sharpLogo,
};

interface PrintPreviewProps {
  quoteData: QuoteData;
  calculations: { grossTotal: number; rowDiscountTotal: number; subTotal: number; vatAmount: number; globalDiscountAmount: number; grandTotal: number; };
  onClose: () => void;
}

export function PrintPreview({ quoteData, calculations, onClose }: PrintPreviewProps) {
  const { currency } = quoteData;
  const { grossTotal, rowDiscountTotal, subTotal, vatAmount, globalDiscountAmount, grandTotal } = calculations;
  const validityDays = currency === 'TRY' ? 7 : 14;
  const calculateLineTotal = (row: QuoteRow): number => row.qty * row.price * (1 - row.discount / 100);
  const getBrandDisplay = (row: QuoteRow) => row.brand === 'Diğer' && row.customBrand ? row.customBrand : row.brand;

  return (
    <div className="print-preview-container fixed inset-0 bg-black/50 z-50 overflow-auto print:static print:bg-white print:overflow-visible">
      <div className="min-h-screen flex items-start justify-center p-4 print:min-h-0 print:p-0">
        <div className="bg-white w-[297mm] min-h-[210mm] p-6 shadow-2xl print:shadow-none print:p-0 print:w-full print:min-h-0">
          <div className="flex justify-end gap-2 mb-4 no-print">
            <button onClick={() => window.print()} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">Yazdır</button>
            <button onClick={onClose} className="px-4 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80">Kapat</button>
          </div>
          <div className="print-content text-black">
            <div className="print-header flex flex-col items-center mb-6">
              <img src={zorluLogo} alt="Zorlu Digital Plaza" className="h-16 object-contain mb-2" />
              <h1 className="text-2xl font-bold text-[hsl(214,70%,14%)]">MÜŞTERİ TEKLİF FORMU</h1>
              <div className="flex gap-6 text-sm text-gray-600 mt-2">
                <span>Teklif No: <strong>{quoteData.quoteNo || '-'}</strong></span>
                <span>Tarih: <strong>{quoteData.quoteDate}</strong></span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 mb-6 p-3 bg-gray-50 rounded text-sm">
              <div><span className="text-gray-500">Müşteri:</span><div className="font-semibold">{quoteData.customer.name || '-'}</div></div>
              <div><span className="text-gray-500">Telefon:</span><div className="font-semibold">{quoteData.customer.phone || '-'}</div></div>
              <div><span className="text-gray-500">E-posta:</span><div className="font-semibold">{quoteData.customer.email || '-'}</div></div>
              <div><span className="text-gray-500">Adres:</span><div className="font-semibold">{quoteData.customer.address || '-'}</div></div>
            </div>
            <table className="w-full border-collapse text-sm mb-6">
              <thead><tr className="bg-[hsl(214,70%,14%)] text-white"><th className="text-left p-3 w-28">Marka</th><th className="text-left p-3 w-36">Kategori</th><th className="text-left p-3">Ürün / Model</th><th className="text-right p-3 w-16">Adet</th><th className="text-right p-3 w-24">Birim Fiyat</th><th className="text-right p-3 w-16">İnd.%</th><th className="text-right p-3 w-28">Ara Toplam</th></tr></thead>
              <tbody>
                {quoteData.rows.map((row, index) => (
                  <tr key={row.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="p-3 border-b border-gray-200">{BRAND_LOGO_MAP[row.brand] ? <img src={BRAND_LOGO_MAP[row.brand]} alt={row.brand} className="h-6 w-auto object-contain" /> : <span className="text-sm font-medium">{getBrandDisplay(row)}</span>}</td>
                    <td className="p-3 border-b border-gray-200">{row.category}</td>
                    <td className="p-3 border-b border-gray-200">{row.model || '-'}</td>
                    <td className="p-3 border-b border-gray-200 text-right">{row.qty}</td>
                    <td className="p-3 border-b border-gray-200 text-right">{formatMoney(row.price, currency)}</td>
                    <td className="p-3 border-b border-gray-200 text-right">{row.discount}%</td>
                    <td className="p-3 border-b border-gray-200 text-right font-semibold">{formatMoney(calculateLineTotal(row), currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end mb-6">
              <div className="w-72 text-sm">
                <div className="flex justify-between py-2 border-b border-gray-200"><span className="text-gray-600">Brüt Toplam:</span><span className="font-semibold">{formatMoney(grossTotal, currency)}</span></div>
                {rowDiscountTotal > 0 && <div className="flex justify-between py-2 border-b border-gray-200"><span className="text-red-600">Satır İndirimleri:</span><span className="font-semibold text-red-600">-{formatMoney(rowDiscountTotal, currency)}</span></div>}
                <div className="flex justify-between py-2 border-b border-gray-200"><span className="text-gray-600">Ara Toplam:</span><span className="font-semibold">{formatMoney(subTotal, currency)}</span></div>
                <div className="flex justify-between py-2 border-b border-gray-200"><span className="text-gray-600">KDV ({quoteData.vatRate}%):</span><span className="font-semibold">{formatMoney(vatAmount, currency)}</span></div>
                {quoteData.globalDiscount > 0 && <div className="flex justify-between py-2 border-b border-gray-200"><span className="text-gray-600">Genel İndirim ({quoteData.globalDiscount}%):</span><span className="font-semibold text-red-600">-{formatMoney(globalDiscountAmount, currency)}</span></div>}
                <div className="flex justify-between py-3 bg-[hsl(214,70%,14%)] text-white px-3 rounded mt-2 text-base"><span className="font-bold">GENEL TOPLAM:</span><span className="font-bold">{formatMoney(grandTotal, currency)}</span></div>
              </div>
            </div>
            {quoteData.notes && <div className="text-sm mb-6 p-3 bg-gray-50 rounded"><span className="font-semibold text-gray-600">Notlar:</span><p className="mt-1">{quoteData.notes}</p></div>}
            <div className="flex items-center justify-between text-sm border-t-2 border-primary/30 pt-3 mt-6">
              <img src={zorluQR} alt="Zorlu QR" className="h-[3.85rem] w-[3.85rem] object-contain" />
              <div className="text-right"><div className="text-gray-600">📞 +90 548 878 31 31 • 🌐 www.zorluplus.com • 📧 info@zorluplus.com</div><div className="text-gray-500 text-xs mt-1">Geçerlilik: {validityDays} gün</div></div>
            </div>
            <div className="text-center text-xs text-gray-500 mt-3">Bu form bilgilendirme amaçlı düzenlenmiştir. ZORLU DIGITAL PLAZA Tüm hakları saklıdır.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
