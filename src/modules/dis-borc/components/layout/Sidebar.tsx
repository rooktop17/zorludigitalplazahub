import { cn } from '@/lib/utils';
import { LayoutDashboard, FileText, Users, CreditCard, BarChart3, Settings } from 'lucide-react';

type TabType = 'dashboard' | 'invoices' | 'suppliers' | 'payments' | 'reports';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const menuItems: { id: TabType; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Panel', icon: LayoutDashboard },
  { id: 'invoices', label: 'Faturalar', icon: FileText },
  { id: 'suppliers', label: 'Tedarikçiler', icon: Users },
  { id: 'payments', label: 'Ödemeler', icon: CreditCard },
  { id: 'reports', label: 'Raporlar', icon: BarChart3 },
];

export function DisBorcSidebar({ activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className="w-64 bg-sidebar-background border-r border-sidebar-border flex flex-col">
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button onClick={() => onTabChange(item.id)} className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors', isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground')}>
                  <Icon className="h-5 w-5" />{item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
