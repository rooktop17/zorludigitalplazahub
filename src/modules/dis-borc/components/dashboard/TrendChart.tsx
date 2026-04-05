import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useMonthlyTrend } from '@/modules/dis-borc/hooks/useDashboardStats';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfig = { debt: { label: 'Borç', color: 'hsl(0 72% 45%)' }, paid: { label: 'Ödenen', color: 'hsl(142 71% 45%)' } };

export function TrendChart() {
  const { data: trendData, isLoading } = useMonthlyTrend();
  if (isLoading) return (<Card><CardHeader><CardTitle className="text-base">Aylık Borç/Ödeme Trendi</CardTitle></CardHeader><CardContent><Skeleton className="h-[250px] w-full" /></CardContent></Card>);
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-base">Aylık Borç/Ödeme Trendi</CardTitle></CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px]">
          <BarChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `₺${(value / 1000).toFixed(0)}k`} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="debt" fill="var(--color-debt)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="paid" fill="var(--color-paid)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
        <div className="flex justify-center gap-6 mt-4">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-primary" /><span className="text-sm text-muted-foreground">Borç</span></div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-green-500" /><span className="text-sm text-muted-foreground">Ödenen</span></div>
        </div>
      </CardContent>
    </Card>
  );
}
