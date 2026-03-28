import { Abschnitt, Feld } from './EditorBausteine.tsx'

interface FreitextEditorProps {
  laenge: 'kurz' | 'mittel' | 'lang'
  setLaenge: (v: 'kurz' | 'mittel' | 'lang') => void
  placeholder: string
  setPlaceholder: (v: string) => void
  minWoerter?: number
  setMinWoerter: (v: number | undefined) => void
  maxWoerter?: number
  setMaxWoerter: (v: number | undefined) => void
}

export default function FreitextEditor({ laenge, setLaenge, placeholder, setPlaceholder, minWoerter, setMinWoerter, maxWoerter, setMaxWoerter }: FreitextEditorProps) {
  return (
    <Abschnitt titel="Freitext-Optionen">
      <div className="grid grid-cols-2 gap-3">
        <Feld label="Erwartete Länge">
          <select value={laenge} onChange={(e) => setLaenge(e.target.value as 'kurz' | 'mittel' | 'lang')} className="input-field">
            <option value="kurz">Kurz (1-3 Sätze)</option>
            <option value="mittel">Mittel (1 Absatz)</option>
            <option value="lang">Lang (mehrere Absätze)</option>
          </select>
        </Feld>
        <Feld label="Hilfstext (Placeholder)">
          <input type="text" value={placeholder} onChange={(e) => setPlaceholder(e.target.value)}
            placeholder="Hinweis für SuS..." className="input-field" />
        </Feld>
      </div>
      <div className="flex gap-3 mt-3">
        <Feld label="Min. Wörter (optional)">
          <input
            type="number"
            min={0}
            value={minWoerter ?? ''}
            onChange={(e) => {
              const val = e.target.value === '' ? undefined : parseInt(e.target.value, 10)
              setMinWoerter(val !== undefined && !isNaN(val) ? val : undefined)
            }}
            placeholder="z.B. 50"
            className="input-field"
          />
        </Feld>
        <Feld label="Max. Wörter (optional)">
          <input
            type="number"
            min={0}
            value={maxWoerter ?? ''}
            onChange={(e) => {
              const val = e.target.value === '' ? undefined : parseInt(e.target.value, 10)
              setMaxWoerter(val !== undefined && !isNaN(val) ? val : undefined)
            }}
            placeholder="z.B. 200"
            className="input-field"
          />
        </Feld>
      </div>
    </Abschnitt>
  )
}
