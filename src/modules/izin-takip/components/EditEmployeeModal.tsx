import { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Employee, DEPARTMENTS } from '@/modules/izin-takip/types/employee';
import PhotoUpload from '@/modules/izin-takip/components/PhotoUpload';

interface EditEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onUpdate: (employeeId: string, updates: Partial<Omit<Employee, 'id'>>) => Promise<boolean>;
  onDelete: (employeeId: string) => Promise<boolean>;
  onCorrectLeave: (employeeId: string, newUsedLeave: number) => Promise<boolean>;
}

const EditEmployeeModal = ({ open, onOpenChange, employee, onUpdate, onDelete, onCorrectLeave }: EditEmployeeModalProps) => {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [department, setDepartment] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [photoUrl, setPhotoUrl] = useState('');
  const [totalLeave, setTotalLeave] = useState('');
  const [usedLeave, setUsedLeave] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (employee) {
      setName(employee.name); setSurname(employee.surname); setDepartment(employee.department);
      setGender(employee.gender); setPhotoUrl(employee.photoUrl || '');
      setTotalLeave(employee.totalLeave.toString()); setUsedLeave(employee.usedLeave.toString());
    }
  }, [employee]);

  if (!employee) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !surname || !department) return;
    setIsSubmitting(true);

    const newUsedLeave = parseInt(usedLeave, 10);
    const updates: Partial<Omit<Employee, 'id'>> = {
      name, surname, department, gender, photoUrl, totalLeave: parseInt(totalLeave, 10),
    };

    const updateSuccess = await onUpdate(employee.id, updates);
    if (updateSuccess && newUsedLeave !== employee.usedLeave) {
      await onCorrectLeave(employee.id, newUsedLeave);
    }

    setIsSubmitting(false);
    if (updateSuccess) onOpenChange(false);
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    const success = await onDelete(employee.id);
    setIsSubmitting(false);
    if (success) onOpenChange(false);
  };

  const remainingLeave = parseInt(totalLeave, 10) - parseInt(usedLeave, 10);
  const isValidLeave = !isNaN(remainingLeave) && remainingLeave >= 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-0 shadow-elevated max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Pencil className="h-5 w-5 text-primary" />
            Personel Düzenle
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Personel bilgilerini ve izin durumunu güncelleyin
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-foreground">Ad</Label>
              <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)}
                className="bg-background border-input" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-surname" className="text-foreground">Soyad</Label>
              <Input id="edit-surname" value={surname} onChange={(e) => setSurname(e.target.value)}
                className="bg-background border-input" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Departman</Label>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="bg-background border-input"><SelectValue placeholder="Departman seçin" /></SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((dept) => (<SelectItem key={dept} value={dept}>{dept}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Cinsiyet</Label>
            <RadioGroup value={gender} onValueChange={(v) => setGender(v as 'male' | 'female')} className="flex gap-4">
              <div className="flex items-center space-x-2"><RadioGroupItem value="male" id="edit-male" /><Label htmlFor="edit-male" className="text-foreground cursor-pointer">Erkek</Label></div>
              <div className="flex items-center space-x-2"><RadioGroupItem value="female" id="edit-female" /><Label htmlFor="edit-female" className="text-foreground cursor-pointer">Kadın</Label></div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Fotoğraf</Label>
            <PhotoUpload currentPhotoUrl={photoUrl} onPhotoChange={setPhotoUrl} />
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-4">
            <h4 className="font-medium text-foreground">İzin Bilgileri</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Toplam İzin (gün)</Label>
                <Input type="number" min="0" value={totalLeave} onChange={(e) => setTotalLeave(e.target.value)}
                  className="bg-background border-input" required />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground">Kullanılan İzin (gün)</Label>
                <Input type="number" min="0" max={totalLeave} value={usedLeave} onChange={(e) => setUsedLeave(e.target.value)}
                  className="bg-background border-input" required />
              </div>
            </div>
            {isValidLeave ? (
              <p className="text-sm text-muted-foreground">Kalan izin: <span className="font-semibold text-accent">{remainingLeave} gün</span></p>
            ) : (
              <p className="text-sm text-destructive">Kullanılan izin, toplam izinden fazla olamaz!</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" className="flex items-center gap-2" disabled={isSubmitting}>
                  <Trash2 className="h-4 w-4" />Sil
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Personeli silmek istediğinize emin misiniz?</AlertDialogTitle>
                  <AlertDialogDescription>{employee.name} {employee.surname} kalıcı olarak silinecek.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>İptal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">Evet, Sil</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1" disabled={isSubmitting}>İptal</Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isSubmitting || !isValidLeave}>
              {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployeeModal;
