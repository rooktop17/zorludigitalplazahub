import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { modules } from "@/data/modules";
import zorluLogo from "@/assets/zorlu-logo.png";

const ModuleViewer = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const module = modules.find((m) => m.id === moduleId);

  if (!module) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Modül bulunamadı</p>
          <button
            onClick={() => navigate("/")}
            className="text-primary underline text-sm"
          >
            Ana sayfaya dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-3 border-b border-border bg-card px-4 py-3">
        <button
          onClick={() => navigate("/")}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground transition-colors hover:bg-secondary/80"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>

        <img src={zorluLogo} alt="Zorlu" className="h-6 w-auto" />

        <div className="h-6 w-px bg-border" />

        <div className="flex items-center gap-3 flex-1 min-w-0">
          <img
            src={module.icon3d}
            alt={module.title}
            className="h-7 w-7 object-contain"
          />
          <h2 className="font-heading text-sm font-semibold text-foreground truncate">
            {module.title}
          </h2>
        </div>

        <a
          href={module.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-9 items-center gap-2 rounded-xl bg-secondary px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Yeni Sekmede Aç</span>
        </a>
      </div>

      {/* Iframe */}
      <div className="flex-1 relative">
        <iframe
          src={module.url}
          className="absolute inset-0 h-full w-full border-0"
          title={module.title}
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </div>
  );
};

export default ModuleViewer;
