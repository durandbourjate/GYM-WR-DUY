import { useEffect, useState, useMemo } from 'react'
import { useAuthStore } from '../store/authStore'
import { useGruppenStore } from '../store/gruppenStore'
import { useUebungsStore } from '../store/uebungsStore'
import { useFortschrittStore } from '../store/fortschrittStore'
import { useAuftragStore } from '../store/auftragStore'
import { fragenAdapter } from '../adapters/appsScriptAdapter'
import { berechneEmpfehlungen } from '../utils/empfehlungen'
import type { Frage } from '../types/fragen'
import type { ThemenFortschritt } from '../types/fortschritt'
import type { Empfehlung } from '../types/auftrag'
import { berechneSterne, sterneText } from '../utils/gamification'

interface ThemenInfo {
  fach: string
  thema: string
  fragen: Frage[]
  fortschritt: ThemenFortschritt
}

export default function Dashboard() {
  const { user, abmelden } = useAuthStore()
  const { aktiveGruppe } = useGruppenStore()
  const { starteSession } = useUebungsStore()
  const { ladeFortschritt, getThemenFortschritt, fortschritte } = useFortschrittStore()
  const { ladeAuftraege, auftraege } = useAuftragStore()
  const [themenInfo, setThemenInfo] = useState<Record<string, ThemenInfo[]>>({})
  const [alleFragen, setAlleFragen] = useState<Frage[]>([])
  const [laden, setLaden] = useState(true)

  useEffect(() => {
    ladeFortschritt()
    ladeAuftraege()
  }, [ladeFortschritt, ladeAuftraege])

  useEffect(() => {
    if (!aktiveGruppe) return
    const ladeThemen = async () => {
      setLaden(true)
      const fragen = await fragenAdapter.ladeFragen(aktiveGruppe.id, { nurUebung: true })
      setAlleFragen(fragen)

      const fachMap: Record<string, Record<string, Frage[]>> = {}
      for (const f of fragen) {
        if (!fachMap[f.fach]) fachMap[f.fach] = {}
        if (!fachMap[f.fach][f.thema]) fachMap[f.fach][f.thema] = []
        fachMap[f.fach][f.thema].push(f)
      }

      const info: Record<string, ThemenInfo[]> = {}
      for (const [fach, themen] of Object.entries(fachMap)) {
        info[fach] = Object.entries(themen).map(([thema, fragen]) => ({
          fach, thema, fragen, fortschritt: getThemenFortschritt(fragen),
        }))
      }

      setThemenInfo(info)
      setLaden(false)
    }
    ladeThemen()
  }, [aktiveGruppe, getThemenFortschritt])

  const empfehlungen: Empfehlung[] = useMemo(() => {
    if (!user || alleFragen.length === 0) return []
    return berechneEmpfehlungen(alleFragen, fortschritte, auftraege, user.email)
  }, [alleFragen, fortschritte, auftraege, user])

  const handleStarte = (fach: string, thema: string) => {
    if (!aktiveGruppe || !user) return
    starteSession(aktiveGruppe.id, user.email, fach, thema)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold dark:text-white">Lernplattform</h1>
          {aktiveGruppe && <span className="text-sm text-gray-500">{aktiveGruppe.name}</span>}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">{user?.vorname || user?.email}</span>
          {user?.bild && <img src={user.bild} alt="" className="w-8 h-8 rounded-full" />}
          <button onClick={abmelden} className="text-sm text-gray-400 hover:text-gray-600">Abmelden</button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          Hallo {user?.vorname || 'dort'}!
        </h2>

        {/* Empfehlungen */}
        {empfehlungen.length > 0 && (
          <div className="mb-6 space-y-2">
            {empfehlungen.map((e, i) => (
              <button
                key={i}
                onClick={() => handleStarte(e.fach, e.thema)}
                className={`w-full text-left p-4 rounded-xl shadow-sm border min-h-[48px] transition-shadow hover:shadow-md
                  ${e.typ === 'auftrag' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : ''}
                  ${e.typ === 'luecke' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' : ''}
                  ${e.typ === 'festigung' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : ''}
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    {e.typ === 'auftrag' ? 'Auftrag' : e.typ === 'luecke' ? 'Empfohlen' : 'Festigung'}
                  </span>
                </div>
                <div className="font-medium dark:text-white">{e.titel}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{e.beschreibung}</div>
              </button>
            ))}
          </div>
        )}

        {/* Themen-Browser */}
        {laden ? (
          <p className="text-gray-500">Themen werden geladen...</p>
        ) : Object.keys(themenInfo).length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm text-gray-500">
            <p>Noch keine Uebungsfragen vorhanden.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">Alle Themen</h3>
            {Object.entries(themenInfo).map(([fach, themen]) => (
              <div key={fach}>
                <h3 className="text-lg font-semibold mb-3 dark:text-white">{fach}</h3>
                <div className="grid gap-2">
                  {themen.map(({ thema, fortschritt }) => (
                    <button
                      key={thema}
                      onClick={() => handleStarte(fach, thema)}
                      className="w-full text-left p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700 min-h-[48px]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium dark:text-white text-base">{thema}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm tracking-wide">{sterneText(berechneSterne(fortschritt.quote))}</span>
                          <MasteryBadges fortschritt={fortschritt} />
                        </div>
                      </div>
                      <FortschrittsBalken fortschritt={fortschritt} />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function FortschrittsBalken({ fortschritt }: { fortschritt: ThemenFortschritt }) {
  if (fortschritt.gesamt === 0) return null
  const gemeistertPct = (fortschritt.gemeistert / fortschritt.gesamt) * 100
  const gefestigtPct = (fortschritt.gefestigt / fortschritt.gesamt) * 100
  const uebenPct = (fortschritt.ueben / fortschritt.gesamt) * 100

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden flex">
      {gemeistertPct > 0 && <div className="bg-green-500 h-2" style={{ width: `${gemeistertPct}%` }} />}
      {gefestigtPct > 0 && <div className="bg-blue-400 h-2" style={{ width: `${gefestigtPct}%` }} />}
      {uebenPct > 0 && <div className="bg-yellow-400 h-2" style={{ width: `${uebenPct}%` }} />}
    </div>
  )
}

function MasteryBadges({ fortschritt }: { fortschritt: ThemenFortschritt }) {
  if (fortschritt.gesamt === 0) return null
  return (
    <div className="flex items-center gap-1 text-xs">
      {fortschritt.gemeistert > 0 && <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">{fortschritt.gemeistert}</span>}
      {fortschritt.gefestigt > 0 && <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">{fortschritt.gefestigt}</span>}
      {fortschritt.ueben > 0 && <span className="px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">{fortschritt.ueben}</span>}
      {fortschritt.neu > 0 && <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">{fortschritt.neu}</span>}
    </div>
  )
}
