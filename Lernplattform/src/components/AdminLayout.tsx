import { useGruppenStore } from '../store/gruppenStore'

export default function AdminLayout() {
  const { aktiveGruppe, mitglieder } = useGruppenStore()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4">
        <h1 className="text-lg font-bold dark:text-white">Admin-Dashboard</h1>
        <span className="text-sm text-gray-500">{aktiveGruppe?.name}</span>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Gruppe verwalten</h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 mb-4">Admin-Funktionen kommen in Phase 4-5.</p>
          <h3 className="font-medium mb-2 dark:text-white">Mitglieder ({mitglieder.length})</h3>
          <ul className="space-y-1">
            {mitglieder.map((m) => (
              <li key={m.email} className="text-sm text-gray-600 dark:text-gray-400">
                {m.name} ({m.email}) — {m.rolle}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}
