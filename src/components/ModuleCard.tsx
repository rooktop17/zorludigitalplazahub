import { useNavigate } from "react-router-dom";
import { ExternalLink } from "lucide-react";
import type { Module } from "@/data/modules";

interface ModuleCardProps {
  module: Module;
  index: number;
}

const ModuleCard = ({ module, index }: ModuleCardProps) => {
  const navigate = useNavigate();
  const Icon = module.icon;

  return (
    <button
      onClick={() => navigate(`/module/${module.id}`)}
      className="group relative flex flex-col gap-4 rounded-xl border border-border bg-card p-6 text-left transition-all duration-300 hover:bg-card-hover card-hover-glow"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Icon */}
      <div
        className="flex h-12 w-12 items-center justify-center rounded-lg"
        style={{ backgroundColor: `hsl(${module.color} / 0.12)` }}
      >
        <Icon
          className="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
          style={{ color: `hsl(${module.color})` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
          {module.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {module.description}
        </p>
      </div>

      {/* Category badge */}
      <div className="flex items-center justify-between">
        <span className="rounded-md bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground">
          {module.category}
        </span>
        <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </div>
    </button>
  );
};

export default ModuleCard;
