import { Bell, Search, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useDashboardStats } from '@/modules/dis-borc/hooks/useDashboardStats';
import { useAuth } from '@/modules/dis-borc/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function DisBorcHeader({ searchQuery, onSearchChange }: HeaderProps) {
  const { data: stats } = useDashboardStats();
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const alertCount = (stats?.overdueCount || 0) + (stats?.dueSoonCount || 0);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) { toast({ variant: 'destructive', title: 'Çıkış yapılamadı', description: error.message }); }
    else { toast({ title: 'Çıkış yapıldı', description: 'Güvenli bir şekilde çıkış yaptınız.' }); }
  };

  const getUserInitials = () => { if (!user?.email) return 'U'; return user.email.charAt(0).toUpperCase(); };

  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="hidden md:block"><h1 className="text-lg font-semibold text-foreground">Açık Hesap Takip Paneli</h1></div>
      </div>
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Fatura veya tedarikçi ara..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="pl-9 bg-background" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {alertCount > 0 && (<Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">{alertCount}</Badge>)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            {stats?.overdueCount ? (<DropdownMenuItem className="text-destructive"><span className="font-medium">{stats.overdueCount} vadesi geçmiş ödeme!</span></DropdownMenuItem>) : null}
            {stats?.dueSoonCount ? (<DropdownMenuItem className="text-yellow-600"><span className="font-medium">{stats.dueSoonCount} ödeme bu hafta vadesi doluyor</span></DropdownMenuItem>) : null}
            {alertCount === 0 && (<DropdownMenuItem className="text-muted-foreground">Bildirim yok</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Avatar className="h-8 w-8"><AvatarFallback className="bg-primary text-primary-foreground text-sm">{getUserInitials()}</AvatarFallback></Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem className="flex items-center gap-2"><User className="h-4 w-4" /><span className="truncate">{user?.email}</span></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2 text-destructive"><LogOut className="h-4 w-4" /><span>Çıkış Yap</span></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
