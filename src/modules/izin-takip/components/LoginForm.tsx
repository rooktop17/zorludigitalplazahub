import { useState } from 'react';
import { LogIn, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ModuleHeader from '@/components/ModuleHeader';
import zorluLogo from '@/assets/zorlu-logo.png';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<{ error: any }>;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: authError } = await onLogin(email, password);
    if (authError) setError('E-posta veya şifre hatalı.');
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <Card className="w-full max-w-md bg-card border-0 shadow-lg">
        <CardHeader className="text-center space-y-4 pb-2">
          <img src={zorluLogo} alt="Zorlu Digital Plaza" className="h-12 mx-auto object-contain" />
          <CardTitle className="text-xl text-foreground">Personel İzin Takip Sistemi</CardTitle>
          <p className="text-sm text-muted-foreground">Hesabınıza giriş yapın</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">E-posta</Label>
              <Input id="email" type="email" placeholder="ornek@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)} className="bg-background border-input" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Şifre</Label>
              <Input id="password" type="password" placeholder="••••••••" value={password}
                onChange={(e) => setPassword(e.target.value)} className="bg-background border-input" required />
            </div>
            {error && <p className="text-sm text-destructive text-center">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <LogIn className="h-4 w-4 mr-2" />}
              Giriş Yap
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
