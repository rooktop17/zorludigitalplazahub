import React, { useState, useEffect } from 'react';
import Layout from '@/modules/spare-parts/components/Layout';
import { useLanguage } from '@/modules/spare-parts/contexts/LanguageContext';
import { useAuth } from '@/modules/spare-parts/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/untypedClient';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const SettingsPage: React.FC = () => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    const fetch = async () => { const { data } = await supabase.from('company_settings').select('*').limit(1).single(); if (data) setSettings(data); setLoading(false); };
    fetch();
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);
    const { id, created_at, updated_at, ...updates } = settings;
    const { error } = await supabase.from('company_settings').update(updates).eq('id', id);
    if (error) toast({ title: t('common.error'), description: error.message, variant: 'destructive' });
    else toast({ title: t('common.success'), description: t('settings.saved') });
    setSaving(false);
  };

  if (loading) return <Layout><div className="flex items-center justify-center py-20"><div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" /></div></Layout>;
  if (!settings) return <Layout><div className="text-center py-20 text-muted-foreground">{t('common.noData')}</div></Layout>;

  const Field = ({ label, field, type = 'text' }: { label: string; field: string; type?: string }) => (
    <div><label className="text-sm font-medium text-foreground">{label}</label><Input type={type} value={settings[field] || ''} disabled={!isAdmin} onChange={e => setSettings({ ...settings, [field]: e.target.value })} /></div>
  );

  return (
    <Layout>
      <div className="max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">{t('settings.title')}</h1>
          {isAdmin && <Button onClick={handleSave} disabled={saving}><Save size={18} /> {saving ? t('common.loading') : t('common.save')}</Button>}
        </div>
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="font-bold text-foreground text-lg">{t('footer.company')}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={t('settings.companyName')} field="company_name" />
              <Field label={t('settings.brandName')} field="brand_name" />
              <Field label={t('settings.address')} field="address" />
              <Field label={t('settings.phone')} field="phone" />
              <Field label={t('settings.email')} field="email" type="email" />
              <Field label={t('settings.workingHours')} field="working_hours" />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
