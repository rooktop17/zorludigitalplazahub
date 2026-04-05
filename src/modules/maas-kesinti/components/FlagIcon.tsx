import palestineFlag from '@/assets/flags/palestine.jpeg';

interface FlagIconProps { country: string; className?: string; }

const KKTCFlag = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 60 40" className={className}>
    <rect width="60" height="40" fill="#FFFFFF" />
    <rect y="6" width="60" height="4" fill="#E30A17" />
    <rect y="30" width="60" height="4" fill="#E30A17" />
    <g transform="translate(30, 20)"><circle r="8" fill="#E30A17" /><circle r="6.5" cx="2.5" fill="#FFFFFF" /><polygon points="6,0 7.5,4.5 12,4.5 8.5,7.5 10,12 6,9 2,12 3.5,7.5 0,4.5 4.5,4.5" fill="#E30A17" transform="translate(2, -6) scale(0.6)" /></g>
  </svg>
);

export function FlagIcon({ country, className = "w-6 h-6" }: FlagIconProps) {
  if (country === 'KKTC') return <div className={`${className} rounded-sm overflow-hidden shadow-sm border border-border`}><KKTCFlag className="w-full h-full" /></div>;
  if (country === 'FİLİSTİN') return <img src={palestineFlag} alt="Filistin Bayrağı" className={`${className} rounded-sm object-cover shadow-sm border border-border`} />;
  const flagEmojis: Record<string, string> = { 'TÜRKMENİSTAN': '🇹🇲', 'PAKİSTAN': '🇵🇰' };
  return <span className="text-xl">{flagEmojis[country] || '🏳️'}</span>;
}
