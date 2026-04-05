import { Navigation } from '@/modules/maas-kesinti/components/Navigation';
import { Dashboard } from '@/modules/maas-kesinti/components/Dashboard';

export default function MaasKesintiPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <Dashboard />
    </div>
  );
}
