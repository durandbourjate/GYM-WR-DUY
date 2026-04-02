import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useGruppenStore } from '../../store/gruppenStore'
import AdminUebersicht from './AdminUebersicht'
import AdminKindDetail from './AdminKindDetail'
import AdminThemaDetail from './AdminThemaDetail'
import AdminAuftraege from './AdminAuftraege'

interface AdminDashboardProps {
  onZuUeben?: () => void
}

type AdminAnsicht =
  | { typ: 'uebersicht' }
  | { typ: 'auftraege' }
  | { typ: 'kind'; email: string; name: string }
  | { typ: 'thema'; email: string; name: string; fach: string; thema: string }

export default function AdminDashboard({ onZuUeben }: AdminDashboardProps) {
  const { user, abmelden } = useAuthStore()
  const { aktiveGruppe } = useGruppenStore()
  const [ansicht, setAnsicht] = useState<AdminAnsicht>({ typ: 'uebersicht' })

  const zurueck = () => {
    if (ansicht.typ === 'thema') {
      setAnsicht({ typ: 'kind', email: ansicht.email, name: ansicht.name })
    } else {
      setAnsicht({ typ: 'uebersicht' })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {ansicht.typ !== 'uebersicht' && (
            <button onClick={zurueck} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 min-w-[44px] min-h-[44px] flex items-center justify-center">
              ←
            </button>
          )}
          <div>
            <h1 className="text-lg font-bold dark:text-white">
              {ansicht.typ === 'uebersicht' && 'Admin-Dashboard'}
              {ansicht.typ === 'kind' && ansicht.name}
              {ansicht.typ === 'thema' && `${ansicht.name} — ${ansicht.thema}`}
            </h1>
            {aktiveGruppe && <span className="text-sm text-gray-500">{aktiveGruppe.name}</span>}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {onZuUeben && (
            <button
              onClick={onZuUeben}
              className="text-sm text-blue-500 hover:text-blue-700"
            >
              Ueben
            </button>
          )}
          <span className="text-sm text-gray-600 dark:text-gray-400">{user?.vorname}</span>
          <button onClick={abmelden} className="text-sm text-gray-400 hover:text-gray-600">Abmelden</button>
        </div>
      </header>

      {/* Tab-Leiste */}
      {(ansicht.typ === 'uebersicht' || ansicht.typ === 'auftraege') && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto px-6 flex gap-4">
            <button
              onClick={() => setAnsicht({ typ: 'uebersicht' })}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${ansicht.typ === 'uebersicht' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Uebersicht
            </button>
            <button
              onClick={() => setAnsicht({ typ: 'auftraege' })}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${ansicht.typ === 'auftraege' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              Auftraege
            </button>
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto p-6">
        {ansicht.typ === 'uebersicht' && (
          <AdminUebersicht
            onKindKlick={(email, name) => setAnsicht({ typ: 'kind', email, name })}
          />
        )}
        {ansicht.typ === 'kind' && (
          <AdminKindDetail
            email={ansicht.email}
            name={ansicht.name}
            onThemaKlick={(fach, thema) => setAnsicht({ typ: 'thema', email: ansicht.email, name: ansicht.name, fach, thema })}
          />
        )}
        {ansicht.typ === 'auftraege' && <AdminAuftraege />}
        {ansicht.typ === 'thema' && (
          <AdminThemaDetail
            email={ansicht.email}
            name={ansicht.name}
            fach={ansicht.fach}
            thema={ansicht.thema}
          />
        )}
      </main>
    </div>
  )
}
