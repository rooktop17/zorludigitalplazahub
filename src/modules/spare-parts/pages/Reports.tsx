import React, { useState, useEffect } from 'react';
import Layout from '@/modules/spare-parts/components/Layout';
import { useLanguage } from '@/modules/spare-parts/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/untypedClient';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, ShoppingCart, DollarSign, Package } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Reports: React.FC = () => {
  const { t } = useLanguage();
  const [sales, setSales] = useState<any[]>([]);
  const [parts, setParts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const [salesRes, partsRes] = await Promise.all([supabase.from('sales').select('*').eq('status', 'completed'), supabase.from('parts').select('*')]);
      setSales(salesRes.data || []); setParts(partsRes.data || []); setLoading(false);
    };
    fetch();
  }, []);

  const totalRevenue = sales.reduce((s, sale) => s + Number(sale.net_amount), 0);
  const totalCost = parts.reduce((s, p) => s + Number(p.cost) * p.stock, 0);
  const profit = totalRevenue - totalCost;
  const monthNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
  const monthlyData = monthNames.map((name, i) => ({ name, revenue: sales.filter(s => new Date(s.created_at).getMonth() === i).reduce((sum, sale) => sum + Number(sale.net_amount), 0) }));
  const dailyData = Array.from({ length: 30 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (29 - i)); const ds = d.toISOString().split('T')[0]; return { name: `${d.getDate()}/${d.getMonth()+1}`, revenue: sales.filter(s => s.created_at.startsWith(ds)).reduce((sum, sale) => sum + Number(sale.net_amount), 0) }; });

  const stats = [
    { key: 'reports.totalRevenue', value: totalRevenue, icon: <DollarSign size={24} />, color: 'bg-green-500/10 text-green-500', prefix: '₺' },
    { key: 'reports.salesCount', value: sales.length, icon: <ShoppingCart size={24} />, color: 'bg-primary/10 text-primary' },
    { key: 'reports.totalCost', value: totalCost, icon: <Package size={24} />, color: 'bg-yellow-500/10 text-yellow-500', prefix: '₺' },
    { key: 'reports.profit', value: profit, icon: <TrendingUp size={24} />, color: profit >= 0 ? 'bg-green-500/10 text-green-500' : 'bg-destructive/10 text-destructive', prefix: '₺' },
  ];

  if (loading) return <Layout><div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div></Layout>;

  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold text-foreground mb-6">{t('reports.title')}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(stat => (
            <div key={stat.key} className="bg-card border border-border rounded-lg p-5">
              <div className={`p-2.5 rounded-lg w-fit ${stat.color} mb-3`}>{stat.icon}</div>
              <p className="text-2xl font-bold text-foreground">{stat.prefix || ''}{Math.abs(stat.value).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              <p className="text-sm text-muted-foreground mt-1">{t(stat.key)}</p>
            </div>
          ))}
        </div>
        <Tabs defaultValue="monthly" className="space-y-4">
          <TabsList><TabsTrigger value="daily">{t('reports.daily')}</TabsTrigger><TabsTrigger value="monthly">{t('reports.monthly')}</TabsTrigger></TabsList>
          <TabsContent value="daily"><div className="bg-card border border-border rounded-lg p-6"><h3 className="font-bold text-foreground mb-4">{t('reports.daily')}</h3><ResponsiveContainer width="100%" height={350}><LineChart data={dailyData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} /><YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} /><Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.75rem' }} /><Line type="monotone" dataKey="revenue" stroke="hsl(217, 91%, 60%)" strokeWidth={2} dot={false} /></LineChart></ResponsiveContainer></div></TabsContent>
          <TabsContent value="monthly"><div className="bg-card border border-border rounded-lg p-6"><h3 className="font-bold text-foreground mb-4">{t('reports.monthly')}</h3><ResponsiveContainer width="100%" height={350}><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" /><XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} /><YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} /><Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.75rem' }} /><Bar dataKey="revenue" fill="hsl(217, 91%, 60%)" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer></div></TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Reports;
