import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { useDashboardStats, useMonthlyTrend, useSupplierDistribution } from '@/modules/dis-borc/hooks/useDashboardStats';
import { useInvoices } from '@/modules/dis-borc/hooks/useInvoices';
import { useAllPayments } from '@/modules/dis-borc/hooks/usePayments';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, Clock, CheckCircle } from 'lucide-react';
import { startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

const COLORS = ['hsl(0, 72%, 45%)', 'hsl(210, 100%, 40%)', 'hsl(38, 92%, 50%)', 'hsl(142, 71%, 45%)', 'hsl(270, 60%, 50%)'];
const chartConfig = { debt: { label: 'Borç', color: 'hsl(0 72% 45%)' }, paid: { label: 'Ödenen', color: 'hsl(142 71% 45%)' } };

export function ReportsPanel() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: trendData, isLoading: trendLoading } = useMonthlyTrend();
  const { data: distribution, isLoading: distLoading } = useSupplierDistribution();
  const { data: invoices } = useInvoices();
  const { data: payments } = useAllPayments();
  const formatCurrency = (amount: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);

  const paymentPerformance = (() => {
    if (!invoices || !payments) return { onTime: 0, late: 0 };
    const paidInvoices = invoices.filter((inv: any) => inv.status === 'paid');
    let onTime = 0; let late = 0;
    paidInvoices.forEach((inv: any) => {
      const invPayments = payments.filter((p: any) => p.invoice_id === inv.id);
      if (invPayments.length > 0) {
        const lastPayment = invPayments.sort((a: any, b: any) => new Date(b.payment_date).getTime() - new Date(a.payment_date).getTime())[0];
        if (new Date(lastPayment.payment_date) <= new Date(inv.due_date)) onTime++; else late++;
      }
    });
    return { onTime, late };
  })();

  const performanceData = [{ name: 'Zamanında', value: paymentPerformance.onTime, fill: COLORS[3] }, { name: 'Gecikmeli', value: paymentPerformance.late, fill: COLORS[0] }];

  const thisMonthStats = (() => {
    if (!invoices || !payments) return { newDebt: 0, paid: 0 };
    const now = new Date(); const monthStart = startOfMonth(now); const monthEnd = endOfMonth(now);
    const newDebt = invoices.filter((inv: any) => isWithinInterval(new Date(inv.created_at), { start: monthStart, end: monthEnd })).reduce((sum: number, inv: any) => sum + Number(inv.total_amount), 0);
    const paid = payments.filter((p: any) => isWithinInterval(new Date(p.payment_date), { start: monthStart, end: monthEnd })).reduce((sum: number, p: any) => sum + Number(p.amount), 0);
    return { newDebt, paid };
  })();

  if (statsLoading || trendLoading || distLoading) return (<div className="space-y-6"><Skeleton className="h-[200px] w-full" /><Skeleton className="h-[300px] w-full" /></div>);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="p-3 rounded-full bg-red-100 dark:bg-red-900/30"><TrendingUp className="h-6 w-6 text-red-600 dark:text-red-400" /></div><div><p className="text-sm text-muted-foreground">Bu Ay Yeni Borç</p><p className="text-2xl font-bold">{formatCurrency(thisMonthStats.newDebt)}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30"><TrendingDown className="h-6 w-6 text-green-600 dark:text-green-400" /></div><div><p className="text-sm text-muted-foreground">Bu Ay Ödenen</p><p className="text-2xl font-bold">{formatCurrency(thisMonthStats.paid)}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="p-3 rounded-full bg-green-100 dark:bg-green-900/30"><CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" /></div><div><p className="text-sm text-muted-foreground">Zamanında Ödeme</p><p className="text-2xl font-bold">{paymentPerformance.onTime}</p></div></div></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30"><Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" /></div><div><p className="text-sm text-muted-foreground">Gecikmeli Ödeme</p><p className="text-2xl font-bold">{paymentPerformance.late}</p></div></div></CardContent></Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card><CardHeader><CardTitle className="text-base">6 Aylık Borç/Ödeme Trendi</CardTitle></CardHeader><CardContent><ChartContainer config={chartConfig} className="h-[300px]"><BarChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" className="stroke-muted" /><XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} /><YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `₺${(value / 1000).toFixed(0)}k`} /><ChartTooltip content={<ChartTooltipContent />} /><Bar dataKey="debt" fill="var(--color-debt)" radius={[4, 4, 0, 0]} name="Borç" /><Bar dataKey="paid" fill="var(--color-paid)" radius={[4, 4, 0, 0]} name="Ödenen" /></BarChart></ChartContainer></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-base">Tedarikçi Bazlı Borç Dağılımı</CardTitle></CardHeader><CardContent>{distribution && distribution.length > 0 ? (<div className="flex items-center gap-4"><ChartContainer config={chartConfig} className="h-[250px] w-[250px]"><PieChart><Pie data={distribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" nameKey="name">{distribution.map((_: any, index: number) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><ChartTooltip content={({ active, payload }) => { if (active && payload && payload.length) { const data = payload[0]; return (<div className="rounded-lg border bg-background p-2 shadow-sm"><div className="font-medium">{data.name}</div><div className="text-muted-foreground text-sm">{formatCurrency(data.value as number)}</div></div>); } return null; }} /></PieChart></ChartContainer><div className="flex-1 space-y-2">{distribution.map((item: any, index: number) => (<div key={item.name} className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} /><span className="text-sm truncate flex-1">{item.name}</span><span className="text-sm font-medium">{formatCurrency(item.value)}</span></div>))}</div></div>) : (<div className="flex items-center justify-center h-[250px] text-muted-foreground">Henüz borç kaydı yok</div>)}</CardContent></Card>
        <Card className="lg:col-span-2"><CardHeader><CardTitle className="text-base">Ödeme Performansı</CardTitle></CardHeader><CardContent>{paymentPerformance.onTime + paymentPerformance.late > 0 ? (<div className="flex items-center justify-center gap-12"><ChartContainer config={chartConfig} className="h-[200px] w-[200px]"><PieChart><Pie data={performanceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name">{performanceData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.fill} />))}</Pie><ChartTooltip /></PieChart></ChartContainer><div className="space-y-4"><div className="flex items-center gap-3"><div className="w-4 h-4 rounded-sm bg-green-500" /><div><p className="font-medium">Zamanında Ödenen</p><p className="text-2xl font-bold text-green-600">{paymentPerformance.onTime}</p></div></div><div className="flex items-center gap-3"><div className="w-4 h-4 rounded-sm bg-red-500" /><div><p className="font-medium">Gecikmeli Ödenen</p><p className="text-2xl font-bold text-red-600">{paymentPerformance.late}</p></div></div><div className="pt-2 border-t"><p className="text-sm text-muted-foreground">Başarı Oranı</p><p className="text-xl font-bold">%{((paymentPerformance.onTime / (paymentPerformance.onTime + paymentPerformance.late)) * 100).toFixed(1)}</p></div></div></div>) : (<div className="flex items-center justify-center h-[200px] text-muted-foreground">Henüz tamamlanmış ödeme yok</div>)}</CardContent></Card>
      </div>
    </div>
  );
}
