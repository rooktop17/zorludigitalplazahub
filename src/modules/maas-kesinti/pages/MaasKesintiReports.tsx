import ModuleHeader from '@/components/ModuleHeader';
import { Navigation } from '@/modules/maas-kesinti/components/Navigation';
import { usePaymentHistory } from '@/modules/maas-kesinti/hooks/usePaymentHistory';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Calendar, Users, Wallet, TrendingDown, CheckCircle2, FileX } from 'lucide-react';

export default function MaasKesintiReports() {
  const { getMonthlyReports } = usePaymentHistory();
  const reports = getMonthlyReports();
  const formatCurrency = (amount: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8"><h2 className="text-2xl font-bold text-foreground">Ödeme Geçmişi & Raporlar</h2><p className="text-muted-foreground mt-1">Tamamlanan aylık ödemelerin detaylı raporu</p></div>
        {reports.length === 0 ? (
          <Card className="text-center py-16"><CardContent><FileX className="h-16 w-16 mx-auto text-muted-foreground mb-4" /><h3 className="text-xl font-semibold text-foreground mb-2">Henüz Ödeme Kaydı Yok</h3></CardContent></Card>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card><CardContent className="p-5"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><Calendar className="h-6 w-6 text-primary" /></div><div><p className="text-sm text-muted-foreground">Toplam Ay</p><p className="text-2xl font-bold">{reports.length}</p></div></div></CardContent></Card>
              <Card><CardContent className="p-5"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="h-6 w-6 text-primary" /></div><div><p className="text-sm text-muted-foreground">Toplam Ödeme</p><p className="text-2xl font-bold">{reports.reduce((s, r) => s + r.payments.length, 0)}</p></div></div></CardContent></Card>
              <Card><CardContent className="p-5"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center"><Wallet className="h-6 w-6 text-green-500" /></div><div><p className="text-sm text-muted-foreground">Toplam Ödenen</p><p className="text-2xl font-bold text-green-500">{formatCurrency(reports.reduce((s, r) => s + r.totalPaid, 0))}</p></div></div></CardContent></Card>
              <Card><CardContent className="p-5"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center"><TrendingDown className="h-6 w-6 text-destructive" /></div><div><p className="text-sm text-muted-foreground">Toplam Avans</p><p className="text-2xl font-bold text-destructive">{formatCurrency(reports.reduce((s, r) => s + r.totalAdvances, 0))}</p></div></div></CardContent></Card>
            </div>
            <Accordion type="single" collapsible className="space-y-4">
              {reports.map((report) => (
                <AccordionItem key={report.month} value={report.month} className="bg-card rounded-xl border border-border overflow-hidden">
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-secondary/50">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><Calendar className="h-6 w-6 text-primary" /></div><div className="text-left"><h3 className="text-lg font-semibold capitalize">{report.monthName}</h3><p className="text-sm text-muted-foreground">{report.totalEmployees} çalışan</p></div></div>
                      <div className="flex items-center gap-6"><div className="text-right"><p className="text-sm text-muted-foreground">Ödenen</p><p className="text-lg font-bold text-green-500">{formatCurrency(report.totalPaid)}</p></div><Badge variant="secondary" className="bg-green-500/10 text-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Tamamlandı</Badge></div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="px-6 pb-4">
                      <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b border-border"><th className="text-left py-3 px-2 font-medium text-muted-foreground">Çalışan</th><th className="text-right py-3 px-2">Maaş</th><th className="text-right py-3 px-2">Avans</th><th className="text-right py-3 px-2">Ödenen</th><th className="text-right py-3 px-2">Tarih</th></tr></thead><tbody>{report.payments.map((p) => (<tr key={p.id} className="border-b border-border/50"><td className="py-3 px-2 font-medium">{p.employeeName}</td><td className="py-3 px-2 text-right">{formatCurrency(p.baseSalary)}</td><td className="py-3 px-2 text-right text-destructive">-{formatCurrency(p.totalAdvances)}</td><td className="py-3 px-2 text-right font-semibold text-green-500">{formatCurrency(p.netPayment)}</td><td className="py-3 px-2 text-right text-muted-foreground text-xs">{formatDate(p.paidAt)}</td></tr>))}</tbody></table></div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
}
