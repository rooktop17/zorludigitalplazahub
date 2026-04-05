import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { modules } from "@/data/modules";
import { ExternalLink } from "lucide-react";

const ModuleViewer = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const module = modules.find((m) => m.id === moduleId);

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
          <button onClick={() => navigate("/")} className="text-primary text-sm font-medium hover:underline">
            ← Ana sayfaya dön
          </button>
        </motion.div>
      </div>
    );
  }

  // For external modules, redirect to the external URL in a new tab and go back
  if (!module.embedded) {
    window.open(module.url, '_blank', 'noopener,noreferrer');
    navigate("/");
    return null;
  }

  return null;
};

export default ModuleViewer;
