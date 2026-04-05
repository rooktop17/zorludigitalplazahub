import React, { useState } from 'react';
import { useLanguage } from '@/modules/spare-parts/contexts/LanguageContext';
import { useAuth } from '@/modules/spare-parts/contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import zorluLogo from '@/modules/spare-parts/assets/zorlu-logo.png';
import {
  LayoutDashboard, Package, ShoppingCart, FileText, BarChart3,
  Settings, Phone, LogOut, Menu, X, Wrench, Shield
} from 'lucide-react';

const Header: React.FC<{ sidebarOpen: boolean; setSidebarOpen: (v: boolean) => void }> = ({ sidebarOpen, setSidebarOpen }) => {
  const { lang, setLang, t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur border-b border-border/50 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <img src={zorluLogo} alt="Zorlu" className="h-8 w-auto" />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex rounded-full bg-muted p-0.5">
          <button onClick={() => setLang('tr')} className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${lang === 'tr' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>🇹🇷 TR</button>
          <button onClick={() => setLang('en')} className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${lang === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>🇬🇧 EN</button>
        </div>
        {user && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
              {(user.email ?? 'U').charAt(0).toUpperCase()}
            </div>
            <button onClick={() => { logout(); navigate('/module/spare-parts/login'); }} className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground" title={t('nav.logout')}>
              <LogOut size={18} />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

interface NavItem { key: string; icon: React.ReactNode; path: string; }

const Sidebar: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { t } = useLanguage();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const base = '/module/spare-parts';

  const navItems: NavItem[] = [
    { key: 'nav.dashboard', icon: <LayoutDashboard size={20} />, path: base },
    { key: 'nav.categories', icon: <Package size={20} />, path: `${base}/categories` },
    { key: 'nav.parts', icon: <Wrench size={20} />, path: `${base}/parts` },
    { key: 'nav.sales', icon: <ShoppingCart size={20} />, path: `${base}/sales` },
    { key: 'nav.invoices', icon: <FileText size={20} />, path: `${base}/invoices` },
    { key: 'nav.reports', icon: <BarChart3 size={20} />, path: `${base}/reports` },
    { key: 'nav.settings', icon: <Settings size={20} />, path: `${base}/settings` },
    { key: 'nav.contact', icon: <Phone size={20} />, path: `${base}/contact` },
    ...(isAdmin ? [{ key: 'nav.admin', icon: <Shield size={20} />, path: `${base}/admin` }] : []),
  ];

  return (
    <>
      {open && <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed left-0 top-0 z-50 h-full w-64 bg-sidebar text-sidebar-foreground transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:z-auto ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-5 border-b border-sidebar-border">
          <img src={zorluLogo} alt="Zorlu Digital Plaza" className="h-10 w-auto brightness-0 invert" />
          <p className="text-xs text-sidebar-foreground/60 mt-1">Spare Parts Management</p>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <button key={item.key} onClick={() => { navigate(item.path); onClose(); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`}>
                {item.icon}
                {t(item.key)}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

const Footer: React.FC = () => {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="font-bold text-foreground mb-3">{t('nav.contact')}</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📧 <a href="mailto:deniz@zorludigitalplaza.com" className="hover:text-primary transition-colors">deniz@zorludigitalplaza.com</a></p>
              <p>📱 <a href="tel:+905488783131" className="hover:text-primary transition-colors">+90 548 878 31 31</a></p>
              <p>💬 <a href="https://wa.me/905488783131" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">{t('contact.whatsapp')}</a></p>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-3">{t('footer.company')}</h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Zorlu Digital Trade and Services Ltd.</p>
              <p>Nicosia, KKTC</p>
              <p className="font-mono text-xs">VKN: MS 16664 | Tax ID: 99003199</p>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-foreground mb-3">{t('footer.social')}</h4>
            <div className="flex gap-3 flex-wrap">
              {[
                { label: '📺', url: 'https://youtube.com/@zorludigitalplaza', name: 'YouTube' },
                { label: '🐦', url: 'https://x.com/zorludigital', name: 'X' },
                { label: '📸', url: 'https://instagram.com/zorludigitalplaza', name: 'Instagram' },
                { label: '📘', url: 'https://facebook.com/zorludigitalplaza', name: 'Facebook' },
                { label: '🎵', url: 'https://tiktok.com/@zorludigitalplaza', name: 'TikTok' },
              ].map(s => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground text-sm transition-all">
                  <span>{s.label}</span><span className="text-xs">{s.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          <p>© 2024-2026 Zorlu Digital Plaza. {t('footer.rights')}</p>
          <p className="mt-1">v2.0 — {t('footer.builtWith')}</p>
        </div>
      </div>
    </footer>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-h-screen">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
