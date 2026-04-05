import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/modules/spare-parts/components/Layout';
import GreetingBanner from '@/modules/spare-parts/components/GreetingBanner';
import { useLanguage } from '@/modules/spare-parts/contexts/LanguageContext';
import { useAuth } from '@/modules/spare-parts/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Package, ShoppingCart, TrendingUp, AlertTriangle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AnimatedCounter: React.FC<{ target: number; prefix?: string; duration?: number }> = ({ target, prefix = '', duration = 1500 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); } else { setCount(Math.floor(start)); }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return <span ref={ref}>{prefix}{count.toLocaleString()}</span>;
};

const CHART_COLORS = ['hsl(217, 91%, 60%)', 'hsl(263, 70%, 50%)', 'hsl(160, 84%, 39%)', 'hsl(38, 92%, 50%)', 'hsl(350, 89%, 60%)', 'hsl(200, 80%, 50%)'];
const MONTH_NAMES_TR = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [totalParts, setTotalParts] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [lowStock, setLowStock] = useState(0);
  const [monthlyData, setMonthlyData] = useState<{ name: string; sales: number }[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; value: number }[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [partsRes, salesRes, lowStockRes] = await Promise.all([
        supabase.from('parts').select('id, category_id', { count: 'exact' }),
        supabase.from('sales').select('id, total_amount, created_at'),
        supabase.from('parts').select('id', { count: 'exact' }).filter('stock', 'lt', 5),
      ]);
      setTotalParts(partsRes.count ?? 0);
      setLowStock(lowStockRes.count ?? 0);
      const salesData = salesRes.data ?? [];
      setTotalSales(salesData.length);
      setRevenue(salesData.reduce((sum: number, s: any) => sum + Number(s.total_amount), 0));
      const year = new Date().getFullYear();
      setMonthlyData(MONTH_NAMES_TR.map((name, i) => ({
        name,
        sales: salesData.filter((s: any) => { const d = new Date(s.created_at); return d.getFullYear() === year && d.getMonth() === i; }).length,
      })));
      const parts = partsRes.data ?? [];
      const catMap: Record<string, number> = {};
      parts.forEach((p: any) => { catMap[p.category_id] = (catMap[p.category_id] || 0) + 1; });
      setCategoryData(Object.entries(catMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 6));
    };
    fetchStats();
  }, []);

  const stats = [
    { key: 'dashboard.totalParts', value: totalParts, icon: <Package size={24} />, color: 'bg-primary/10 text-primary' },
    { key: 'dashboard.totalSales', value: totalSales, icon: <ShoppingCart size={24} />, color: 'bg-green-500/10 text-green-500' },
    { key: 'dashboard.revenue', value: Math.round(revenue), icon: <TrendingUp size={24} />, color: 'bg-accent/10 text-accent-foreground', prefix: '₺' },
    { key: 'dashboard.lowStock', value: lowStock, icon: <AlertTriangle size={24} />, color: 'bg-yellow-500/10 text-yellow-500' },
  ];

  return (
    <Layout>
      <GreetingBanner />
      {user && <h2 className="text-2xl font-bold text-foreground mb-6">{t('dashboard.title')}</h2>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.key} className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center justify-between mb-3"><span className={`p-2.5 rounded-lg ${stat.color}`}>{stat.icon}</span></div>
            <p className="text-2xl font-bold text-foreground"><AnimatedCounter target={stat.value} prefix={stat.prefix} /></p>
            <p className="text-sm text-muted-foreground mt-1">{t(stat.key)}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-bold text-foreground mb-4">{t('dashboard.monthlySales')}</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.75rem' }} />
              <Bar dataKey="sales" fill="hsl(217, 91%, 60%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-bold text-foreground mb-4">{t('dashboard.topCategories')}</h3>
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart><Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                  {categoryData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                </Pie><Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.75rem' }} /></PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 mt-2 justify-center">
                {categoryData.map((d, i) => (
                  <span key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS[i] }} />{d.name}
                  </span>
                ))}
              </div>
            </>
          ) : <p className="text-muted-foreground text-sm text-center py-20">Henüz veri yok</p>}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
