import { useState } from 'react';
import { Wallet, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react';
import ModuleHeader from '@/components/ModuleHeader';
import { DisBorcHeader } from '@/modules/dis-borc/components/layout/Header';
import { DisBorcSidebar } from '@/modules/dis-borc/components/layout/Sidebar';
import { StatCard } from '@/modules/dis-borc/components/dashboard/StatCard';
import { AlertsPanel } from '@/modules/dis-borc/components/dashboard/AlertsPanel';
import { TrendChart } from '@/modules/dis-borc/components/dashboard/TrendChart';
import { SupplierPieChart } from '@/modules/dis-borc/components/dashboard/SupplierPieChart';
import { InvoiceTable } from '@/modules/dis-borc/components/invoices/InvoiceTable';
import { SupplierTable } from '@/modules/dis-borc/components/suppliers/SupplierTable';
import { PaymentDetail } from '@/modules/dis-borc/components/payments/PaymentDetail';
import { ReportsPanel } from '@/modules/dis-borc/components/reports/ReportsPanel';
import { useDashboardStats } from '@/modules/dis-borc/hooks/useDashboardStats';

type TabType = 'dashboard' | 'invoices' | 'suppliers' | 'payments' | 'reports';

const DisBorcPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const { data: stats } = useDashboardStats();

  const formatCurrency = (amount: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  const handleViewPayments = (invoiceId: string) => { setSelectedInvoiceId(invoiceId); setActiveTab('payments'); };

  const renderContent = () => {
    if (activeTab === 'payments' && selectedInvoiceId) {
      return <PaymentDetail invoiceId={selectedInvoiceId} onBack={() => { setSelectedInvoiceId(null); setActiveTab('invoices'); }} />;
    }
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Toplam Borç" value={formatCurrency(stats?.totalDebt || 0)} subtitle={`${(stats?.pendingCount || 0) + (stats?.overdueCount || 0) + (stats?.dueSoonCount || 0)} bekleyen fatura`} icon={Wallet} variant="default" />
              <StatCard title="Vadesi Geçen" value={formatCurrency(stats?.overdueDebt || 0)} subtitle={`${stats?.overdueCount || 0} fatura`} icon={AlertTriangle} variant="danger" />
              <StatCard title="Bu Hafta Vadesi Dolan" value={formatCurrency(stats?.dueSoon || 0)} subtitle={`${stats?.dueSoonCount || 0} fatura`} icon={Clock} variant="warning" />
              <StatCard title="Toplam Ödenen" value={formatCurrency(stats?.paidTotal || 0)} icon={CheckCircle2} variant="success" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2"><TrendChart /></div>
              <AlertsPanel onViewInvoice={handleViewPayments} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6"><SupplierPieChart /></div>
          </div>
        );
      case 'invoices': return <InvoiceTable searchQuery={searchQuery} onViewPayments={handleViewPayments} />;
      case 'suppliers': return <SupplierTable searchQuery={searchQuery} />;
      case 'payments': return <div className="text-center py-12 text-muted-foreground"><p>Ödeme detaylarını görmek için Faturalar sekmesinden bir fatura seçin.</p></div>;
      case 'reports': return <ReportsPanel />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ModuleHeader title="Dış Borç Takip & Ödeme" />
      <div className="flex flex-1">
        <DisBorcSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <DisBorcHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />
          <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
};

export default DisBorcPage;
