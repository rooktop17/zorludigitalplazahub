import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Module } from "@/data/modules";

interface ModuleCardProps {
  module: Module;
  index: number;
}

const ModuleCard = ({ module, index }: ModuleCardProps) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/module/${module.id}`)}
      className="group relative flex flex-col items-center gap-4 rounded-2xl p-6 text-center card-premium"
      style={{
        animationDelay: `${index * 60}ms`,
        animation: "fade-in 0.5s ease-out forwards",
        opacity: 0,
      }}
    >
      {/* 3D Icon */}
      <div className="relative w-20 h-20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
        <img
          src={module.icon3d}
          alt={module.title}
          width={80}
          height={80}
          loading="lazy"
          className="w-20 h-20 object-contain drop-shadow-lg"
        />
      </div>

      {/* Content */}
      <div className="flex-1 space-y-1.5">
        <h3 className="font-heading text-base font-bold text-foreground">
          {module.title}
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {module.description}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
        <span>Aç</span>
        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
      </div>
    </button>
  );
};

export default ModuleCard;
