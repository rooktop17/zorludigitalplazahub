import { useNavigate } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
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
      className="group relative flex flex-col items-center gap-3 rounded-xl p-5 text-center card-premium animate-fade-in"
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Icon */}
      <div className="relative w-16 h-16 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-hover:-translate-y-0.5">
        <img
          src={module.icon3d}
          alt={module.title}
          width={64}
          height={64}
          loading="lazy"
          className="w-16 h-16 object-contain drop-shadow-sm"
        />
      </div>

      {/* Content */}
      <div className="space-y-1">
        <h3 className="font-heading text-[13px] font-bold text-foreground leading-snug">
          {module.title}
        </h3>
        <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
          {module.description}
        </p>
      </div>

      {/* Category badge */}
      <span className="text-[10px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-md">
        {module.category}
      </span>

      {/* Hover arrow */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight className="h-3.5 w-3.5 text-primary" />
      </div>
    </button>
  );
};

export default ModuleCard;
