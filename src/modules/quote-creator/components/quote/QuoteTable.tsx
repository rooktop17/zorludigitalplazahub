import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X, Plus } from 'lucide-react';
import { QuoteRow, Currency, BRANDS, CATEGORIES } from '@/modules/quote-creator/types/quote';
import { formatMoney } from '@/modules/quote-creator/utils/formatMoney';
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

interface QuoteTableProps {
  rows: QuoteRow[];
  currency: Currency;
  onUpdateRow: (id: string, updates: Partial<QuoteRow>) => void;
  onDeleteRow: (id: string) => void;
  onAddRow: () => void;
}

export function QuoteTable({ rows, currency, onUpdateRow, onDeleteRow, onAddRow }: QuoteTableProps) {
  const calculateLineTotal = (row: QuoteRow): number => row.qty * row.price * (1 - row.discount / 100);

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4 border-t border-dashed border-border pt-4">
        <h2 className="font-extrabold text-primary">Teklif Kalemleri</h2>
        <Button onClick={onAddRow} className="no-print bg-gold text-accent-foreground hover:bg-gold/90"><Plus className="w-4 h-4 mr-1" />Satır Ekle</Button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="text-left p-3 text-sm font-semibold border-r border-white/10 w-32">Marka</th>
              <th className="text-left p-3 text-sm font-semibold border-r border-white/10 w-44">Kategori</th>
              <th className="text-left p-3 text-sm font-semibold border-r border-white/10">Ürün / Model</th>
              <th className="text-right p-3 text-sm font-semibold border-r border-white/10 w-24">Adet</th>
              <th className="text-right p-3 text-sm font-semibold border-r border-white/10 w-32">Birim Fiyat</th>
              <th className="text-right p-3 text-sm font-semibold border-r border-white/10 w-24">İnd.%</th>
              <th className="text-right p-3 text-sm font-semibold border-r border-white/10 w-36">Ara Toplam</th>
              <th className="text-right p-3 text-sm font-semibold w-20 no-print">Sil</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className={`border-t border-border ${index % 2 === 0 ? 'bg-muted/30' : 'bg-card'}`}>
                <td className="p-2">
                  <div className="space-y-1">
                    <Select value={row.brand} onValueChange={(v) => onUpdateRow(row.id, { brand: v, customBrand: v === 'Diğer' ? row.customBrand : undefined })}>
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue>
                          {BRAND_LOGO_MAP[row.brand] ? <img src={BRAND_LOGO_MAP[row.brand]} alt={row.brand} className="h-5 w-auto object-contain" /> : row.brand === 'Diğer' && row.customBrand ? row.customBrand : row.brand}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {BRANDS.map((b) => (
                          <SelectItem key={b} value={b}>
                            {BRAND_LOGO_MAP[b] ? <div className="flex items-center gap-2"><img src={BRAND_LOGO_MAP[b]} alt={b} className="h-5 w-auto object-contain" /><span className="text-xs text-muted-foreground">{b}</span></div> : b}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {row.brand === 'Diğer' && <Input className="h-8 text-sm" placeholder="Marka adı yazın..." value={row.customBrand || ''} onChange={(e) => onUpdateRow(row.id, { customBrand: e.target.value })} />}
                  </div>
                </td>
                <td className="p-2">
                  <Select value={row.category} onValueChange={(v) => onUpdateRow(row.id, { category: v })}>
                    <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </td>
                <td className="p-2"><Input className="h-9 text-sm" placeholder="Örn: Samsung 55'' QLED" value={row.model} onChange={(e) => onUpdateRow(row.id, { model: e.target.value })} /></td>
                <td className="p-2"><Input type="number" min={1} step={1} className="h-9 text-sm text-right" value={row.qty} onChange={(e) => onUpdateRow(row.id, { qty: Number(e.target.value) || 1 })} /></td>
                <td className="p-2"><Input type="number" min={0} step={0.01} className="h-9 text-sm text-right" value={row.price} onChange={(e) => onUpdateRow(row.id, { price: Number(e.target.value) || 0 })} /></td>
                <td className="p-2"><Input type="number" min={0} max={100} step={0.01} className="h-9 text-sm text-right" value={row.discount} onChange={(e) => onUpdateRow(row.id, { discount: Number(e.target.value) || 0 })} /></td>
                <td className="p-2 text-right"><strong className="text-sm">{formatMoney(calculateLineTotal(row), currency)}</strong></td>
                <td className="p-2 text-right no-print"><Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => onDeleteRow(row.id)}><X className="w-4 h-4" /></Button></td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">Henüz ürün eklenmedi.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
