import { useState } from 'react';
import { UserPlus, Users, Calendar, TrendingUp, Loader2, LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModuleHeader from '@/components/ModuleHeader';
import EmployeeCard from '@/modules/izin-takip/components/EmployeeCard';
import AddEmployeeModal from '@/modules/izin-takip/components/AddEmployeeModal';
import LeaveEntryModal from '@/modules/izin-takip/components/LeaveEntryModal';
import EditEmployeeModal from '@/modules/izin-takip/components/EditEmployeeModal';
import LeaveDocumentModal from '@/modules/izin-takip/components/LeaveDocumentModal';
import LeaveStatementModal from '@/modules/izin-takip/components/LeaveStatementModal';
import LeaveRequestsList from '@/modules/izin-takip/components/LeaveRequestsList';
import { Employee } from '@/modules/izin-takip/types/employee';
import { useEmployees } from '@/modules/izin-takip/hooks/useEmployees';
import { useLeaveRecords } from '@/modules/izin-takip/hooks/useLeaveRecords';
import zorluLogo from '@/assets/zorlu-logo.png';

interface AdminDashboardProps {
  onSignOut: () => void;
}

const AdminDashboard = ({ onSignOut }: AdminDashboardProps) => {
  const { employees, loading, addEmployee, updateLeave, correctLeave, updateEmployee, deleteEmployee } = useEmployees();
  const { addRecord } = useLeaveRecords();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isStatementModalOpen, setIsStatementModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleLeaveSubmit = async (employeeId: string, days: number, startDate: Date, endDate: Date): Promise<boolean> => {
    const success = await updateLeave(employeeId, days);
    if (success) await addRecord(employeeId, startDate, endDate, days);
    return success;
  };

  const totalEmployees = employees.length;
  const totalRemainingLeave = employees.reduce((sum, emp) => sum + (emp.totalLeave - emp.usedLeave), 0);
  const totalUsedLeave = employees.reduce((sum, emp) => sum + emp.usedLeave, 0);

  const departmentGroups = [
    { label: 'Mağaza Sorumluları', filter: (e: Employee) => e.department.includes('Mağaza Sorumlusu'), color: 'bg-primary' },
    { label: 'TV – Beyaz Eşya Ustası', filter: (e: Employee) => e.department === 'TV – Beyaz Eşya Ustası', color: 'bg-blue-500' },
    { label: 'Klima Ustası', filter: (e: Employee) => e.department === 'Klima Ustası', color: 'bg-cyan-500' },
    { label: 'Tamir Ustası', filter: (e: Employee) => e.department === 'Tamir Ustası', color: 'bg-orange-500' },
  ];

  return (
    <div className="min-h-screen">
      <header className="bg-card shadow-sm border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={zorluLogo} alt="Zorlu Digital Plaza" className="h-10 md:h-12 object-contain" />
            <div className="hidden md:block h-8 w-px bg-border" />
            <h1 className="hidden md:block text-xl font-semibold text-foreground">Personel İzin Takip Paneli</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsAddModalOpen(true)}><UserPlus className="h-4 w-4 mr-2" /><span className="hidden sm:inline">Personel Ekle</span><span className="sm:hidden">Ekle</span></Button>
            <Button variant="outline" size="sm" onClick={onSignOut}><LogOut className="h-4 w-4 mr-2" /><span className="hidden sm:inline">Çıkış</span></Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-lg p-4 shadow-sm border-0 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center"><Users className="h-6 w-6 text-primary" /></div>
            <div><p className="text-sm text-muted-foreground">Toplam Personel</p><p className="text-2xl font-bold text-foreground">{totalEmployees}</p></div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm border-0 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center"><Calendar className="h-6 w-6 text-accent" /></div>
            <div><p className="text-sm text-muted-foreground">Kalan İzin Toplamı</p><p className="text-2xl font-bold text-foreground">{totalRemainingLeave} gün</p></div>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-sm border-0 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center"><TrendingUp className="h-6 w-6 text-yellow-600" /></div>
            <div><p className="text-sm text-muted-foreground">Kullanılan İzin</p><p className="text-2xl font-bold text-foreground">{totalUsedLeave} gün</p></div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2"><Bell className="h-5 w-5 text-primary" />İzin Talepleri</h2>
          <LeaveRequestsList isAdmin={true} onApproved={() => window.location.reload()} />
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-foreground">Personel Listesi</h2>
          <span className="text-sm text-muted-foreground">{totalEmployees} kişi</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 text-primary animate-spin" /><span className="ml-3 text-muted-foreground">Yükleniyor...</span></div>
        ) : employees.length > 0 ? (
          <div className="space-y-8">
            {departmentGroups.map(({ label, filter, color }) => {
              const group = employees.filter(filter);
              if (group.length === 0) return null;
              return (
                <div key={label}>
                  <h3 className="text-md font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${color}`}></span>{label}
                    <span className="text-sm font-normal text-muted-foreground">({group.length} kişi)</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {group.map((emp) => (
                      <EmployeeCard key={emp.id} employee={emp}
                        onAddLeave={(e) => { setSelectedEmployee(e); setIsLeaveModalOpen(true); }}
                        onEdit={(e) => { setSelectedEmployee(e); setIsEditModalOpen(true); }}
                        onPrintDocument={(e) => { setSelectedEmployee(e); setIsDocumentModalOpen(true); }}
                        onViewStatement={(e) => { setSelectedEmployee(e); setIsStatementModalOpen(true); }} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-card rounded-lg shadow-sm">
            <Users className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Henüz personel eklenmedi</h3>
            <Button onClick={() => setIsAddModalOpen(true)}><UserPlus className="h-4 w-4 mr-2" />Personel Ekle</Button>
          </div>
        )}
      </main>

      <AddEmployeeModal open={isAddModalOpen} onOpenChange={setIsAddModalOpen} onAdd={addEmployee} />
      <LeaveEntryModal open={isLeaveModalOpen} onOpenChange={setIsLeaveModalOpen} employee={selectedEmployee} onSubmit={handleLeaveSubmit} />
      <EditEmployeeModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} employee={selectedEmployee} onUpdate={updateEmployee} onDelete={deleteEmployee} onCorrectLeave={correctLeave} />
      <LeaveDocumentModal open={isDocumentModalOpen} onOpenChange={setIsDocumentModalOpen} employee={selectedEmployee} onSaveLeave={updateLeave} />
      <LeaveStatementModal open={isStatementModalOpen} onOpenChange={setIsStatementModalOpen} employee={selectedEmployee} />
    </div>
  );
};

export default AdminDashboard;
