import { MOCK_MITGLIEDER, MOCK_MITGLIEDER_FORTSCHRITTE, MOCK_SESSIONS } from '../../adapters/mockMitgliederDaten'
import { MOCK_FRAGEN } from '../../adapters/mockDaten'
import type { MasteryStufe } from '../../types/fortschritt'

interface Props {
  onKindKlick: (email: string, name: string) => void
}

export default function AdminUebersicht({ onKindKlick }: Props) {
  // Faecher aus Mock-Daten extrahieren
  const faecher = [...new Set(MOCK_FRAGEN.map(f => f.fach))]

  return (
    <div className="space-y-4">
      {MOCK_MITGLIEDER.map((mitglied) => {
        const fortschritte = MOCK_MITGLIEDER_FORTSCHRITTE[mitglied.email] || []
        const sessions = MOCK_SESSIONS[mitglied.email] || []
        const letzteSession = sessions[0]

        return (
          <button
            key={mitglied.email}
            onClick={() => onKindKlick(mitglied.email, mitglied.name)}
            className="w-full text-left bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold dark:text-white">{mitglied.name}</h3>
              {letzteSession && (
                <span className="text-xs text-gray-400">
                  Letzte Session: {letzteSession.datum}
                </span>
              )}
            </div>

            <div className="space-y-2">
              {faecher.map(fach => {
                const fachFragen = MOCK_FRAGEN.filter(f => f.fach === fach)
                const fachFortschritte = fortschritte.filter(fp =>
                  fachFragen.some(f => f.id === fp.fragenId)
                )

                if (fachFragen.length === 0) return null

                const counts = zaehleMastery(fachFortschritte.map(f => f.mastery), fachFragen.length)

                return (
                  <div key={fach} className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400 w-20 flex-shrink-0">{fach}</span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden flex">
                      {counts.gemeistert > 0 && <div className="bg-green-500 h-2.5" style={{ width: `${counts.gemeistertPct}%` }} />}
                      {counts.gefestigt > 0 && <div className="bg-blue-400 h-2.5" style={{ width: `${counts.gefestigtPct}%` }} />}
                      {counts.ueben > 0 && <div className="bg-yellow-400 h-2.5" style={{ width: `${counts.uebenPct}%` }} />}
                    </div>
                    <span className="text-xs text-gray-400 w-10 text-right">{Math.round(counts.quote)}%</span>
                  </div>
                )
              })}
            </div>

            <div className="mt-3 flex gap-4 text-xs text-gray-400">
              <span>{sessions.length} Sessions</span>
              <span>{fortschritte.filter(f => f.mastery === 'gemeistert').length} gemeistert</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

function zaehleMastery(masteryListe: MasteryStufe[], gesamt: number) {
  let gemeistert = 0, gefestigt = 0, ueben = 0
  for (const m of masteryListe) {
    if (m === 'gemeistert') gemeistert++
    else if (m === 'gefestigt') gefestigt++
    else if (m === 'ueben') ueben++
  }
  const quote = gesamt > 0 ? ((gemeistert + gefestigt) / gesamt) * 100 : 0
  return {
    gemeistert, gefestigt, ueben,
    gemeistertPct: (gemeistert / gesamt) * 100,
    gefestigtPct: (gefestigt / gesamt) * 100,
    uebenPct: (ueben / gesamt) * 100,
    quote,
  }
}
