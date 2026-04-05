import { Building2, Calendar, Clock, Pencil, FileText, FileSpreadsheet } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Employee } from '@/modules/izin-takip/types/employee';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface EmployeeCardProps {
  employee: Employee;
  onAddLeave: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onPrintDocument: (employee: Employee) => void;
  onViewStatement: (employee: Employee) => void;
}

const EmployeeCard = ({ employee, onAddLeave, onEdit, onPrintDocument, onViewStatement }: EmployeeCardProps) => {
  const remainingLeave = employee.totalLeave - employee.usedLeave;
  const usagePercentage = (remainingLeave / employee.totalLeave) * 100;
  
  const getProgressColor = () => {
    if (usagePercentage > 60) return 'bg-green-500';
    if (usagePercentage > 30) return 'bg-yellow-500';
    return 'bg-destructive';
  };

  const getInitials = () => `${employee.name.charAt(0)}${employee.surname.charAt(0)}`.toUpperCase();

  return (
    <Card className="bg-card shadow-sm border-0 overflow-hidden h-full flex flex-col">
      <CardContent className="p-4 sm:p-5 flex flex-col flex-1">
        <div className="flex items-start gap-3 mb-4">
          <Avatar className="h-14 w-14 flex-shrink-0 ring-2 ring-primary/10">
            <AvatarImage src={employee.photoUrl} alt={`${employee.name} ${employee.surname}`} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-base">{getInitials()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0 overflow-hidden">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground text-base leading-tight line-clamp-1">{employee.name} {employee.surname}</h3>
              <span className={`inline-flex items-center justify-center w-5 h-5 flex-shrink-0 rounded-full text-xs ${
                employee.gender === 'male' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'
              }`}>
                {employee.gender === 'male' ? '♂' : '♀'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
              <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{employee.department}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 flex-1">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 flex-shrink-0" /><span className="text-xs">Kalan İzin</span>
            </span>
            <span className="font-semibold text-foreground text-sm">{remainingLeave} / {employee.totalLeave} gün</span>
          </div>
          
          <div className="relative">
            <Progress value={usagePercentage} className="h-2 bg-muted" />
            <div className={`absolute inset-y-0 left-0 rounded-full ${getProgressColor()}`} style={{ width: `${usagePercentage}%` }} />
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Kullanılan: {employee.usedLeave} gün</span>
            <span className={`font-medium ${usagePercentage > 60 ? 'text-green-500' : usagePercentage > 30 ? 'text-yellow-500' : 'text-destructive'}`}>
              %{Math.round(usagePercentage)} kaldı
            </span>
          </div>

          {employee.lastUpdated && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2 pt-2 border-t border-border">
              <Clock className="h-3 w-3 flex-shrink-0" />
              <span className="truncate text-[11px]">Son güncelleme: {format(new Date(employee.lastUpdated), 'd MMM yyyy, HH:mm', { locale: tr })}</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-4 gap-1.5 mt-4 pt-3 border-t border-border">
          <Button onClick={() => onEdit(employee)} variant="outline" size="sm" className="text-xs px-1.5 h-8">
            <Pencil className="h-3.5 w-3.5 mr-0.5" /><span className="hidden sm:inline">Düzenle</span><span className="sm:hidden">Düz.</span>
          </Button>
          <Button onClick={() => onPrintDocument(employee)} variant="outline" size="sm" className="text-xs px-1.5 h-8">
            <FileText className="h-3.5 w-3.5 mr-0.5" /><span>Belge</span>
          </Button>
          <Button onClick={() => onViewStatement(employee)} variant="outline" size="sm" className="text-xs px-1.5 h-8">
            <FileSpreadsheet className="h-3.5 w-3.5 mr-0.5" /><span>Ekstre</span>
          </Button>
          <Button onClick={() => onAddLeave(employee)} className="text-xs px-1.5 h-8" size="sm">
            <Calendar className="h-3.5 w-3.5 mr-0.5" /><span>İzin</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeeCard;
