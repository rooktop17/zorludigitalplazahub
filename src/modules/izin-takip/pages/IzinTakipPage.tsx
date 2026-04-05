import { Loader2 } from 'lucide-react';
import ModuleHeader from '@/components/ModuleHeader';
import { useAuth } from '@/modules/izin-takip/hooks/useAuth';
import LoginForm from '@/modules/izin-takip/components/LoginForm';
import AdminDashboard from '@/modules/izin-takip/components/AdminDashboard';
import EmployeeDashboard from '@/modules/izin-takip/components/EmployeeDashboard';

const IzinTakipPage = () => {
  const { user, loading, isAdmin, isEmployee, employeeId, signIn, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader title="İzin Takip Paneli" />

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : !user ? (
        <LoginForm onLogin={signIn} />
      ) : isAdmin ? (
        <AdminDashboard onSignOut={signOut} />
      ) : isEmployee && employeeId ? (
        <EmployeeDashboard employeeId={employeeId} onSignOut={signOut} />
      ) : (
        <div className="flex items-center justify-center py-32">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Hesabınız henüz bir personel kaydına bağlanmamış.</p>
            <button onClick={signOut} className="text-primary underline text-sm">Çıkış Yap</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default IzinTakipPage;
