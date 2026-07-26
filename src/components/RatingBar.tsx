interface RatingBarProps {
  label: string;
  value: number;
  description?: string;
}

export function RatingBar({ label, value, description }: RatingBarProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-medium text-slate-300">{label}</span>
        <span className="text-sm font-bold text-slate-100">{value}/10</span>
      </div>
      <div className="h-2.5 bg-slate-700/50 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${value * 10}%`,
            background: getGradient(value),
          }}
        />
      </div>
      {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
    </div>
  );
}

function getGradient(value: number): string {
  if (value >= 8) return 'linear-gradient(to right, #10b981, #059669)';
  if (value >= 6) return 'linear-gradient(to right, #3b82f6, #2563eb)';
  if (value >= 4) return 'linear-gradient(to right, #f59e0b, #d97706)';
  return 'linear-gradient(to right, #ef4444, #dc2626)';
}
