import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Module } from "@/data/modules";

interface ModuleCardProps {
  module: Module;
  index: number;
}

const ModuleCard = ({ module, index }: ModuleCardProps) => {
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotateX((y - centerY) / centerY * -6);
    setRotateY((x - centerX) / centerX * 6);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      style={{
        perspective: "800px",
      }}
    >
      <motion.button
        onClick={() => {
          if (module.embedded) {
            navigate(module.url);
          } else {
            window.open(module.url, '_blank', 'noopener,noreferrer');
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative flex flex-col items-center gap-3 w-full rounded-2xl p-6 text-center card-premium cursor-pointer"
        style={{ transformStyle: "preserve-3d" }}
        whileTap={{ scale: 0.97 }}
      >
        {/* Glow on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ boxShadow: "var(--shadow-glow)" }}
        />

        {/* 3D Icon with float */}
        <motion.div
          className="relative w-[72px] h-[72px] flex items-center justify-center"
          style={{ transformStyle: "preserve-3d", translateZ: 20 }}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
        >
          <img
            src={module.icon3d}
            alt={module.title}
            width={72}
            height={72}
            loading="lazy"
            className="w-[72px] h-[72px] object-contain drop-shadow-md"
          />
        </motion.div>

        {/* Content */}
        <div className="space-y-1 mt-1" style={{ transform: "translateZ(10px)" }}>
          <h3 className="font-heading text-sm font-bold text-foreground leading-snug">
            {module.title}
          </h3>
          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
            {module.description}
          </p>
        </div>

        {/* Category badge */}
        <span className="text-[10px] font-semibold tracking-wide uppercase text-primary/70 bg-primary/5 px-2.5 py-1 rounded-lg">
          {module.category}
        </span>

        {/* Arrow indicator */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          <ArrowUpRight className="h-4 w-4 text-primary" />
        </div>
      </motion.button>
    </motion.div>
  );
};

export default ModuleCard;
