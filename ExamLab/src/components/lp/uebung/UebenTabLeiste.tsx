interface Gruppe {
  id: string
  name: string
}

export interface UebenTabLeisteProps {
  aktiv: 'durchfuehren' | 'uebungen' | 'analyse'
  aktiverKursId?: string
  gruppen: Gruppe[]
  onDurchfuehren: () => void
  onUebungen: () => void
  onAnalyse: () => void
  onKursWaehle: (kursId: string) => void
}

const tabBase = 'px-4 py-1.5 text-sm font-medium rounded-md transition-colors cursor-pointer'
const tabAktiv = 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-sm'
const tabInaktiv = 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
// Kurs-Tab-Stil nutzt .filter-btn (S110 Hover/Active-System)
const kursBase = 'filter-btn'
const kursAktiv = 'filter-btn-active'

export function UebenTabLeiste({
  aktiv, aktiverKursId, gruppen,
  onDurchfuehren, onUebungen, onAnalyse, onKursWaehle,
}: UebenTabLeisteProps) {
  const uebungenOffen = aktiv === 'uebungen'

  return (
    <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg w-fit">
      <button
        onClick={onDurchfuehren}
        className={`${tabBase} ${aktiv === 'durchfuehren' ? tabAktiv : tabInaktiv}`}
      >
        Übung durchführen
      </button>

      <button
        onClick={onUebungen}
        className={`${tabBase} ${uebungenOffen ? tabAktiv : tabInaktiv}`}
      >
        Übungen
      </button>

      {/* Kurs-Tabs — nur wenn "Übungen" aktiv */}
      {uebungenOffen && gruppen.map(g => {
        const istAktiv = g.id === aktiverKursId
        return (
          <button
            key={g.id}
            onClick={() => onKursWaehle(g.id)}
            className={`${kursBase} ${istAktiv ? kursAktiv : ''}`}
          >
            {g.name}
          </button>
        )
      })}

      <button
        onClick={onAnalyse}
        className={`${tabBase} ${aktiv === 'analyse' ? tabAktiv : tabInaktiv}`}
      >
        Analyse
      </button>
    </div>
  )
}
