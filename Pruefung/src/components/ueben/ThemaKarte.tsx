import type { ThemenFortschritt } from '../../types/ueben/fortschritt'
import type { ThemenStatus } from '../../types/ueben/themenSichtbarkeit'
import { berechneSterne, sterneText } from '../../utils/ueben/gamification'
import { getFachFarbe } from '../../utils/ueben/fachFarben'

interface ThemaKarteProps {
  thema: string
  fach: string
  anzahlFragen: number
  anzahlUnterthemen: number
  fortschritt: ThemenFortschritt
  themenStatus: ThemenStatus
  fachFarben: Record<string, string>
  onClick: () => void
}

/**
 * Thema-Karte im SuS-Dashboard.
 * 3 visuelle Stufen:
 * - aktiv: Farbiger linker Rand + "Aktuell"-Badge
 * - abgeschlossen: Normal
 * - nicht_freigeschaltet: Gedämpft, kein Klick
 */
export function ThemaKarte({
  thema, fach, anzahlFragen, anzahlUnterthemen,
  fortschritt, themenStatus, fachFarben, onClick,
}: ThemaKarteProps) {
  const farbe = getFachFarbe(fach, fachFarben)
  const istAktiv = themenStatus === 'aktiv'
  const istGesperrt = themenStatus === 'nicht_freigeschaltet'

  return (
    <button
      onClick={istGesperrt ? undefined : onClick}
      disabled={istGesperrt}
      className={`text-left p-4 rounded-xl border-2 transition-colors min-h-[48px] relative
        ${istGesperrt
          ? 'opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700'
          : 'bg-white dark:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-500 cursor-pointer'
        }
        ${istAktiv
          ? 'border-l-4'
          : 'border-slate-200 dark:border-slate-700'
        }
      `}
      style={istAktiv ? { borderLeftColor: farbe, borderTopColor: undefined, borderRightColor: undefined, borderBottomColor: undefined } : undefined}
    >
      {/* Aktuell-Badge */}
      {istAktiv && (
        <span
          className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: farbe }}
        >
          Aktuell
        </span>
      )}

      {/* Schloss-Icon bei gesperrten Themen */}
      {istGesperrt && (
        <span className="absolute top-2 right-2 text-slate-400 dark:text-slate-600 text-sm">
          🔒
        </span>
      )}

      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="font-semibold dark:text-white text-sm leading-tight">{thema}</span>
        {!istAktiv && !istGesperrt && (
          <span className="shrink-0 w-3 h-3 rounded-full mt-1" style={{ backgroundColor: farbe }} />
        )}
      </div>
      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span>{anzahlFragen} Fragen</span>
        {anzahlUnterthemen > 0 && <span>{anzahlUnterthemen} Unterthemen</span>}
        {!istGesperrt && <span>{sterneText(berechneSterne(fortschritt.quote))}</span>}
      </div>
      {!istGesperrt && <FortschrittsBalkenKompakt fortschritt={fortschritt} />}
    </button>
  )
}

function FortschrittsBalkenKompakt({ fortschritt }: { fortschritt: ThemenFortschritt }) {
  if (fortschritt.gesamt === 0) return null
  const gemeistertPct = (fortschritt.gemeistert / fortschritt.gesamt) * 100
  const gefestigtPct = (fortschritt.gefestigt / fortschritt.gesamt) * 100
  const uebenPct = (fortschritt.ueben / fortschritt.gesamt) * 100

  return (
    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden flex mt-2">
      {gemeistertPct > 0 && <div className="bg-green-500 h-2" style={{ width: `${gemeistertPct}%` }} />}
      {gefestigtPct > 0 && <div className="bg-blue-400 h-2" style={{ width: `${gefestigtPct}%` }} />}
      {uebenPct > 0 && <div className="bg-yellow-400 h-2" style={{ width: `${uebenPct}%` }} />}
    </div>
  )
}
