import type { ReactNode } from 'react'

type Props = {
  variant: 'korrekt' | 'falsch'
  label?: string
  children: ReactNode
}

const DEFAULT_LABEL = {
  korrekt: 'Richtig beantwortet',
  falsch: 'Nicht ganz — Zusammenhang',
}

export function MusterloesungsBlock({ variant, label, children }: Props) {
  const borderClass = variant === 'korrekt'
    ? 'border-green-600 bg-green-50 dark:bg-green-950/20'
    : 'border-red-600 bg-red-50 dark:bg-red-950/20'
  const labelColor = variant === 'korrekt'
    ? 'text-green-700 dark:text-green-400'
    : 'text-red-700 dark:text-red-400'
  return (
    <div className={`mt-4 p-4 rounded-lg border ${borderClass}`}>
      <div className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${labelColor}`}>
        {label ?? DEFAULT_LABEL[variant]}
      </div>
      <div className="text-sm">{children}</div>
    </div>
  )
}
