import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { modules } from "@/data/modules";
import IframeLoader from "@/components/IframeLoader";
import zorluLogo from "@/assets/zorlu-logo.png";

const ModuleViewer = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const module = modules.find((m) => m.id === moduleId);
  const [iframeLoaded, setIframeLoaded] = useState(false);

  if (!module) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔍</span>
          </div>
          <p className="text-foreground font-heading font-semibold mb-2">Modül bulunamadı</p>
          <p className="text-muted-foreground text-sm mb-4">Bu modül mevcut değil veya kaldırılmış.</p>
          <button
            onClick={() => navigate("/")}
            className="text-primary text-sm font-medium hover:underline"
          >
            ← Ana sayfaya dön
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Toolbar */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 border-b border-border glass px-4 h-14 shrink-0"
      >
        <motion.button
          onClick={() => navigate("/")}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-foreground transition-colors hover:bg-accent"
        >
          <ArrowLeft className="h-4 w-4" />
        </motion.button>

        <img src={zorluLogo} alt="Zorlu" className="h-6 w-auto" />
        <div className="h-5 w-px bg-border" />

        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <img
            src={module.icon3d}
            alt={module.title}
            className="h-7 w-7 object-contain"
          />
          <h2 className="font-heading text-sm font-semibold text-foreground truncate">
            {module.title}
          </h2>
          <span className="text-[10px] font-semibold tracking-wide uppercase text-primary/70 bg-primary/5 px-2 py-0.5 rounded-md hidden sm:inline">
            {module.category}
          </span>
        </div>

        <motion.a
          href={module.url}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex h-9 items-center gap-1.5 rounded-xl bg-secondary px-3.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Yeni Sekmede Aç</span>
        </motion.a>
      </motion.div>

      {/* Iframe */}
      <div className="flex-1 relative">
        {!iframeLoaded && <IframeLoader />}
        <iframe
          src={module.url}
          className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-500 ${
            iframeLoaded ? "opacity-100" : "opacity-0"
          }`}
          title={module.title}
          allow="clipboard-read; clipboard-write"
          onLoad={() => setIframeLoaded(true)}
        />
      </div>
    </div>
  );
};

export default ModuleViewer;
