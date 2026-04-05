import React, { useState } from 'react';
import Layout from '@/modules/spare-parts/components/Layout';
import { useLanguage } from '@/modules/spare-parts/contexts/LanguageContext';
import { categories } from '@/modules/spare-parts/lib/categories';
import { Search } from 'lucide-react';
import * as Icons from 'lucide-react';

const Categories: React.FC = () => {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeBrand, setActiveBrand] = useState<string | null>(null);

  const filtered = categories.filter(c => c.name[lang].toLowerCase().includes(search.toLowerCase()));
  const selectedCat = categories.find(c => c.id === selectedCategory);

  const getIcon = (iconName: string) => {
    const IconComp = (Icons as any)[iconName];
    return IconComp ? <IconComp size={28} /> : <Icons.Package size={28} />;
  };

  if (selectedCat) {
    return (
      <Layout>
        <div>
          <button onClick={() => { setSelectedCategory(null); setActiveBrand(null); }} className="text-sm text-primary hover:underline mb-4 inline-flex items-center gap-1">← {t('common.back')}</button>
          <h2 className="text-2xl font-bold text-foreground mb-4">{selectedCat.name[lang]}</h2>
          <div className="flex gap-2 overflow-x-auto pb-3 mb-6">
            <button onClick={() => setActiveBrand(null)} className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm border transition-all ${!activeBrand ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'}`}>{t('categories.all')}</button>
            {selectedCat.brands.map(brand => (
              <button key={brand} onClick={() => setActiveBrand(activeBrand === brand ? null : brand)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm border transition-all ${activeBrand === brand ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground'}`}>{brand}</button>
            ))}
          </div>
          <div className="bg-card border border-border rounded-lg p-12 text-center">
            <Icons.Package size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">{activeBrand ? `${activeBrand} — ${selectedCat.name[lang]}` : selectedCat.name[lang]}</p>
            <p className="text-sm text-muted-foreground mt-2">{t('common.noData')}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-foreground">{t('categories.title')}</h2>
          <div className="relative w-full sm:w-72">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder={t('categories.search')} value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-card text-sm outline-none" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filtered.map((cat) => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)}
              className="bg-card border border-border rounded-lg p-5 flex flex-col items-center gap-3 text-center hover:border-primary/30 transition-all">
              <span className="p-3 rounded-xl bg-primary/10 text-primary">{getIcon(cat.icon)}</span>
              <span className="text-sm font-medium text-foreground leading-tight">{cat.name[lang]}</span>
              <span className="text-xs text-muted-foreground">{cat.brands.length} {lang === 'tr' ? 'marka' : 'brands'}</span>
            </button>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Categories;
