import { NavLink } from 'react-router-dom';
import { Home, FileText } from 'lucide-react';

export function Navigation() {
  const currentDate = new Date();
  const nextPaymentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
  const formatDate = (date: Date) => date.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <header className="bg-card border-b border-border px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <nav className="flex items-center gap-1">
            <NavLink to="/module/maas-kesinti" end className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              <Home className="h-4 w-4" />Ana Sayfa
            </NavLink>
            <NavLink to="/module/maas-kesinti/raporlar" className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'}`}>
              <FileText className="h-4 w-4" />Raporlar
            </NavLink>
          </nav>
        </div>
        <div className="text-right">
          <h1 className="text-2xl font-bold text-foreground">Aylık Ödeme Paneli</h1>
          <p className="text-sm text-muted-foreground">Sonraki ödeme: <span className="font-semibold text-primary">{formatDate(nextPaymentDate)}</span></p>
        </div>
      </div>
    </header>
  );
}
