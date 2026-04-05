import { useEffect, useCallback } from 'react'
import { useAuthStore } from '../../store/authStore'
import { useLernenAuthStore } from '../../store/lernen/authStore'
import { useLernenGruppenStore } from '../../store/lernen/gruppenStore'
import { LernKontextProvider } from '../../context/lernen/LernKontextProvider'
import AdminDashboard from '../lernen/admin/AdminDashboard'

interface Props {
  /** Callback wenn "Neue Frage" in der Fragenbank geöffnet werden soll */
  onNeueFrage?: () => void
}

/**
 * Wrapper der die Lernen-Stores mit dem Prüfungstool-User initialisiert
 * und das AdminDashboard rendert.
 */
export default function UebungsToolView({ onNeueFrage: _onNeueFrage }: Props) {
  const pruefungUser = useAuthStore(s => s.user)
  const { gruppen, aktiveGruppe, ladeGruppen, waehleGruppe, ladeStatus } = useLernenGruppenStore()

  // Lernen-Auth mit Prüfungstool-User initialisieren
  useEffect(() => {
    if (!pruefungUser) return
    useLernenAuthStore.setState({
      user: {
        email: pruefungUser.email,
        name: pruefungUser.name || pruefungUser.email,
        vorname: pruefungUser.name?.split(' ')[0] || '',
        nachname: pruefungUser.name?.split(' ').slice(1).join(' ') || '',
        rolle: 'admin',
        sessionToken: pruefungUser.sessionToken,
        loginMethode: 'google',
      },
      istAngemeldet: true,
      ladeStatus: 'fertig',
    })
  }, [pruefungUser])

  // Gruppen laden
  useEffect(() => {
    if (pruefungUser?.email && ladeStatus === 'idle') {
      ladeGruppen(pruefungUser.email)
    }
  }, [pruefungUser?.email, ladeStatus, ladeGruppen])

  // Auto-Select bei genau 1 Gruppe
  useEffect(() => {
    if (ladeStatus === 'fertig' && gruppen.length === 1 && !aktiveGruppe) {
      waehleGruppe(gruppen[0].id)
    }
  }, [ladeStatus, gruppen, aktiveGruppe, waehleGruppe])

  const handleGruppeWaehlen = useCallback((gruppeId: string) => {
    waehleGruppe(gruppeId)
  }, [waehleGruppe])

  // Laden
  if (ladeStatus === 'laden' || ladeStatus === 'idle') {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-slate-500 dark:text-slate-400">Gruppen werden geladen...</p>
      </div>
    )
  }

  // Keine Gruppen
  if (gruppen.length === 0) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center max-w-sm">
          <p className="text-4xl mb-3">📚</p>
          <h2 className="text-xl font-bold mb-2 dark:text-white">Keine Gruppen</h2>
          <p className="text-slate-500 dark:text-slate-400">
            Keine Übungsgruppen gefunden. Erstelle eine Gruppe im Übungstool.
          </p>
        </div>
      </div>
    )
  }

  // Gruppenauswahl (bei mehreren Gruppen)
  if (!aktiveGruppe) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h2 className="text-lg font-bold mb-4 dark:text-white">Gruppe wählen</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {gruppen.map(g => (
            <button
              key={g.id}
              onClick={() => handleGruppeWaehlen(g.id)}
              className="text-left p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="font-medium dark:text-white">{g.name}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {g.typ === 'familie' ? '👨‍👩‍👧‍👦 Familie' : '🏫 Schule'} · {g.mitglieder.length} Mitglieder
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // AdminDashboard mit Gruppen-Kontext
  return (
    <LernKontextProvider>
      <div className="relative">
        {/* Gruppen-Wechsler wenn mehrere Gruppen */}
        {gruppen.length > 1 && (
          <div className="max-w-5xl mx-auto px-6 pt-3 flex items-center gap-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">Gruppe:</span>
            <select
              value={aktiveGruppe.id}
              onChange={e => handleGruppeWaehlen(e.target.value)}
              className="text-sm px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md dark:text-slate-200"
            >
              {gruppen.map(g => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          </div>
        )}
        <AdminDashboard />
      </div>
    </LernKontextProvider>
  )
}
