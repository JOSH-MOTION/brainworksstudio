interface AvatarClusterProps {
  names: string[];
  /** Total real count this cluster represents — shows a "+N" bubble for the remainder. */
  totalCount?: number;
  className?: string;
}

const TONES = ['bg-navy-800', 'bg-gold-600', 'bg-navy-600', 'bg-gold-800', 'bg-navy-900'];

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
}

// Overlapping initials circles — real names, no stock headshots needed.
export default function AvatarCluster({ names, totalCount, className = '' }: AvatarClusterProps) {
  const remainder = totalCount && totalCount > names.length ? totalCount - names.length : 0;

  return (
    <div className={`flex items-center -space-x-2 ${className}`} aria-hidden="true">
      {names.map((name, i) => (
        <span
          key={name}
          title={name}
          className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[11px] font-bold text-white ${TONES[i % TONES.length]}`}
        >
          {initialsOf(name)}
        </span>
      ))}
      {remainder > 0 && (
        <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gray-200 text-[10px] font-bold text-navy-900">
          +{remainder}
        </span>
      )}
    </div>
  );
}
