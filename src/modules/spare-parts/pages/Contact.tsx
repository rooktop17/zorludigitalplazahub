import React, { useState } from 'react';
import Layout from '@/modules/spare-parts/components/Layout';
import { useLanguage } from '@/modules/spare-parts/contexts/LanguageContext';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';

const Contact: React.FC = () => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:deniz@zorludigitalplaza.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`${form.name}\n${form.email}\n${form.phone}\n\n${form.message}`)}`;
    window.open(mailto, '_blank');
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-foreground mb-6">{t('contact.title')}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-lg p-6 space-y-5">
              <div className="flex items-start gap-3"><span className="p-2.5 rounded-lg bg-primary/10 text-primary"><Phone size={20} /></span><div><p className="font-medium text-foreground">{t('contact.call')}</p><a href="tel:+905488783131" className="text-sm text-muted-foreground hover:text-primary">+90 548 878 31 31</a></div></div>
              <div className="flex items-start gap-3"><span className="p-2.5 rounded-lg bg-primary/10 text-primary"><Mail size={20} /></span><div><p className="font-medium text-foreground">E-posta</p><a href="mailto:deniz@zorludigitalplaza.com" className="text-sm text-muted-foreground hover:text-primary">deniz@zorludigitalplaza.com</a></div></div>
              <div className="flex items-start gap-3"><span className="p-2.5 rounded-lg bg-primary/10 text-primary"><MapPin size={20} /></span><div><p className="font-medium text-foreground">{t('contact.address')}</p><p className="text-sm text-muted-foreground">Nicosia, North Cyprus (KKTC)</p></div></div>
              <div className="flex items-start gap-3"><span className="p-2.5 rounded-lg bg-primary/10 text-primary"><Clock size={20} /></span><div><p className="font-medium text-foreground">{t('contact.hours')}</p><p className="text-sm text-muted-foreground">{t('contact.hoursValue')}</p></div></div>
            </div>
            <a href="https://wa.me/905488783131" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3.5 rounded-lg font-medium text-sm transition-all" style={{ background: '#25D366', color: '#fff' }}><MessageCircle size={20} />{t('contact.whatsapp')}</a>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder={t('contact.name')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-input bg-card text-sm outline-none" required />
              <input type="email" placeholder={t('contact.email')} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-input bg-card text-sm outline-none" required />
              <input type="tel" placeholder={t('contact.phone')} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-input bg-card text-sm outline-none" />
              <input type="text" placeholder={t('contact.subject')} value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-4 py-3 rounded-lg border border-input bg-card text-sm outline-none" required />
              <textarea placeholder={t('contact.message')} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} className="w-full px-4 py-3 rounded-lg border border-input bg-card text-sm outline-none resize-none" required />
              <button type="submit" className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 flex items-center justify-center gap-2"><Send size={18} />{t('contact.send')}</button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
