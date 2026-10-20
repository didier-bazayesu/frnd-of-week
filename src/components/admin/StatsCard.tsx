import { TrendingUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  accent?: 'purple' | 'pink' | 'green' | 'amber';
}

const accentMap = {
  purple: 'bg-purple-100 text-purple-600',
  pink: 'bg-pink-100 text-pink-600',
  green: 'bg-emerald-100 text-emerald-600',
  amber: 'bg-amber-100 text-amber-600',
};

export default function StatsCard({ label, value, icon: Icon = TrendingUp, accent = 'purple' }: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-purple-100 shadow-sm p-5 flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${accentMap[accent]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-purple-400 uppercase tracking-wider font-medium truncate">{label}</p>
        <p className="text-2xl font-bold text-purple-900 leading-tight">{value}</p>
      </div>
    </div>
  );
}
