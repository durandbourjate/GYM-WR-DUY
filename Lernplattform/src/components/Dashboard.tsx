import { useEffect, useState } from 'react'
import { useAuthStore } from '../store/authStore'
import { useGruppenStore } from '../store/gruppenStore'
import { useUebungsStore } from '../store/uebungsStore'
import { useFortschrittStore } from '../store/fortschrittStore'
import { fragenAdapter } from '../adapters/appsScriptAdapter'
import type { Frage } from '../types/fragen'
import type { ThemenFortschritt } from '../types/fortschritt'

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
  const { ladeFortschritt, getThemenFortschritt } = useFortschrittStore()
  const [themenInfo, setThemenInfo] = useState<Record<string, ThemenInfo[]>>({})
  const [laden, setLaden] = useState(true)

  useEffect(() => {
    ladeFortschritt()
  }, [ladeFortschritt])

  useEffect(() => {
    if (!aktiveGruppe) return
    const ladeThemen = async () => {
      setLaden(true)
      const alleFragen = await fragenAdapter.ladeFragen(aktiveGruppe.id, { nurUebung: true })

      // Gruppiere nach Fach → Thema
      const fachMap: Record<string, Record<string, Frage[]>> = {}
      for (const f of alleFragen) {
        if (!fachMap[f.fach]) fachMap[f.fach] = {}
        if (!fachMap[f.fach][f.thema]) fachMap[f.fach][f.thema] = []
        fachMap[f.fach][f.thema].push(f)
      }

      const info: Record<string, ThemenInfo[]> = {}
      for (const [fach, themen] of Object.entries(fachMap)) {
        info[fach] = Object.entries(themen).map(([thema, fragen]) => ({
          fach,
          thema,
          fragen,
          fortschritt: getThemenFortschritt(fragen),
        }))
      }

      setThemenInfo(info)
      setLaden(false)
    }
    ladeThemen()
  }, [aktiveGruppe, getThemenFortschritt])

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

        {laden ? (
          <p className="text-gray-500">Themen werden geladen...</p>
        ) : Object.keys(themenInfo).length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm text-gray-500">
            <p>Noch keine Uebungsfragen vorhanden.</p>
          </div>
        ) : (
          <div className="space-y-6">
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
                        <span className="font-medium dark:text-white">{thema}</span>
                        <MasteryBadges fortschritt={fortschritt} />
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
      {gemeistertPct > 0 && (
        <div className="bg-green-500 h-2" style={{ width: `${gemeistertPct}%` }} />
      )}
      {gefestigtPct > 0 && (
        <div className="bg-blue-400 h-2" style={{ width: `${gefestigtPct}%` }} />
      )}
      {uebenPct > 0 && (
        <div className="bg-yellow-400 h-2" style={{ width: `${uebenPct}%` }} />
      )}
    </div>
  )
}

function MasteryBadges({ fortschritt }: { fortschritt: ThemenFortschritt }) {
  if (fortschritt.gesamt === 0) return null

  return (
    <div className="flex items-center gap-1 text-xs">
      {fortschritt.gemeistert > 0 && (
        <span className="px-1.5 py-0.5 rounded bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
          {fortschritt.gemeistert}
        </span>
      )}
      {fortschritt.gefestigt > 0 && (
        <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
          {fortschritt.gefestigt}
        </span>
      )}
      {fortschritt.ueben > 0 && (
        <span className="px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
          {fortschritt.ueben}
        </span>
      )}
      {fortschritt.neu > 0 && (
        <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
          {fortschritt.neu}
        </span>
      )}
    </div>
  )
}
