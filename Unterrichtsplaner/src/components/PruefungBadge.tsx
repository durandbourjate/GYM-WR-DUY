import { type PruefungBadge as PruefungBadgeType } from '../services/pruefungBridge';

interface Props {
  badges: PruefungBadgeType[];
  fontSize: number;
}

export function PruefungBadge({ badges, fontSize }: Props) {
  if (badges.length === 0) return null;

  if (badges.length === 1) {
    const b = badges[0];
    const icon = b.hatNoten ? '✓' : '○';
    const colorClass = b.hatNoten
      ? 'text-green-500 dark:text-green-400'
      : 'text-slate-400 dark:text-slate-500';
    return (
      <div
        className={`leading-tight mt-0.5 max-w-[48px] truncate ${colorClass}`}
        style={{ fontSize }}
        title={`${b.titel} (${b.datum})${b.hatNoten ? ' — benotet' : ''} · ${b.anzahlSuS} SuS`}
      >
        {icon} {b.titel}
      </div>
    );
  }

  // Mehrere Prüfungen in derselben KW
  const alleBenotet = badges.every((b) => b.hatNoten);
  const colorClass = alleBenotet
    ? 'text-green-500 dark:text-green-400'
    : 'text-slate-400 dark:text-slate-500';
  const tooltip = badges.map((b) => `${b.titel} (${b.datum})${b.hatNoten ? ' ✓' : ''}`).join('\n');

  return (
    <div
      className={`leading-tight mt-0.5 max-w-[48px] truncate font-medium ${colorClass}`}
      style={{ fontSize }}
      title={tooltip}
    >
      {badges.length} Prüf.
    </div>
  );
}
