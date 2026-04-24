import type { FilterConfig } from './filterLogik'

interface Props {
  config: FilterConfig
  onChange: (patch: Partial<FilterConfig>) => void
  istAdmin: boolean
}

export default function ProblemmeldungenFilter({ config, onChange, istAdmin }: Props) {
  const btnCls = (active: boolean) =>
    `px-3 py-1.5 text-xs font-medium rounded-full border-2 transition-colors cursor-pointer ${
      active
        ? 'border-blue-500 bg-blue-500 text-white dark:border-blue-400 dark:bg-blue-500'
        : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-300'
    }`

  return (
    <div className="flex flex-wrap gap-4 items-center mb-4 text-xs">
      <div className="flex gap-1.5">
        <span className="text-slate-500 dark:text-slate-400 self-center">Status:</span>
        {(['offen', 'erledigt', 'alle'] as const).map(s => (
          <button key={s} className={btnCls(config.status === s)} onClick={() => onChange({ status: s })}>
            {s === 'offen' ? 'Offen' : s === 'erledigt' ? 'Erledigt' : 'Alle'}
          </button>
        ))}
      </div>
      <div className="flex gap-1.5">
        <span className="text-slate-500 dark:text-slate-400 self-center">Typ:</span>
        {(['alle', 'problem', 'wunsch'] as const).map(t => (
          <button key={t} className={btnCls(config.typ === t)} onClick={() => onChange({ typ: t })}>
            {t === 'alle' ? 'Alle' : t === 'problem' ? '🔴 Probleme' : '💡 Wünsche'}
          </button>
        ))}
      </div>
      {!istAdmin && (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={config.nurMeine}
            onChange={e => onChange({ nurMeine: e.target.checked })}
            className="w-4 h-4"
          />
          <span className="text-slate-600 dark:text-slate-400">Nur meine Fragen</span>
        </label>
      )}
    </div>
  )
}
