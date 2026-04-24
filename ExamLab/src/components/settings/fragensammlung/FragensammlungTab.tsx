import LueckentextBulkToggle from './LueckentextBulkToggle'

interface Props {
  email: string
  istAdmin: boolean
}

/**
 * Settings-Tab „Fragensammlung": globale Defaults für Fragetypen.
 *
 * Aktuell nur Lückentext-Bulk-Toggle. Geplante künftige Sektionen:
 *  - Metadaten-Felder (Semester, Quartale, Anzahl Jahre, Gefässe)
 *  - Andere Fragetyp-Settings
 */
export default function FragensammlungTab({ email, istAdmin }: Props) {
  return (
    <div className="space-y-6">
      <section>
        <h2 className="text-lg font-semibold mb-2 text-slate-900 dark:text-slate-100">
          Lückentext-Fragen
        </h2>
        <LueckentextBulkToggle email={email} istAdmin={istAdmin} />
      </section>
    </div>
  )
}
