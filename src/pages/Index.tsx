import { useState, useEffect } from "react";
import { Search, LayoutGrid, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { modules, categories } from "@/data/modules";
import ModuleCard from "@/components/ModuleCard";
import PageLoader from "@/components/PageLoader";
import zorluLogo from "@/assets/zorlu-logo.png";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const filtered = modules.filter((m) => {
    const matchesCategory = !activeCategory || m.category === activeCategory;
    const matchesSearch =
      !search ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <AnimatePresence>{loading && <PageLoader />}</AnimatePresence>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="border-b border-border glass sticky top-0 z-10"
        >
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
        </motion.header>

        {/* Main */}
        <main className="mx-auto max-w-6xl px-6 py-10">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3, ease: [0.22, 1, 0.36, 1] }}
            className="mb-10"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-xs font-semibold text-primary tracking-wide uppercase">
                Zorlu Digital Plaza
              </span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-2">
              Tüm Modüller
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg">
              İş süreçlerinizi hızlandıran tüm araçlara tek noktadan erişin. 
              Operasyon, finans, İK ve satış modülleriniz burada.
            </p>
          </motion.div>

          {/* Search + Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="mb-8 flex flex-col sm:flex-row gap-3"
          >
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Modül ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-11 rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all shadow-sm"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5 items-center">
              {[null, ...categories].map((cat) => (
                <motion.button
                  key={cat ?? "all"}
                  onClick={() => setActiveCategory(cat)}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                    activeCategory === cat
                      ? "bg-foreground text-background shadow-md"
                      : "bg-card text-secondary-foreground border border-border hover:border-primary/20 hover:bg-card-hover"
                  }`}
                >
                  {cat ?? "Tümü"}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            className="mb-6 flex items-center gap-2 text-muted-foreground"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span className="text-xs font-medium">
              {filtered.length} modül gösteriliyor
            </span>
          </motion.div>

          {/* Module Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <AnimatePresence mode="popLayout">
              {filtered.map((module, i) => (
                <ModuleCard key={module.id} module={module} index={i} />
              ))}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm font-medium">Sonuç bulunamadı</p>
              <p className="text-muted-foreground/60 text-xs mt-1">Farklı bir arama deneyin</p>
            </motion.div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-border mt-10">
          <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
            <p className="text-[11px] text-muted-foreground">
              © 2026 Zorlu Digital Plaza. Tüm hakları saklıdır.
            </p>
            <img src={zorluLogo} alt="Zorlu" className="h-5 w-auto opacity-40" />
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
