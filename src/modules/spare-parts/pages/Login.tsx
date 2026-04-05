import React, { useState } from 'react';
import { useLanguage } from '@/modules/spare-parts/contexts/LanguageContext';
import { useAuth } from '@/modules/spare-parts/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import zorluLogo from '@/modules/spare-parts/assets/zorlu-logo.png';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const { t, lang, setLang } = useLanguage();
  const { login, signup, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!authLoading && isAuthenticated) navigate('/module/spare-parts', { replace: true });
  }, [isAuthenticated, authLoading, navigate]);

  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (tab === 'login') {
        const result = await login(email, password);
        if (result.error) { setError(result.error); return; }
      } else {
        const result = await signup(email, password, name);
        if (result.error) { setError(result.error); return; }
      }
      navigate('/module/spare-parts');
    } finally { setLoading(false); }
  };

  const getStrength = (pw: string) => {
    let s = 0;
    if (pw.length >= 6) s++;
    if (pw.length >= 10) s++;
    if (/[A-Z]/.test(pw)) s++;
    if (/[0-9]/.test(pw)) s++;
    if (/[^A-Za-z0-9]/.test(pw)) s++;
    return s;
  };
  const strength = getStrength(password);
  const strengthColors = ['bg-destructive', 'bg-destructive', 'bg-yellow-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-500'];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-4 right-4 flex rounded-full bg-card/80 backdrop-blur p-0.5 border border-border">
        <button onClick={() => setLang('tr')} className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${lang === 'tr' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>🇹🇷 TR</button>
        <button onClick={() => setLang('en')} className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${lang === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`}>🇬🇧 EN</button>
      </div>
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg p-8 shadow-xl">
          <div className="text-center mb-8">
            <img src={zorluLogo} alt="Zorlu Digital Plaza" className="h-16 w-auto mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground">{t('auth.welcome')}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t('auth.subtitle')}</p>
          </div>
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-destructive/10 text-destructive text-sm"><AlertCircle size={16} />{error}</div>
          )}
          <div className="flex rounded-lg bg-muted p-1 mb-6">
            <button onClick={() => setTab('login')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${tab === 'login' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>{t('auth.login')}</button>
            <button onClick={() => setTab('signup')} className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${tab === 'signup' ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}>{t('auth.signup')}</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input type="text" placeholder={t('auth.name')} value={name} onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-card text-sm outline-none transition-all" />
              </div>
            )}
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type="email" placeholder={t('auth.email')} value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-input bg-card text-sm outline-none transition-all" />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input type={showPassword ? 'text' : 'password'} placeholder={t('auth.password')} value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full pl-10 pr-10 py-3 rounded-lg border border-input bg-card text-sm outline-none transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {password && (
              <div className="flex gap-1">{[0, 1, 2, 3, 4].map(i => <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < strength ? strengthColors[strength] : 'bg-muted'}`} />)}</div>
            )}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-all disabled:opacity-50">
              {loading ? t('common.loading') : (tab === 'login' ? t('auth.login') : t('auth.signup'))}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
