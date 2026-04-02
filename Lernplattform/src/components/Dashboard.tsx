import { useAuthStore } from '../store/authStore'
import { useGruppenStore } from '../store/gruppenStore'

export default function Dashboard() {
  const { user, abmelden } = useAuthStore()
  const { aktiveGruppe } = useGruppenStore()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold dark:text-white">Lernplattform</h1>
          {aktiveGruppe && (
            <span className="text-sm text-gray-500">{aktiveGruppe.name}</span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 dark:text-gray-400">{user?.vorname || user?.email}</span>
          {user?.bild && (
            <img src={user.bild} alt="" className="w-8 h-8 rounded-full" />
          )}
          <button
            onClick={abmelden}
            className="text-sm text-gray-400 hover:text-gray-600"
          >
            Abmelden
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        <h2 className="text-xl font-bold mb-4 dark:text-white">
          Hallo {user?.vorname || 'dort'}!
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm text-gray-500 dark:text-gray-400">
          <p>Dashboard kommt in Phase 2.</p>
          <p className="mt-2 text-sm">
            Eingeloggt als: {user?.email}<br />
            Gruppe: {aktiveGruppe?.name || 'keine'}<br />
            Rolle: {user?.rolle}
          </p>
        </div>
      </main>
    </div>
  )
}
