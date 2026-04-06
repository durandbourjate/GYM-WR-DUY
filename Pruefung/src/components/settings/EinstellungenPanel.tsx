import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { migratePoolThemen, type MigrationErgebnis } from '../../utils/migratePoolThemen'

interface Props {
  onSchliessen: () => void
}

type EinstellungenTab = 'kurse' | 'lp' | 'uebungen'

/**
 * Einstellungen-Panel: Slide-over Panel je nach Rolle.
 * - Admin: LP hinzufügen/verwalten
 * - LP: Kurse konfigurieren
 * - Übungen: Übungs-Einstellungen
 */
export default function EinstellungenPanel({ onSchliessen }: Props) {
  const user = useAuthStore(s => s.user)
  const istAdmin = user?.email === 'yannick.durand@gymhofwil.ch' // TODO: aus Config
  const [tab, setTab] = useState<EinstellungenTab>(istAdmin ? 'lp' : 'kurse')
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'laeuft' | 'fertig'>('idle')
  const [migrationErgebnis, setMigrationErgebnis] = useState<MigrationErgebnis | null>(null)

  const tabs: { key: EinstellungenTab; label: string; sichtbar: boolean }[] = [
    { key: 'lp', label: 'Lehrpersonen', sichtbar: istAdmin },
    { key: 'kurse', label: 'Kurse', sichtbar: true },
    { key: 'uebungen', label: 'Übungen', sichtbar: true },
  ]

  const sichtbareTabs = tabs.filter(t => t.sichtbar)

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onSchliessen} />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-800 shadow-xl overflow-y-auto">
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-bold dark:text-white">Einstellungen</h2>
          <button onClick={onSchliessen} className="w-8 h-8 text-lg text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer">
            &times;
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-3 flex gap-4 border-b border-slate-200 dark:border-slate-700">
          {sichtbareTabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`pb-2 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                tab === t.key
                  ? 'border-slate-800 text-slate-800 dark:border-slate-200 dark:text-slate-200'
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'lp' && istAdmin && (
            <div>
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-4">Lehrpersonen verwalten</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Hier können weitere Lehrpersonen hinzugefügt werden, die ExamLab nutzen dürfen.
              </p>
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-sm text-slate-500 dark:text-slate-400">
                Wird in einer nächsten Version implementiert.
              </div>
            </div>
          )}

          {tab === 'kurse' && (
            <div>
              <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-4">Kurse konfigurieren</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Kurse definieren die Zuordnung von Klassen zu Fächern und Gefässen.
              </p>
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-sm text-slate-500 dark:text-slate-400">
                Wird in einer nächsten Version implementiert.
              </div>
            </div>
          )}

          {tab === 'uebungen' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-4">Übungs-Einstellungen</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Einstellungen für den Übungsmodus (Mastery-Schwellwerte, Standard-Filter etc.).
                </p>
                <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-sm text-slate-500 dark:text-slate-400">
                  Wird in einer nächsten Version implementiert.
                </div>
              </div>

              {/* Migration: Pool-Fragen Themen korrigieren */}
              <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                <h3 className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-2">Daten-Migration</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  Pool-Fragen mit korrektem Thema/Unterthema versehen (einmalig).
                  Setzt den Pool-Titel als Thema und das bisherige Thema als Unterthema.
                </p>
                <button
                  onClick={async () => {
                    if (!user?.email || migrationStatus === 'laeuft') return
                    setMigrationStatus('laeuft')
                    setMigrationErgebnis(null)
                    try {
                      const ergebnis = await migratePoolThemen(user.email)
                      setMigrationErgebnis(ergebnis)
                    } catch (error) {
                      setMigrationErgebnis({ total: 0, aktualisiert: 0, uebersprungen: 0, fehler: 1, details: [`Unerwarteter Fehler: ${error}`] })
                    }
                    setMigrationStatus('fertig')
                  }}
                  disabled={migrationStatus === 'laeuft'}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    migrationStatus === 'laeuft'
                      ? 'bg-slate-300 dark:bg-slate-600 text-slate-500 cursor-wait'
                      : 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 hover:bg-slate-900 dark:hover:bg-slate-100'
                  }`}
                >
                  {migrationStatus === 'laeuft' ? 'Migration läuft...' : 'Pool-Themen migrieren'}
                </button>

                {migrationErgebnis && (
                  <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-sm space-y-2">
                    <div className="flex gap-4">
                      <span className="text-green-600 dark:text-green-400">✓ {migrationErgebnis.aktualisiert} aktualisiert</span>
                      {migrationErgebnis.fehler > 0 && <span className="text-red-600 dark:text-red-400">✗ {migrationErgebnis.fehler} Fehler</span>}
                      {migrationErgebnis.uebersprungen > 0 && <span className="text-slate-500">↷ {migrationErgebnis.uebersprungen} übersprungen</span>}
                    </div>
                    {migrationErgebnis.details.map((d, i) => (
                      <p key={i} className="text-xs text-slate-500 dark:text-slate-400">{d}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
