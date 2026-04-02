import { MOCK_MITGLIEDER_FORTSCHRITTE, MOCK_SESSIONS } from '../../adapters/mockMitgliederDaten'
import { MOCK_FRAGEN } from '../../adapters/mockDaten'

interface Props {
  email: string
  name: string
  onThemaKlick: (fach: string, thema: string) => void
}

export default function AdminKindDetail({ email, onThemaKlick }: Props) {
  const fortschritte = MOCK_MITGLIEDER_FORTSCHRITTE[email] || []
  const sessions = MOCK_SESSIONS[email] || []

  // Gruppiere nach Fach → Thema
  const fachThemen: Record<string, Record<string, { gesamt: number; gemeistert: number; gefestigt: number; ueben: number; neu: number }>> = {}

  const alleFaecher = [...new Set(MOCK_FRAGEN.map(f => f.fach))]
  for (const fach of alleFaecher) {
    const fachFragen = MOCK_FRAGEN.filter(f => f.fach === fach)
    const themen = [...new Set(fachFragen.map(f => f.thema))]

    fachThemen[fach] = {}
    for (const thema of themen) {
      const themaFragen = fachFragen.filter(f => f.thema === thema)
      const themaFortschritte = fortschritte.filter(fp =>
        themaFragen.some(f => f.id === fp.fragenId)
      )

      let gemeistert = 0, gefestigt = 0, ueben = 0, neu = 0
      for (const f of themaFragen) {
        const fp = themaFortschritte.find(p => p.fragenId === f.id)
        const mastery = fp?.mastery || 'neu'
        if (mastery === 'gemeistert') gemeistert++
        else if (mastery === 'gefestigt') gefestigt++
        else if (mastery === 'ueben') ueben++
        else neu++
      }

      fachThemen[fach][thema] = { gesamt: themaFragen.length, gemeistert, gefestigt, ueben, neu }
    }
  }

  // Dauerbaustellen erkennen (>= 10 Versuche, < 50% richtig)
  const dauerbaustellen = fortschritte.filter(fp =>
    fp.versuche >= 10 && (fp.richtig / fp.versuche) < 0.5
  )

  return (
    <div className="space-y-6">
      {/* Session-Statistik */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5">
        <h3 className="font-semibold mb-3 dark:text-white">Letzte 7 Tage</h3>
        <div className="flex gap-6 text-sm">
          <div>
            <span className="text-2xl font-bold dark:text-white">{sessions.length}</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">Sessions</span>
          </div>
          <div>
            <span className="text-2xl font-bold dark:text-white">
              {sessions.reduce((s, ses) => s + ses.anzahl, 0)}
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">Fragen</span>
          </div>
          <div>
            <span className="text-2xl font-bold dark:text-white">
              {sessions.length > 0
                ? Math.round((sessions.reduce((s, ses) => s + ses.richtig, 0) / sessions.reduce((s, ses) => s + ses.anzahl, 0)) * 100)
                : 0}%
            </span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">richtig</span>
          </div>
        </div>
      </div>

      {/* Dauerbaustellen */}
      {dauerbaustellen.length > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-5">
          <h3 className="font-semibold mb-2 text-yellow-800 dark:text-yellow-200">Dauerbaustellen</h3>
          <div className="space-y-1">
            {dauerbaustellen.map(fp => {
              const frage = MOCK_FRAGEN.find(f => f.id === fp.fragenId)
              return (
                <div key={fp.fragenId} className="text-sm text-yellow-700 dark:text-yellow-300">
                  {frage?.thema}: {fp.richtig}/{fp.versuche} richtig ({Math.round((fp.richtig / fp.versuche) * 100)}%)
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Themen nach Fach */}
      {Object.entries(fachThemen).map(([fach, themen]) => (
        <div key={fach}>
          <h3 className="text-lg font-semibold mb-3 dark:text-white">{fach}</h3>
          <div className="space-y-2">
            {Object.entries(themen).map(([thema, stats]) => {
              const quote = stats.gesamt > 0 ? ((stats.gemeistert + stats.gefestigt) / stats.gesamt) * 100 : 0

              return (
                <button
                  key={thema}
                  onClick={() => onThemaKlick(fach, thema)}
                  className="w-full text-left bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium dark:text-white">{thema}</span>
                    <span className="text-sm text-gray-500">{Math.round(quote)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden flex">
                    {stats.gemeistert > 0 && <div className="bg-green-500 h-2" style={{ width: `${(stats.gemeistert / stats.gesamt) * 100}%` }} />}
                    {stats.gefestigt > 0 && <div className="bg-blue-400 h-2" style={{ width: `${(stats.gefestigt / stats.gesamt) * 100}%` }} />}
                    {stats.ueben > 0 && <div className="bg-yellow-400 h-2" style={{ width: `${(stats.ueben / stats.gesamt) * 100}%` }} />}
                  </div>
                  <div className="flex gap-3 mt-2 text-xs text-gray-400">
                    {stats.gemeistert > 0 && <span className="text-green-600">{stats.gemeistert} gemeistert</span>}
                    {stats.gefestigt > 0 && <span className="text-blue-500">{stats.gefestigt} gefestigt</span>}
                    {stats.ueben > 0 && <span className="text-yellow-600">{stats.ueben} ueben</span>}
                    {stats.neu > 0 && <span>{stats.neu} neu</span>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Session-Historie */}
      <div>
        <h3 className="text-lg font-semibold mb-3 dark:text-white">Sessions</h3>
        <div className="space-y-2">
          {sessions.map((ses, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex items-center justify-between border border-gray-100 dark:border-gray-700">
              <div>
                <span className="font-medium dark:text-white">{ses.fach} — {ses.thema}</span>
                <span className="text-sm text-gray-400 ml-2">{ses.datum}</span>
              </div>
              <span className={`font-medium ${ses.richtig / ses.anzahl >= 0.7 ? 'text-green-600' : ses.richtig / ses.anzahl >= 0.5 ? 'text-yellow-600' : 'text-red-500'}`}>
                {ses.richtig}/{ses.anzahl}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
