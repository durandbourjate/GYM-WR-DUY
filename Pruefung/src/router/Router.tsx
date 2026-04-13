import { BrowserRouter } from 'react-router-dom'
import { migrateHashBookmarks } from './hashMigration'
import { lazy, Suspense } from 'react'

// Phase 1: App.tsx wird unverändert innerhalb des BrowserRouter gerendert.
// Die bestehende if/else-Logik in App.tsx (Rollen-Routing, Prüfungs-Laden)
// funktioniert weiter. Der BrowserRouter stellt den Kontext bereit, damit
// Komponenten schrittweise auf useNavigate/useParams umgestellt werden können.
//
// In Phase 2 wird App.tsx aufgebrochen und durch echte <Routes> ersetzt.
const AppComponent = lazy(() => import('../App'))

const basePath = import.meta.env.BASE_URL

// Hash-Migration einmalig beim Laden (alte #/... Lesezeichen → /...)
migrateHashBookmarks(basePath)

export function AppRouter() {
  return (
    <BrowserRouter basename={basePath}>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
          <p className="text-slate-500 dark:text-slate-400">Wird geladen...</p>
        </div>
      }>
        <AppComponent />
      </Suspense>
    </BrowserRouter>
  )
}
