import { useEffect, useMemo, useState } from 'react'
import { useThemenSichtbarkeitStore } from '../../../store/ueben/themenSichtbarkeitStore'
import { useUebenGruppenStore } from '../../../store/ueben/gruppenStore'
import { useUebenAuthStore } from '../../../store/ueben/authStore'
import { uebenFragenAdapter } from '../../../adapters/ueben/appsScriptAdapter'
import { getFachFarbe } from '../../../utils/ueben/fachFarben'
import { useUebenKontext } from '../../../hooks/ueben/useUebenKontext'
import { MAX_AKTIVE_THEMEN } from '../../../types/ueben/themenSichtbarkeit'
import type { ThemenStatus } from '../../../types/ueben/themenSichtbarkeit'
import type { Frage } from '../../../types/ueben/fragen'

interface ThemaEintrag {
  fach: string
  thema: string
  anzahlFragen: number
  status: ThemenStatus
}

export default function AdminThemensteuerung() {
  const { aktiveGruppe } = useUebenGruppenStore()
  const { user } = useUebenAuthStore()
  const { freischaltungen, ladeFreischaltungen, setzeStatus, getStatus, getAktiveThemen } = useThemenSichtbarkeitStore()
  const { fachFarben } = useUebenKontext()
  const [alleFragen, setAlleFragen] = useState<Frage[]>([])
  const [laden, setLaden] = useState(true)
  const [filterFach, setFilterFach] = useState<string | null>(null)

  useEffect(() => {
    if (!aktiveGruppe) return
    ladeFreischaltungen(aktiveGruppe.id)
    const ladeFragen = async () => {
      setLaden(true)
      const fragen = await uebenFragenAdapter.ladeFragen(aktiveGruppe.id)
      setAlleFragen(fragen)
      setLaden(false)
    }
    ladeFragen()
  }, [aktiveGruppe, ladeFreischaltungen])

  // Themen aus Fragen extrahieren
  const themen = useMemo(() => {
    const map: Record<string, ThemaEintrag> = {}
    for (const f of alleFragen) {
      const tags = (f.tags || []) as (string | { name: string })[]
      if (tags.some(t => (typeof t === 'string' ? t : t.name) === 'einrichtung')) continue
      if (f.thema === 'Einrichtung' || f.thema === 'Einrichtungstest') continue

      const fach = f.fach || 'Andere'
      const thema = f.thema || 'Allgemein'
      const key = `${fach}::${thema}`
      if (!map[key]) {
        map[key] = { fach, thema, anzahlFragen: 0, status: getStatus(fach, thema) }
      }
      map[key].anzahlFragen++
    }
    return Object.values(map).sort((a, b) => {
      // Aktive zuerst, dann abgeschlossene, dann nicht freigeschaltete
      const rang: Record<ThemenStatus, number> = { aktiv: 0, abgeschlossen: 1, nicht_freigeschaltet: 2 }
      const diff = rang[a.status] - rang[b.status]
      if (diff !== 0) return diff
      return a.fach.localeCompare(b.fach) || a.thema.localeCompare(b.thema)
    })
  }, [alleFragen, getStatus, freischaltungen])

  const faecher = useMemo(() => [...new Set(themen.map(t => t.fach))].sort(), [themen])

  const gefilterteThemen = filterFach ? themen.filter(t => t.fach === filterFach) : themen

  const aktiveAnzahl = getAktiveThemen().length

  const handleStatusAendern = async (fach: string, thema: string, neuerStatus: ThemenStatus) => {
    if (!aktiveGruppe || !user) return
    await setzeStatus(aktiveGruppe.id, fach, thema, neuerStatus, user.email, 'manuell')
  }

  if (laden) {
    return <p className="text-slate-500">Themen werden geladen...</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold dark:text-white">Themensteuerung</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Aktivierte Themen werden im SuS-Dashboard hervorgehoben. Max. {MAX_AKTIVE_THEMEN} gleichzeitig aktiv.
          </p>
        </div>
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${
          aktiveAnzahl >= MAX_AKTIVE_THEMEN
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
            : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
        }`}>
          {aktiveAnzahl}/{MAX_AKTIVE_THEMEN} aktiv
        </span>
      </div>

      {/* Fach-Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterFach(null)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
            !filterFach
              ? 'bg-slate-800 text-white border-slate-800 dark:bg-slate-200 dark:text-slate-800'
              : 'text-slate-500 border-slate-300 dark:border-slate-600 hover:border-slate-400'
          }`}
        >
          Alle
        </button>
        {faecher.map(fach => {
          const farbe = getFachFarbe(fach, fachFarben)
          return (
            <button
              key={fach}
              onClick={() => setFilterFach(filterFach === fach ? null : fach)}
              className="px-3 py-1.5 rounded-full text-xs font-medium border transition-colors"
              style={filterFach === fach
                ? { backgroundColor: farbe, color: '#fff', borderColor: farbe }
                : { borderColor: '#d1d5db', color: farbe }
              }
            >
              {fach}
            </button>
          )
        })}
      </div>

      {/* Themen-Liste */}
      <div className="space-y-2">
        {gefilterteThemen.map(eintrag => {
          const farbe = getFachFarbe(eintrag.fach, fachFarben)
          return (
            <div
              key={`${eintrag.fach}::${eintrag.thema}`}
              className={`flex items-center justify-between p-4 rounded-xl border transition-colors ${
                eintrag.status === 'aktiv'
                  ? 'bg-white dark:bg-slate-800 border-l-4'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
              }`}
              style={eintrag.status === 'aktiv' ? { borderLeftColor: farbe } : undefined}
            >
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: farbe }} />
                <div>
                  <span className="font-medium text-sm dark:text-white">{eintrag.thema}</span>
                  <div className="text-xs text-slate-400">{eintrag.fach} · {eintrag.anzahlFragen} Fragen</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Status-Badge */}
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  eintrag.status === 'aktiv' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                  eintrag.status === 'abgeschlossen' ? 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400' :
                  'bg-slate-50 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
                }`}>
                  {eintrag.status === 'aktiv' ? 'Aktiv' :
                   eintrag.status === 'abgeschlossen' ? 'Abgeschlossen' : 'Nicht freigeschaltet'}
                </span>

                {/* Aktions-Buttons */}
                {eintrag.status !== 'aktiv' && (
                  <button
                    onClick={() => handleStatusAendern(eintrag.fach, eintrag.thema, 'aktiv')}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium text-white min-h-[36px] transition-colors hover:opacity-90"
                    style={{ backgroundColor: farbe }}
                  >
                    Aktivieren
                  </button>
                )}
                {eintrag.status === 'aktiv' && (
                  <button
                    onClick={() => handleStatusAendern(eintrag.fach, eintrag.thema, 'abgeschlossen')}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-600 min-h-[36px] hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Abschliessen
                  </button>
                )}
              </div>
            </div>
          )
        })}

        {gefilterteThemen.length === 0 && (
          <p className="text-sm text-slate-400 text-center py-8">Keine Themen gefunden.</p>
        )}
      </div>
    </div>
  )
}
