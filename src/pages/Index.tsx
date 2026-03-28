import { useState } from "react";
import { Search, LayoutGrid } from "lucide-react";
import { modules, categories } from "@/data/modules";
import ModuleCard from "@/components/ModuleCard";
import zorluLogo from "@/assets/zorlu-logo.png";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filtered = modules.filter((m) => {
    const matchesCategory = !activeCategory || m.category === activeCategory;
    const matchesSearch =
      !search ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center gap-4">
          <img
            src={zorluLogo}
            alt="Zorlu Digital Plaza"
            className="h-9 w-auto"
          />
          <div className="h-7 w-px bg-border" />
          <div>
            <h1 className="font-heading text-[15px] font-bold text-foreground leading-tight">
              Digital Plaza Hub
            </h1>
            <p className="text-[11px] text-muted-foreground">
              Yönetim Merkezi
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Hero Section */}
        <div className="mb-8">
          <h2 className="font-heading text-[28px] font-extrabold text-foreground tracking-tight mb-1">
            Modüller
          </h2>
          <p className="text-muted-foreground text-sm">
            Tüm Zorlu Digital Plaza araçlarına tek noktadan erişin.
          </p>
        </div>

        {/* Search + Filter Bar */}
        <div className="mb-8 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Modül ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 rounded-lg border border-border bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-primary/40 transition-all"
            />
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setActiveCategory(null)}
              className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
                !activeCategory
                  ? "bg-foreground text-background shadow-sm"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              Tümü
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-foreground text-background shadow-sm"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="mb-5 flex items-center gap-2 text-muted-foreground">
          <LayoutGrid className="h-3.5 w-3.5" />
          <span className="text-xs font-medium">
            {filtered.length} modül
          </span>
        </div>

        {/* Module Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((module, i) => (
            <ModuleCard key={module.id} module={module} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-muted-foreground text-sm">Sonuç bulunamadı</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
