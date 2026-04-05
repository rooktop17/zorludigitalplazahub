import { useState } from 'react';
import { UserPlus, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Employee, DEFAULT_LEAVE_QUOTA, DEPARTMENTS } from '@/modules/izin-takip/types/employee';
import PhotoUpload from '@/modules/izin-takip/components/PhotoUpload';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AddEmployeeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (employee: Omit<Employee, 'id'>) => void;
}

const AddEmployeeModal = ({ open, onOpenChange, onAdd }: AddEmployeeModalProps) => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '', surname: '', department: '', gender: 'male' as 'male' | 'female',
    photoUrl: '', email: '', password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.surname || !formData.department || !formData.email || !formData.password) return;
    if (formData.password.length < 6) {
      toast({ title: 'Hata', description: 'Şifre en az 6 karakter olmalı.', variant: 'destructive' });
      return;
    }

    setSaving(true);

    const employeeData: Omit<Employee, 'id'> = {
      name: formData.name, surname: formData.surname, department: formData.department,
      gender: formData.gender, photoUrl: formData.photoUrl,
      totalLeave: DEFAULT_LEAVE_QUOTA, usedLeave: 0,
    };

    await onAdd(employeeData);

    if (formData.email && formData.password) {
      const { data: empData } = await supabase
        .from('employees')
        .select('id')
        .eq('name', formData.name)
        .eq('surname', formData.surname)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (empData) {
        const { data: { session } } = await supabase.auth.getSession();
        const res = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-employee-user`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session?.access_token}`,
            },
            body: JSON.stringify({ email: formData.email, password: formData.password, employeeId: empData.id }),
          }
        );

        if (!res.ok) {
          const err = await res.json();
          toast({ title: 'Uyarı', description: `Personel eklendi ancak hesap oluşturulamadı: ${err.error}`, variant: 'destructive' });
        } else {
          toast({ title: 'Başarılı', description: 'Personel ve giriş hesabı oluşturuldu.' });
        }
      }
    }

    setSaving(false);
    setFormData({ name: '', surname: '', department: '', gender: 'male', photoUrl: '', email: '', password: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-0 shadow-elevated max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <UserPlus className="h-5 w-5 text-primary" />
            Yeni Personel Ekle
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Ad</Label>
              <Input id="name" placeholder="Personel adı" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-background border-input" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="surname" className="text-foreground">Soyad</Label>
              <Input id="surname" placeholder="Personel soyadı" value={formData.surname}
                onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
                className="bg-background border-input" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="department" className="text-foreground">Departman</Label>
            <Select value={formData.department}
              onValueChange={(value) => setFormData({ ...formData, department: value })} required>
              <SelectTrigger className="bg-background border-input">
                <SelectValue placeholder="Departman seçin" />
              </SelectTrigger>
              <SelectContent>
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Cinsiyet</Label>
            <RadioGroup value={formData.gender}
              onValueChange={(value: 'male' | 'female') => setFormData({ ...formData, gender: value })}
              className="flex gap-6">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male" className="font-normal cursor-pointer">Erkek</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female" className="font-normal cursor-pointer">Kadın</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">Fotoğraf (İsteğe Bağlı)</Label>
            <PhotoUpload currentPhotoUrl={formData.photoUrl}
              onPhotoChange={(url) => setFormData({ ...formData, photoUrl: url })} />
          </div>

          <div className="border-t border-border pt-4 space-y-4">
            <p className="text-sm font-medium text-foreground">Giriş Hesabı</p>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">E-posta</Label>
              <Input id="email" type="email" placeholder="personel@email.com" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-background border-input" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Şifre</Label>
              <Input id="password" type="password" placeholder="Minimum 6 karakter" value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-background border-input" required minLength={6} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">İptal</Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Kaydet
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployeeModal;
