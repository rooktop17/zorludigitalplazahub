import { useState } from 'react';
import { Key, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChangePasswordModal = ({ open, onOpenChange }: ChangePasswordModalProps) => {
  const { toast } = useToast();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast({ title: 'Hata', description: 'Şifre en az 6 karakter olmalı.', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'Hata', description: 'Şifreler eşleşmiyor.', variant: 'destructive' });
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      toast({ title: 'Hata', description: 'Şifre değiştirilemedi.', variant: 'destructive' });
    } else {
      toast({ title: 'Başarılı', description: 'Şifreniz başarıyla değiştirildi.' });
      setNewPassword('');
      setConfirmPassword('');
      onOpenChange(false);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm bg-card border-0 shadow-elevated">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <Key className="h-5 w-5 text-primary" />
            Şifre Değiştir
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-foreground">Yeni Şifre</Label>
            <Input id="new-password" type="password" placeholder="Minimum 6 karakter"
              value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
              className="bg-background border-input" required minLength={6} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-foreground">Şifre Tekrar</Label>
            <Input id="confirm-password" type="password" placeholder="Şifrenizi tekrarlayın"
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-background border-input" required minLength={6} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">İptal</Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Kaydet
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
