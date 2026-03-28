import { useState } from "react";
import { LayoutGrid } from "lucide-react";
import { modules, categories } from "@/data/modules";
import ModuleCard from "@/components/ModuleCard";
import zorluLogo from "@/assets/zorlu-logo.png";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = activeCategory
    ? modules.filter((m) => m.category === activeCategory)
    : modules;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center gap-5">
          <img
            src={zorluLogo}
            alt="Zorlu Digital Plaza"
            className="h-10 w-auto"
          />
          <div className="h-8 w-px bg-border" />
          <div>
            <h1 className="font-heading text-lg font-bold text-foreground">
              Digital Plaza Hub
            </h1>
            <p className="text-xs text-muted-foreground">
              Yönetim Merkezi
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Welcome */}
        <div className="mb-10">
          <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
            Hoş Geldiniz 👋
          </h2>
          <p className="text-muted-foreground text-sm">
            Tüm Zorlu Digital Plaza modüllerine buradan erişebilirsiniz.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
              !activeCategory
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            Tümü
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="mb-6 flex items-center gap-2 text-muted-foreground">
          <LayoutGrid className="h-4 w-4" />
          <span className="text-xs font-medium">
            {filtered.length} modül
          </span>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filtered.map((module, i) => (
            <ModuleCard key={module.id} module={module} index={i} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
