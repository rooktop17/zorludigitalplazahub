import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getGreeting } from '@/modules/spare-parts/lib/greetings';
import { useLanguage } from '@/modules/spare-parts/contexts/LanguageContext';

const GreetingBanner: React.FC = () => {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(true);
  const [greeting, setGreeting] = useState(getGreeting(lang));

  useEffect(() => { setGreeting(getGreeting(lang)); }, [lang]);

  if (!visible) return null;

  return (
    <div className="relative overflow-hidden rounded-lg bg-primary/10 border border-primary/20 p-4 mb-6">
      <button onClick={() => setVisible(false)} className="absolute top-2 right-2 p-1 rounded-full hover:bg-primary/10 transition-colors text-muted-foreground"><X size={16} /></button>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{greeting.specialGreeting ? '🎉' : '👋'}</span>
        <div>
          <h3 className="font-bold text-foreground text-lg">{greeting.timeGreeting}</h3>
          {greeting.specialGreeting && <p className="text-sm text-primary font-medium mt-0.5">{greeting.specialGreeting}</p>}
        </div>
      </div>
    </div>
  );
};

export default GreetingBanner;
