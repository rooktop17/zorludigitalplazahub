import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ModuleHeaderProps {
  title: string;
}

export default function ModuleHeader({ title }: ModuleHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="sticky top-0 z-50 flex items-center gap-3 bg-background/80 backdrop-blur-md border-b px-4 py-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/")}
        className="gap-1.5 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Hub</span>
      </Button>
      <span className="text-sm font-medium truncate">{title}</span>
    </div>
  );
}
