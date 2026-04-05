import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QuoteData } from '@/modules/quote-creator/types/quote';
import { formatMoney } from '@/modules/quote-creator/utils/formatMoney';

interface QuoteSummaryProps {
  quoteData: QuoteData;
  calculations: { grossTotal: number; rowDiscountTotal: number; subTotal: number; vatAmount: number; globalDiscountAmount: number; grandTotal: number; };
  onQuoteFieldChange: <K extends keyof QuoteData>(field: K, value: QuoteData[K]) => void;
}

export function QuoteSummary({ quoteData, calculations, onQuoteFieldChange }: QuoteSummaryProps) {
  const { grossTotal, rowDiscountTotal, subTotal, vatAmount, globalDiscountAmount, grandTotal } = calculations;
  const { currency } = quoteData;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-4 mt-6">
      <div className="flex flex-col gap-2">
        <Label className="text-xs">Notlar / Teslimat / Garanti</Label>
        <Textarea rows={6} placeholder="Örn: Ücretsiz teslimat + kurulum..." value={quoteData.notes} onChange={(e) => onQuoteFieldChange('notes', e.target.value)} className="resize-none" />
      </div>
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between py-2"><span className="text-sm text-muted-foreground">Brüt Toplam</span><strong className="text-base">{formatMoney(grossTotal, currency)}</strong></div>
        {rowDiscountTotal > 0 && <div className="flex items-center justify-between py-2"><span className="text-sm text-destructive">Satır İndirimleri</span><strong className="text-base text-destructive">-{formatMoney(rowDiscountTotal, currency)}</strong></div>}
        <div className="flex items-center justify-between py-2"><span className="text-sm text-muted-foreground">Ara Toplam</span><strong className="text-base">{formatMoney(subTotal, currency)}</strong></div>
        <div className="flex items-center justify-between py-2 gap-2">
          <span className="text-sm text-muted-foreground">KDV (%)</span>
          <div className="flex items-center gap-2">
            <Select value={quoteData.vatIncluded ? 'dahil' : 'haric'} onValueChange={(v) => { onQuoteFieldChange('vatIncluded', v === 'dahil'); if (v !== 'dahil') onQuoteFieldChange('vatRate', 0); }}>
              <SelectTrigger className="w-20 h-9 text-xs"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="haric">Hariç</SelectItem><SelectItem value="dahil">Dahil</SelectItem></SelectContent>
            </Select>
            <Input type="number" min={0} step={0.01} className="w-20 h-9 text-right text-sm" value={quoteData.vatRate} onChange={(e) => onQuoteFieldChange('vatRate', Number(e.target.value) || 0)} disabled={!quoteData.vatIncluded} />
          </div>
        </div>
        <div className="flex items-center justify-between py-2"><span className="text-sm text-muted-foreground">KDV Tutarı</span><strong className="text-base">{formatMoney(vatAmount, currency)}</strong></div>
        <div className="flex items-center justify-between py-2"><span className="text-sm text-muted-foreground">Genel İndirim (%)</span><Input type="number" min={0} step={0.01} className="w-24 h-9 text-right text-sm" value={quoteData.globalDiscount} onChange={(e) => onQuoteFieldChange('globalDiscount', Number(e.target.value) || 0)} /></div>
        <div className="flex items-center justify-between py-2"><span className="text-sm text-muted-foreground">Genel İndirim Tutarı</span><strong className="text-base">{formatMoney(globalDiscountAmount, currency)}</strong></div>
        <hr className="my-3 border-border" />
        <div className="flex items-center justify-between py-2"><span className="font-extrabold">Genel Toplam</span><strong className="text-xl text-primary">{formatMoney(grandTotal, currency)}</strong></div>
      </div>
    </div>
  );
}
