import { useState, useRef } from 'react';
import { Employee, Advance } from '@/modules/maas-kesinti/types/employee';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { printIndividualPaySlip } from '@/modules/maas-kesinti/utils/printIndividualPaySlip';
import { User, Camera, Edit2, Check, X, Plus, Trash2, Wallet, TrendingDown, AlertTriangle, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from '@/components/ui/dialog';

interface EmployeeCardProps {
  employee: Employee;
  onUpdateSalary: (id: string, salary: number) => void;
  onUpdatePhoto: (id: string, photo: string | null) => void;
  onAddAdvance: (id: string, advance: Omit<Advance, 'id'>) => void;
  onRemoveAdvance: (employeeId: string, advanceId: string) => void;
  onDeleteEmployee: (employeeId: string) => void;
  remaining: number;
}

export function EmployeeCard({ employee, onUpdateSalary, onUpdatePhoto, onAddAdvance, onRemoveAdvance, onDeleteEmployee, remaining }: EmployeeCardProps) {
  const [isEditingSalary, setIsEditingSalary] = useState(false);
  const [salaryInput, setSalaryInput] = useState(employee.salary.toString());
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [advanceDate, setAdvanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [advanceDescription, setAdvanceDescription] = useState('');
  const [advanceDialogOpen, setAdvanceDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const formatCurrency = (amount: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(amount);
  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
  const totalAdvances = employee.advances.reduce((sum, adv) => sum + adv.amount, 0);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 pb-4">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-secondary flex items-center justify-center border-2 border-card shadow-md">
            {employee.photo ? <img src={employee.photo} alt={employee.name} className="w-full h-full object-cover" /> : <User className="w-10 h-10 text-muted-foreground" />}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground text-lg leading-tight">{employee.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{employee.country}</p>
            <div className="mt-2 flex items-center gap-2">
              {isEditingSalary ? (
                <div className="flex items-center gap-1">
                  <Input type="number" value={salaryInput} onChange={(e) => setSalaryInput(e.target.value)} className="w-28 h-8 text-sm" />
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { onUpdateSalary(employee.id, parseFloat(salaryInput) || 0); setIsEditingSalary(false); }}><Check className="h-4 w-4 text-green-500" /></Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setIsEditingSalary(false)}><X className="h-4 w-4 text-destructive" /></Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-sm font-semibold"><Wallet className="h-3 w-3 mr-1" />{formatCurrency(employee.salary)}</Badge>
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => { setSalaryInput(employee.salary.toString()); setIsEditingSalary(true); }}><Edit2 className="h-3.5 w-3.5 text-muted-foreground" /></Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1"><TrendingDown className="h-4 w-4" />Avanslar</h4>
            <Dialog open={advanceDialogOpen} onOpenChange={setAdvanceDialogOpen}>
              <DialogTrigger asChild><Button size="sm" variant="outline" className="h-7 text-xs"><Plus className="h-3 w-3 mr-1" />Avans Ekle</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Avans Ekle - {employee.name}</DialogTitle></DialogHeader>
                <div className="space-y-4 pt-4">
                  <div><label className="text-sm font-medium mb-1 block">Tutar (₺)</label><Input type="number" value={advanceAmount} onChange={(e) => setAdvanceAmount(e.target.value)} placeholder="Avans tutarı" /></div>
                  <div><label className="text-sm font-medium mb-1 block">Tarih</label><Input type="date" value={advanceDate} onChange={(e) => setAdvanceDate(e.target.value)} /></div>
                  <div><label className="text-sm font-medium mb-1 block">Açıklama</label><Input value={advanceDescription} onChange={(e) => setAdvanceDescription(e.target.value)} placeholder="Opsiyonel" /></div>
                  <Button onClick={() => { const amount = parseFloat(advanceAmount) || 0; if (amount > 0) { onAddAdvance(employee.id, { amount, date: advanceDate, description: advanceDescription.trim() || undefined }); setAdvanceAmount(''); setAdvanceDescription(''); setAdvanceDialogOpen(false); } }} className="w-full">Avans Ekle</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          {employee.advances.length > 0 ? (
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {employee.advances.map((advance) => (
                <div key={advance.id} className="flex items-center justify-between bg-secondary/50 rounded-lg px-3 py-2 text-sm">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2"><span className="font-medium text-destructive">-{formatCurrency(advance.amount)}</span><span className="text-muted-foreground text-xs">{formatDate(advance.date)}</span></div>
                    {advance.description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{advance.description}</p>}
                  </div>
                  <Button size="icon" variant="ghost" className="h-6 w-6 flex-shrink-0" onClick={() => onRemoveAdvance(employee.id, advance.id)}><Trash2 className="h-3.5 w-3.5 text-destructive" /></Button>
                </div>
              ))}
            </div>
          ) : <p className="text-xs text-muted-foreground italic">Henüz avans yok</p>}
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Toplam Avans:</span><span className="font-medium text-destructive">-{formatCurrency(totalAdvances)}</span></div>
          <div className="flex justify-between items-center"><span className="font-semibold text-foreground">Ayın 1'inde Ödenecek:</span><span className={`text-xl font-bold ${remaining >= 0 ? 'text-green-500' : 'text-destructive'}`}>{formatCurrency(remaining)}</span></div>
        </div>
        <div className="border-t pt-4 space-y-2">
          <Button variant="outline" size="sm" className="w-full" onClick={() => { const now = new Date(); printIndividualPaySlip({ employee, month: now.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' }), paymentDate: new Date(now.getFullYear(), now.getMonth() + 1, 1).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) }); }}><FileText className="h-4 w-4 mr-2" />Maaş Bordrosu Al</Button>
          <Button variant="outline" size="sm" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setDeleteDialogOpen(true)}><Trash2 className="h-4 w-4 mr-2" />Çalışanı Sil</Button>
        </div>
      </CardContent>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" />Çalışanı Sil</DialogTitle><DialogDescription><strong>{employee.name}</strong> isimli çalışanı silmek istediğinize emin misiniz?</DialogDescription></DialogHeader>
          <DialogFooter><Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>İptal</Button><Button variant="destructive" onClick={() => { onDeleteEmployee(employee.id); setDeleteDialogOpen(false); }}>Sil</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
