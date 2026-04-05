import { AlertTriangle, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useInvoices } from '@/modules/dis-borc/hooks/useInvoices';
import { format, isBefore, startOfDay, addDays } from 'date-fns';
import { tr } from 'date-fns/locale';

interface AlertsPanelProps {
  onViewInvoice: (id: string) => void;
}

export function AlertsPanel({ onViewInvoice }: AlertsPanelProps) {
  const { data: invoices } = useInvoices();
  const today = startOfDay(new Date());
  const weekFromNow = addDays(today, 7);
  const overdueInvoices = invoices?.filter((inv: any) => inv.status !== 'paid' && isBefore(new Date(inv.due_date), today)) || [];
  const dueSoonInvoices = invoices?.filter((inv: any) => inv.status !== 'paid' && !isBefore(new Date(inv.due_date), today) && isBefore(new Date(inv.due_date), weekFromNow)) || [];
  const formatCurrency = (amount: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);

  return (
    <Card className="border-destructive/30 bg-destructive/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Kritik Uyarılar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {overdueInvoices.length === 0 && dueSoonInvoices.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">Kritik uyarı bulunmuyor ✓</p>
        ) : (
          <>
            {overdueInvoices.slice(0, 3).map((inv: any) => (
              <div key={inv.id} className="flex items-center justify-between p-3 rounded-md bg-red-100/80 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive" className="text-xs">Vadesi Geçti</Badge>
                    <span className="text-sm font-medium truncate">{inv.supplier?.name || 'Bilinmeyen'}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{format(new Date(inv.due_date), 'd MMM yyyy', { locale: tr })} • {formatCurrency(inv.remaining_amount)}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onViewInvoice(inv.id)}><ArrowRight className="h-4 w-4" /></Button>
              </div>
            ))}
            {dueSoonInvoices.slice(0, 3).map((inv: any) => (
              <div key={inv.id} className="flex items-center justify-between p-3 rounded-md bg-yellow-100/80 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium truncate">{inv.supplier?.name || 'Bilinmeyen'}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{format(new Date(inv.due_date), 'd MMM yyyy', { locale: tr })} • {formatCurrency(inv.remaining_amount)}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onViewInvoice(inv.id)}><ArrowRight className="h-4 w-4" /></Button>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
