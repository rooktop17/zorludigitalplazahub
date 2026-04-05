import React, { useState, useEffect } from 'react';
import Layout from '@/modules/spare-parts/components/Layout';
import { useLanguage } from '@/modules/spare-parts/contexts/LanguageContext';
import { useAuth } from '@/modules/spare-parts/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/untypedClient';
import { Shield, ShieldCheck, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Navigate } from 'react-router-dom';

const AdminPanel: React.FC = () => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;
    const fetch = async () => {
      const { data: profiles } = await supabase.from('profiles').select('*');
      const { data: roles } = await supabase.from('user_roles').select('*');
      const merged = (profiles || []).map((p: any) => ({ ...p, role: (roles || []).find((r: any) => r.user_id === p.user_id)?.role || 'technician', role_id: (roles || []).find((r: any) => r.user_id === p.user_id)?.id }));
      setUsers(merged); setLoading(false);
    };
    fetch();
  }, [isAdmin]);

  if (!isAdmin) return <Navigate to="/module/spare-parts" replace />;

  const changeRole = async (userId: string, roleId: string | undefined, newRole: string) => {
    try {
      if (roleId) await supabase.from('user_roles').update({ role: newRole }).eq('id', roleId);
      else await supabase.from('user_roles').insert({ user_id: userId, role: newRole });
      setUsers(users.map(u => u.user_id === userId ? { ...u, role: newRole } : u));
      toast({ title: t('common.success') });
    } catch (err: any) { toast({ title: t('common.error'), description: err.message, variant: 'destructive' }); }
  };

  return (
    <Layout>
      <div>
        <div className="flex items-center gap-3 mb-6"><Shield size={28} className="text-primary" /><h1 className="text-2xl font-bold text-foreground">{t('admin.title')}</h1></div>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border flex items-center gap-2"><Users size={20} className="text-muted-foreground" /><h2 className="font-bold">{t('admin.users')}</h2></div>
          <Table>
            <TableHeader><TableRow><TableHead>Kullanıcı</TableHead><TableHead>{t('admin.roles')}</TableHead><TableHead className="text-right">{t('common.actions')}</TableHead></TableRow></TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={3} className="text-center py-8">{t('common.loading')}</TableCell></TableRow>
              : users.map(user => (
                <TableRow key={user.id}>
                  <TableCell><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{(user.display_name || 'U').charAt(0).toUpperCase()}</div><div><p className="font-medium">{user.display_name}</p><p className="text-xs text-muted-foreground">{user.user_id?.slice(0, 8)}...</p></div></div></TableCell>
                  <TableCell><span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>{user.role === 'admin' ? <ShieldCheck size={14} /> : <Shield size={14} />}{user.role === 'admin' ? 'Admin' : 'Teknisyen'}</span></TableCell>
                  <TableCell className="text-right">{user.role === 'admin' ? <Button variant="outline" size="sm" onClick={() => changeRole(user.user_id, user.role_id, 'technician')}>{t('admin.makeTechnician')}</Button> : <Button variant="outline" size="sm" onClick={() => changeRole(user.user_id, user.role_id, 'admin')}>{t('admin.makeAdmin')}</Button>}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default AdminPanel;
