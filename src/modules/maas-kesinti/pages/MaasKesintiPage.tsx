import ModuleHeader from "@/components/ModuleHeader";
import { Navigation } from '@/modules/maas-kesinti/components/Navigation';
import { Dashboard } from '@/modules/maas-kesinti/components/Dashboard';

export default function MaasKesintiPage() {
  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader title="Maaş Kesinti & Ödeme" />
      <Navigation />
      <Dashboard />
    </div>
  );
}
