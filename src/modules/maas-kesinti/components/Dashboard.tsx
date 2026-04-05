import { useState } from 'react';
import { useEmployees } from '@/modules/maas-kesinti/hooks/useEmployees';
import { usePaymentHistory } from '@/modules/maas-kesinti/hooks/usePaymentHistory';
import { EmployeeCard } from './EmployeeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { printPaySlips } from '@/modules/maas-kesinti/utils/printPaySlips';
import { Wallet, Users, TrendingDown, Calendar, CheckCircle2, AlertCircle, Printer, Plus, ChevronDown, ChevronUp, Banknote } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';

const COUNTRIES = [
  { name: 'KKTC', flag: '🇹🇷' }, { name: 'Türkiye', flag: '🇹🇷' }, { name: 'TÜRKMENİSTAN', flag: '🇹🇲' },
  { name: 'FİLİSTİN', flag: '🇵🇸' }, { name: 'PAKİSTAN', flag: '🇵🇰' }, { name: 'Suriye', flag: '🇸🇾' },
  { name: 'Afganistan', flag: '🇦🇫' }, { name: 'Irak', flag: '🇮🇶' }, { name: 'Mısır', flag: '🇪🇬' },
  { name: 'Özbekistan', flag: '🇺🇿' },
];

export function Dashboard() {
  const { employees, loading, updateSalary, updatePhoto, addAdvance, removeAdvance, calculateRemaining, clearAdvances, addEmployee, deleteEmployee } = useEmployees();
  const { addBulkPayments, hasPaymentForMonth } = usePaymentHistory();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [addEmployeeDialogOpen, setAddEmployeeDialogOpen] = useState(false);
  const [advancesOpen, setAdvancesOpen] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeeSalary, setNewEmployeeSalary] = useState('');
  const [newEmployeeCountry, setNewEmployeeCountry] = useState('');
  const [customCountryName, setCustomCountryName] = useState('');
  const [customCountryFlag, setCustomCountryFlag] = useState('');

  const totalSalaries = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const totalAdvances = employees.reduce((sum, emp) => sum + emp.advances.reduce((s, a) => s + a.amount, 0), 0);
  const totalRemaining = employees.reduce((sum, emp) => sum + calculateRemaining(emp), 0);

  if (loading) return <div className="flex items-center justify-center min-h-[400px]"><div className="text-muted-foreground">Yükleniyor...</div></div>;

  const formatCurrency = (amount: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  const currentMonth = new Date().toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
  const getCurrentMonthKey = () => { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`; };

  const handleCompletePayments = () => {
    const monthKey = getCurrentMonthKey();
    const eligible = employees.filter(emp => emp.salary > 0 && !hasPaymentForMonth(emp.id, monthKey));
    if (eligible.length === 0) { toast.error('Ödenecek çalışan bulunamadı.'); setConfirmDialogOpen(false); return; }
    const paySlipData = eligible.map(emp => ({ employee: emp, netPayment: calculateRemaining(emp), totalAdvances: emp.advances.reduce((sum, a) => sum + a.amount, 0), month: currentMonth, paymentDate: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) }));
    printPaySlips(paySlipData);
    const payments = eligible.map(emp => ({ employeeId: emp.id, employeeName: emp.name, month: monthKey, baseSalary: emp.salary, totalAdvances: emp.advances.reduce((sum, a) => sum + a.amount, 0), netPayment: calculateRemaining(emp), paidAt: new Date().toISOString() }));
    addBulkPayments(payments);
    payments.forEach(p => clearAdvances(p.employeeId));
    toast.success(`${payments.length} çalışana ödeme kaydedildi!`);
    setConfirmDialogOpen(false);
  };

  const eligibleForPayment = employees.filter(emp => emp.salary > 0 && !hasPaymentForMonth(emp.id, getCurrentMonthKey())).length;

  const handleAddEmployee = async () => {
    if (!newEmployeeName.trim()) { toast.error('Lütfen çalışan adını girin'); return; }
    if (!newEmployeeCountry) { toast.error('Lütfen ülke seçin'); return; }
    let countryName = '', countryFlag = '';
    if (newEmployeeCountry === 'other') { countryName = customCountryName.trim(); countryFlag = customCountryFlag.trim() || '🏳️'; }
    else { const c = COUNTRIES.find(c => c.name === newEmployeeCountry); if (!c) return; countryName = c.name; countryFlag = c.flag; }
    await addEmployee({ name: newEmployeeName.trim(), salary: parseFloat(newEmployeeSalary) || 0, country: countryName, flag: countryFlag });
    setNewEmployeeName(''); setNewEmployeeSalary(''); setNewEmployeeCountry(''); setAddEmployeeDialogOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><Users className="h-6 w-6 text-primary" /></div><div><p className="text-sm text-muted-foreground">Toplam Çalışan</p><p className="text-2xl font-bold text-foreground">{employees.length}</p></div></div></div>
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><Wallet className="h-6 w-6 text-primary" /></div><div><p className="text-sm text-muted-foreground">Toplam Maaş</p><p className="text-2xl font-bold text-foreground">{formatCurrency(totalSalaries)}</p></div></div></div>
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center"><TrendingDown className="h-6 w-6 text-destructive" /></div><div><p className="text-sm text-muted-foreground">Verilen Avans</p><p className="text-2xl font-bold text-destructive">{formatCurrency(totalAdvances)}</p></div></div></div>
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border"><div className="flex items-center gap-3"><div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center"><Calendar className="h-6 w-6 text-green-500" /></div><div><p className="text-sm text-muted-foreground">Ödenecek</p><p className="text-2xl font-bold text-green-500">{formatCurrency(totalRemaining)}</p></div></div></div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground capitalize">{currentMonth} Çalışan Listesi</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setAddEmployeeDialogOpen(true)} className="gap-2"><Plus className="h-4 w-4" />Yeni Çalışan</Button>
          <Button onClick={() => setConfirmDialogOpen(true)} className="gap-2" disabled={eligibleForPayment === 0}><CheckCircle2 className="h-4 w-4" />Ay Sonu Ödemesi Tamamla</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {employees.map((employee) => (
          <EmployeeCard key={employee.id} employee={employee} onUpdateSalary={updateSalary} onUpdatePhoto={updatePhoto} onAddAdvance={addAdvance} onRemoveAdvance={removeAdvance} onDeleteEmployee={deleteEmployee} remaining={calculateRemaining(employee)} />
        ))}
      </div>

      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2"><AlertCircle className="h-5 w-5 text-yellow-500" />Ödeme Onayı</DialogTitle><DialogDescription>{eligibleForPayment} çalışanın ödemesi tamamlanacak.</DialogDescription></DialogHeader>
          <div className="py-4 space-y-3">
            <div className="flex justify-between p-3 bg-secondary/50 rounded-lg"><span>Toplam Maaş:</span><span className="font-semibold">{formatCurrency(totalSalaries)}</span></div>
            <div className="flex justify-between p-3 bg-secondary/50 rounded-lg"><span>Düşülecek Avans:</span><span className="font-semibold text-destructive">-{formatCurrency(totalAdvances)}</span></div>
            <div className="flex justify-between p-3 bg-green-500/10 rounded-lg"><span className="font-medium">Net Ödenecek:</span><span className="font-bold text-green-500">{formatCurrency(totalRemaining)}</span></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>İptal</Button><Button onClick={handleCompletePayments} className="gap-2"><Printer className="h-4 w-4" />Yazdır ve Tamamla</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={addEmployeeDialogOpen} onOpenChange={setAddEmployeeDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Yeni Çalışan Ekle</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-4">
            <div><label className="text-sm font-medium mb-1 block">Ad Soyad</label><Input value={newEmployeeName} onChange={(e) => setNewEmployeeName(e.target.value)} placeholder="Çalışan adı" /></div>
            <div><label className="text-sm font-medium mb-1 block">Ülke</label><Select value={newEmployeeCountry} onValueChange={setNewEmployeeCountry}><SelectTrigger><SelectValue placeholder="Ülke seçin" /></SelectTrigger><SelectContent>{COUNTRIES.map(c => <SelectItem key={c.name} value={c.name}>{c.flag} {c.name}</SelectItem>)}<SelectItem value="other">➕ Diğer</SelectItem></SelectContent></Select></div>
            {newEmployeeCountry === 'other' && <div className="space-y-3 p-3 bg-secondary/50 rounded-lg"><div><label className="text-sm font-medium mb-1 block">Ülke Adı</label><Input value={customCountryName} onChange={(e) => setCustomCountryName(e.target.value)} /></div><div><label className="text-sm font-medium mb-1 block">Bayrak Emojisi</label><Input value={customCountryFlag} onChange={(e) => setCustomCountryFlag(e.target.value)} placeholder="🏳️" /></div></div>}
            <div><label className="text-sm font-medium mb-1 block">Maaş (₺)</label><Input type="number" value={newEmployeeSalary} onChange={(e) => setNewEmployeeSalary(e.target.value)} placeholder="0" /></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setAddEmployeeDialogOpen(false)}>İptal</Button><Button onClick={handleAddEmployee}>Çalışan Ekle</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
