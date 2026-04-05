import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';
import { useSupplierDistribution } from '@/modules/dis-borc/hooks/useDashboardStats';
import { Skeleton } from '@/components/ui/skeleton';

const COLORS = ['hsl(0, 72%, 45%)', 'hsl(210, 100%, 40%)', 'hsl(38, 92%, 50%)', 'hsl(142, 71%, 45%)', 'hsl(270, 60%, 50%)'];
const chartConfig = { value: { label: 'Tutar' } };

export function SupplierPieChart() {
  const { data: distribution, isLoading } = useSupplierDistribution();
  const formatCurrency = (amount: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  if (isLoading) return (<Card><CardHeader><CardTitle className="text-base">Tedarikçi Bazlı Dağılım</CardTitle></CardHeader><CardContent><Skeleton className="h-[250px] w-full" /></CardContent></Card>);
  if (!distribution || distribution.length === 0) return (<Card><CardHeader><CardTitle className="text-base">Tedarikçi Bazlı Dağılım</CardTitle></CardHeader><CardContent className="flex items-center justify-center h-[250px]"><p className="text-muted-foreground text-sm">Henüz borç kaydı yok</p></CardContent></Card>);

  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-base">Tedarikçi Bazlı Dağılım</CardTitle></CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <ChartContainer config={chartConfig} className="h-[200px] w-[200px]">
            <PieChart>
              <Pie data={distribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name">
                {distribution.map((_: any, index: number) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
              </Pie>
              <ChartTooltip content={({ active, payload }) => {
                if (active && payload && payload.length) { const data = payload[0]; return (<div className="rounded-lg border bg-background p-2 shadow-sm"><div className="font-medium">{data.name}</div><div className="text-muted-foreground text-sm">{formatCurrency(data.value as number)}</div></div>); }
                return null;
              }} />
            </PieChart>
          </ChartContainer>
          <div className="flex-1 space-y-2">
            {distribution.map((item: any, index: number) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-sm truncate flex-1">{item.name}</span>
                <span className="text-sm font-medium">{formatCurrency(item.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
