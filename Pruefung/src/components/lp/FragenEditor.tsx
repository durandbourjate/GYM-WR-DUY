import { useState } from 'react'
import type {
  Frage, Fachbereich, BloomStufe, Gefaess,
  MCFrage, FreitextFrage, LueckentextFrage, ZuordnungFrage,
  RichtigFalschFrage, BerechnungFrage,
  MCOption, Bewertungskriterium,
} from '../../types/fragen.ts'

type FrageTyp = 'mc' | 'freitext' | 'lueckentext' | 'zuordnung' | 'richtigfalsch' | 'berechnung'

interface Props {
  /** Bestehende Frage zum Bearbeiten, oder null für neue */
  frage: Frage | null
  onSpeichern: (frage: Frage) => void
  onAbbrechen: () => void
}

/** Vollbild-Editor zum Erstellen und Bearbeiten von Prüfungsfragen */
export default function FragenEditor({ frage, onSpeichern, onAbbrechen }: Props) {
  // Grunddaten
  const [typ, setTyp] = useState<FrageTyp>(frage?.typ as FrageTyp ?? 'mc')
  const [fachbereich, setFachbereich] = useState<Fachbereich>(frage?.fachbereich ?? 'VWL')
  const [thema, setThema] = useState(frage?.thema ?? '')
  const [unterthema, setUnterthema] = useState(frage?.unterthema ?? '')
  const [bloom, setBloom] = useState<BloomStufe>(frage?.bloom ?? 'K2')
  const [punkte, setPunkte] = useState(frage?.punkte ?? 1)
  const [tags, setTags] = useState(frage?.tags.join(', ') ?? '')
  const [semester, setSemester] = useState<string[]>(frage?.semester ?? [])
  const [gefaesse, setGefaesse] = useState<Gefaess[]>(frage?.gefaesse ?? ['SF'])

  // Gemeinsam
  const [fragetext, setFragetext] = useState(
    frage && 'fragetext' in frage ? (frage as { fragetext: string }).fragetext : ''
  )
  const [musterlosung, setMusterlosung] = useState(frage?.musterlosung ?? '')
  const [bewertungsraster, setBewertungsraster] = useState<Bewertungskriterium[]>(
    frage?.bewertungsraster ?? [{ beschreibung: '', punkte: 1 }]
  )

  // MC-spezifisch
  const [optionen, setOptionen] = useState<MCOption[]>(
    frage?.typ === 'mc' ? (frage as MCFrage).optionen : [
      { id: 'a', text: '', korrekt: true },
      { id: 'b', text: '', korrekt: false },
      { id: 'c', text: '', korrekt: false },
      { id: 'd', text: '', korrekt: false },
    ]
  )
  const [mehrfachauswahl, setMehrfachauswahl] = useState(
    frage?.typ === 'mc' ? (frage as MCFrage).mehrfachauswahl : false
  )

  // Freitext-spezifisch
  const [laenge, setLaenge] = useState<'kurz' | 'mittel' | 'lang'>(
    frage?.typ === 'freitext' ? (frage as FreitextFrage).laenge : 'mittel'
  )
  const [placeholder, setPlaceholder] = useState(
    frage?.typ === 'freitext' ? (frage as FreitextFrage).hilfstextPlaceholder ?? '' : ''
  )

  // Lückentext-spezifisch
  const [textMitLuecken, setTextMitLuecken] = useState(
    frage?.typ === 'lueckentext' ? (frage as LueckentextFrage).textMitLuecken : ''
  )
  const [luecken, setLuecken] = useState(
    frage?.typ === 'lueckentext' ? (frage as LueckentextFrage).luecken : []
  )

  // Zuordnung-spezifisch
  const [paare, setPaare] = useState(
    frage?.typ === 'zuordnung' ? (frage as ZuordnungFrage).paare : [
      { links: '', rechts: '' },
      { links: '', rechts: '' },
    ]
  )

  // Richtig/Falsch-spezifisch
  const [aussagen, setAussagen] = useState<RichtigFalschFrage['aussagen']>(
    frage?.typ === 'richtigfalsch' ? (frage as RichtigFalschFrage).aussagen : [
      { id: '1', text: '', korrekt: true },
      { id: '2', text: '', korrekt: false },
      { id: '3', text: '', korrekt: true },
    ]
  )

  // Berechnung-spezifisch
  const [ergebnisse, setErgebnisse] = useState<BerechnungFrage['ergebnisse']>(
    frage?.typ === 'berechnung' ? (frage as BerechnungFrage).ergebnisse : [
      { id: '1', label: 'Ergebnis', korrekt: 0, toleranz: 0, einheit: '' },
    ]
  )
  const [rechenwegErforderlich, setRechenwegErforderlich] = useState(
    frage?.typ === 'berechnung' ? (frage as BerechnungFrage).rechenwegErforderlich : true
  )
  const [hilfsmittel, setHilfsmittel] = useState(
    frage?.typ === 'berechnung' ? (frage as BerechnungFrage).hilfsmittel ?? '' : ''
  )

  // Validierung
  const [fehler, setFehler] = useState<string[]>([])

  function validiere(): string[] {
    const errs: string[] = []
    if (!thema.trim()) errs.push('Thema fehlt')
    if (!fragetext.trim()) errs.push('Fragetext fehlt')
    if (punkte <= 0) errs.push('Punkte müssen > 0 sein')

    if (typ === 'mc') {
      if (optionen.filter((o) => o.text.trim()).length < 2) errs.push('Mindestens 2 Optionen nötig')
      if (!optionen.some((o) => o.korrekt)) errs.push('Mindestens 1 korrekte Option nötig')
    }
    if (typ === 'lueckentext') {
      if (!textMitLuecken.includes('{{')) errs.push('Lückentext braucht {{1}}-Platzhalter')
    }
    if (typ === 'zuordnung') {
      if (paare.filter((p) => p.links.trim() && p.rechts.trim()).length < 2) errs.push('Mindestens 2 Paare nötig')
    }
    if (typ === 'richtigfalsch') {
      if (aussagen.filter((a) => a.text.trim()).length < 2) errs.push('Mindestens 2 Aussagen nötig')
    }
    if (typ === 'berechnung') {
      if (ergebnisse.filter((e) => e.label.trim()).length < 1) errs.push('Mindestens 1 Ergebnis nötig')
    }
    return errs
  }

  function handleSpeichern(): void {
    const errs = validiere()
    if (errs.length > 0) {
      setFehler(errs)
      return
    }
    setFehler([])

    const jetzt = new Date().toISOString()
    const tagListe = tags.split(',').map((t) => t.trim()).filter(Boolean)
    const id = frage?.id ?? generiereFrageId(fachbereich, typ)

    const basis = {
      id,
      version: frage ? frage.version + 1 : 1,
      erstelltAm: frage?.erstelltAm ?? jetzt,
      geaendertAm: jetzt,
      fachbereich,
      thema: thema.trim(),
      unterthema: unterthema.trim() || undefined,
      semester,
      gefaesse,
      bloom,
      tags: tagListe,
      punkte,
      musterlosung: musterlosung.trim(),
      bewertungsraster: bewertungsraster.filter((b) => b.beschreibung.trim()),
      verwendungen: frage?.verwendungen ?? [],
      quelle: frage?.quelle ?? 'manuell' as const,
    }

    let neueFrage: Frage

    switch (typ) {
      case 'mc':
        neueFrage = {
          ...basis,
          typ: 'mc',
          fragetext: fragetext.trim(),
          optionen: optionen.filter((o) => o.text.trim()),
          mehrfachauswahl,
          zufallsreihenfolge: true,
        } as MCFrage
        break
      case 'freitext':
        neueFrage = {
          ...basis,
          typ: 'freitext',
          fragetext: fragetext.trim(),
          laenge,
          hilfstextPlaceholder: placeholder.trim() || undefined,
        } as FreitextFrage
        break
      case 'lueckentext':
        neueFrage = {
          ...basis,
          typ: 'lueckentext',
          fragetext: fragetext.trim(),
          textMitLuecken: textMitLuecken.trim(),
          luecken: luecken.length > 0 ? luecken : parseLuecken(textMitLuecken),
        } as LueckentextFrage
        break
      case 'zuordnung':
        neueFrage = {
          ...basis,
          typ: 'zuordnung',
          fragetext: fragetext.trim(),
          paare: paare.filter((p) => p.links.trim() && p.rechts.trim()),
          zufallsreihenfolge: true,
        } as ZuordnungFrage
        break
      case 'richtigfalsch':
        neueFrage = {
          ...basis,
          typ: 'richtigfalsch',
          fragetext: fragetext.trim(),
          aussagen: aussagen.filter((a) => a.text.trim()).map((a) => ({
            ...a,
            text: a.text.trim(),
          })),
        } as RichtigFalschFrage
        break
      case 'berechnung':
        neueFrage = {
          ...basis,
          typ: 'berechnung',
          fragetext: fragetext.trim(),
          ergebnisse: ergebnisse.filter((e) => e.label.trim()),
          rechenwegErforderlich,
          hilfsmittel: hilfsmittel.trim() || undefined,
        } as BerechnungFrage
        break
    }

    onSpeichern(neueFrage)
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40" onClick={onAbbrechen} />

      <div className="absolute right-0 top-0 bottom-0 w-full max-w-2xl bg-white dark:bg-slate-800 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {frage ? 'Frage bearbeiten' : 'Neue Frage erstellen'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onAbbrechen}
              className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
            >
              Abbrechen
            </button>
            <button
              onClick={handleSpeichern}
              className="px-4 py-2 text-sm font-semibold text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-800 rounded-lg hover:bg-slate-900 dark:hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Speichern
            </button>
          </div>
        </div>

        {/* Fehler */}
        {fehler.length > 0 && (
          <div className="mx-5 mt-3 px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            {fehler.map((f, i) => (
              <p key={i} className="text-sm text-red-700 dark:text-red-300">{f}</p>
            ))}
          </div>
        )}

        {/* Scrollbarer Inhalt */}
        <div className="flex-1 overflow-auto px-5 py-4 space-y-5">

          {/* Fragetyp wählen */}
          <Abschnitt titel="Fragetyp">
            <div className="flex gap-2 flex-wrap">
              {(['mc', 'freitext', 'lueckentext', 'zuordnung', 'richtigfalsch', 'berechnung'] as FrageTyp[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTyp(t)}
                  disabled={!!frage}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors cursor-pointer
                    ${typ === t
                      ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 border-slate-800 dark:border-slate-200'
                      : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }
                    ${frage ? 'opacity-60 cursor-not-allowed' : ''}
                  `}
                >
                  {typLabel(t)}
                </button>
              ))}
            </div>
          </Abschnitt>

          {/* Grunddaten */}
          <Abschnitt titel="Zuordnung">
            <div className="grid grid-cols-2 gap-3">
              <Feld label="Fachbereich">
                <select value={fachbereich} onChange={(e) => setFachbereich(e.target.value as Fachbereich)} className="input-field">
                  <option value="VWL">VWL</option>
                  <option value="BWL">BWL</option>
                  <option value="Recht">Recht</option>
                </select>
              </Feld>
              <Feld label="Bloom-Stufe">
                <select value={bloom} onChange={(e) => setBloom(e.target.value as BloomStufe)} className="input-field">
                  {(['K1', 'K2', 'K3', 'K4', 'K5', 'K6'] as BloomStufe[]).map((k) => (
                    <option key={k} value={k}>{k} — {bloomLabel(k)}</option>
                  ))}
                </select>
              </Feld>
              <Feld label="Thema *">
                <input type="text" value={thema} onChange={(e) => setThema(e.target.value)}
                  placeholder="z.B. Marktgleichgewicht" className="input-field" />
              </Feld>
              <Feld label="Unterthema">
                <input type="text" value={unterthema} onChange={(e) => setUnterthema(e.target.value)}
                  placeholder="z.B. Angebot & Nachfrage" className="input-field" />
              </Feld>
              <Feld label="Punkte *">
                <input type="number" value={punkte} onChange={(e) => setPunkte(parseInt(e.target.value) || 0)}
                  min={1} max={20} className="input-field" />
              </Feld>
              <Feld label="Tags (Komma-getrennt)">
                <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                  placeholder="z.B. Angebot, Nachfrage, BIP" className="input-field" />
              </Feld>
            </div>

            {/* Semester + Gefässe */}
            <div className="flex gap-6 mt-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Semester</label>
                <div className="flex gap-1 flex-wrap">
                  {['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'].map((s) => (
                    <button
                      key={s}
                      onClick={() => setSemester((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])}
                      className={`px-2 py-1 text-xs rounded border transition-colors cursor-pointer
                        ${semester.includes(s)
                          ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 border-slate-800 dark:border-slate-200'
                          : 'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400'
                        }`}
                    >{s}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">Gefäss</label>
                <div className="flex gap-1">
                  {(['SF', 'EF', 'EWR'] as Gefaess[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => setGefaesse((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g])}
                      className={`px-2 py-1 text-xs rounded border transition-colors cursor-pointer
                        ${gefaesse.includes(g)
                          ? 'bg-slate-800 dark:bg-slate-200 text-white dark:text-slate-800 border-slate-800 dark:border-slate-200'
                          : 'border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400'
                        }`}
                    >{g}</button>
                  ))}
                </div>
              </div>
            </div>
          </Abschnitt>

          {/* Fragetext */}
          <Abschnitt titel="Fragetext *">
            <textarea
              value={fragetext}
              onChange={(e) => setFragetext(e.target.value)}
              rows={4}
              placeholder="Formulieren Sie die Frage... (Markdown: **fett**, *kursiv*)"
              className="input-field resize-y"
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Tipp: **fett** für Hervorhebungen, \n für Absätze
            </p>
          </Abschnitt>

          {/* Typ-spezifische Felder */}
          {typ === 'mc' && (
            <MCEditor
              optionen={optionen}
              setOptionen={setOptionen}
              mehrfachauswahl={mehrfachauswahl}
              setMehrfachauswahl={setMehrfachauswahl}
            />
          )}

          {typ === 'freitext' && (
            <FreitextEditor
              laenge={laenge}
              setLaenge={setLaenge}
              placeholder={placeholder}
              setPlaceholder={setPlaceholder}
            />
          )}

          {typ === 'lueckentext' && (
            <LueckentextEditor
              textMitLuecken={textMitLuecken}
              setTextMitLuecken={setTextMitLuecken}
              luecken={luecken}
              setLuecken={setLuecken}
            />
          )}

          {typ === 'zuordnung' && (
            <ZuordnungEditor paare={paare} setPaare={setPaare} />
          )}

          {typ === 'richtigfalsch' && (
            <RichtigFalschEditor aussagen={aussagen} setAussagen={setAussagen} />
          )}

          {typ === 'berechnung' && (
            <BerechnungEditor
              ergebnisse={ergebnisse}
              setErgebnisse={setErgebnisse}
              rechenwegErforderlich={rechenwegErforderlich}
              setRechenwegErforderlich={setRechenwegErforderlich}
              hilfsmittel={hilfsmittel}
              setHilfsmittel={setHilfsmittel}
            />
          )}

          {/* Musterlösung */}
          <Abschnitt titel="Musterlösung">
            <textarea
              value={musterlosung}
              onChange={(e) => setMusterlosung(e.target.value)}
              rows={3}
              placeholder="Erwartete korrekte Antwort..."
              className="input-field resize-y"
            />
          </Abschnitt>

          {/* Bewertungsraster */}
          <Abschnitt titel="Bewertungsraster">
            <div className="space-y-2">
              {bewertungsraster.map((kriterium, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <input
                    type="text"
                    value={kriterium.beschreibung}
                    onChange={(e) => {
                      const neu = [...bewertungsraster]
                      neu[i] = { ...neu[i], beschreibung: e.target.value }
                      setBewertungsraster(neu)
                    }}
                    placeholder="Kriterium..."
                    className="input-field flex-1"
                  />
                  <input
                    type="number"
                    value={kriterium.punkte}
                    onChange={(e) => {
                      const neu = [...bewertungsraster]
                      neu[i] = { ...neu[i], punkte: parseInt(e.target.value) || 0 }
                      setBewertungsraster(neu)
                    }}
                    min={0}
                    className="input-field w-16 text-center"
                    title="Punkte"
                  />
                  <button
                    onClick={() => setBewertungsraster(bewertungsraster.filter((_, j) => j !== i))}
                    className="w-7 h-7 text-red-400 hover:text-red-600 dark:hover:text-red-300 cursor-pointer text-sm shrink-0 mt-1"
                  >×</button>
                </div>
              ))}
              <button
                onClick={() => setBewertungsraster([...bewertungsraster, { beschreibung: '', punkte: 1 }])}
                className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                + Kriterium hinzufügen
              </button>
            </div>
          </Abschnitt>
        </div>
      </div>
    </div>
  )
}

// === TYP-SPEZIFISCHE EDITOREN ===

function MCEditor({ optionen, setOptionen, mehrfachauswahl, setMehrfachauswahl }: {
  optionen: MCOption[]
  setOptionen: (o: MCOption[]) => void
  mehrfachauswahl: boolean
  setMehrfachauswahl: (v: boolean) => void
}) {
  function updateOption(index: number, partial: Partial<MCOption>): void {
    const neu = [...optionen]
    neu[index] = { ...neu[index], ...partial }
    setOptionen(neu)
  }

  function addOption(): void {
    const nextId = String.fromCharCode(97 + optionen.length) // a, b, c, ...
    setOptionen([...optionen, { id: nextId, text: '', korrekt: false }])
  }

  function removeOption(index: number): void {
    if (optionen.length <= 2) return
    setOptionen(optionen.filter((_, i) => i !== index))
  }

  return (
    <Abschnitt titel="Antwortoptionen">
      <div className="flex items-center gap-3 mb-3">
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={mehrfachauswahl}
            onChange={(e) => setMehrfachauswahl(e.target.checked)}
            className="rounded"
          />
          Mehrfachauswahl erlaubt
        </label>
      </div>

      <div className="space-y-2">
        {optionen.map((opt, i) => (
          <div key={opt.id} className="flex items-start gap-2">
            {/* Korrekt-Toggle */}
            <button
              onClick={() => updateOption(i, { korrekt: !opt.korrekt })}
              className={`mt-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 cursor-pointer transition-colors
                ${opt.korrekt
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'border-slate-400 dark:border-slate-500 hover:border-green-400'
                }`}
              title={opt.korrekt ? 'Korrekt (klicken zum Entfernen)' : 'Als korrekt markieren'}
            >
              {opt.korrekt && <span className="text-xs">✓</span>}
            </button>

            {/* Option-ID */}
            <span className="mt-2 text-xs text-slate-400 dark:text-slate-500 font-mono w-4 shrink-0">
              {opt.id})
            </span>

            {/* Text */}
            <input
              type="text"
              value={opt.text}
              onChange={(e) => updateOption(i, { text: e.target.value })}
              placeholder={`Option ${opt.id}...`}
              className="input-field flex-1"
            />

            {/* Entfernen */}
            {optionen.length > 2 && (
              <button
                onClick={() => removeOption(i)}
                className="mt-1.5 w-6 h-6 text-red-400 hover:text-red-600 dark:hover:text-red-300 cursor-pointer text-sm shrink-0"
              >×</button>
            )}
          </div>
        ))}
      </div>

      {optionen.length < 8 && (
        <button
          onClick={addOption}
          className="mt-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
        >
          + Option hinzufügen
        </button>
      )}
    </Abschnitt>
  )
}

function FreitextEditor({ laenge, setLaenge, placeholder, setPlaceholder }: {
  laenge: 'kurz' | 'mittel' | 'lang'
  setLaenge: (v: 'kurz' | 'mittel' | 'lang') => void
  placeholder: string
  setPlaceholder: (v: string) => void
}) {
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
    </Abschnitt>
  )
}

function LueckentextEditor({ textMitLuecken, setTextMitLuecken, luecken, setLuecken }: {
  textMitLuecken: string
  setTextMitLuecken: (v: string) => void
  luecken: LueckentextFrage['luecken']
  setLuecken: (v: LueckentextFrage['luecken']) => void
}) {
  // Auto-parse Lücken aus Text
  function handleTextChange(text: string): void {
    setTextMitLuecken(text)
    const matches = text.match(/\{\{(\d+)\}\}/g)
    if (matches) {
      const ids = [...new Set(matches.map((m) => m.replace(/[{}]/g, '')))]
      // Bestehende Lücken beibehalten, neue hinzufügen
      const neueLuecken = ids.map((id) => {
        const bestehend = luecken.find((l) => l.id === id)
        return bestehend ?? { id, korrekteAntworten: [''], caseSensitive: false }
      })
      setLuecken(neueLuecken)
    }
  }

  return (
    <Abschnitt titel="Lückentext">
      <Feld label="Text mit Lücken">
        <textarea
          value={textMitLuecken}
          onChange={(e) => handleTextChange(e.target.value)}
          rows={4}
          placeholder="Verwenden Sie {{1}}, {{2}} etc. als Platzhalter für Lücken..."
          className="input-field resize-y font-mono text-sm"
        />
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Syntax: {'{{1}}'} = erste Lücke, {'{{2}}'} = zweite Lücke, etc.
        </p>
      </Feld>

      {luecken.length > 0 && (
        <div className="mt-3 space-y-2">
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300">
            Korrekte Antworten pro Lücke
          </label>
          {luecken.map((luecke) => (
            <div key={luecke.id} className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono w-8 shrink-0">
                {`{{${luecke.id}}}`}
              </span>
              <input
                type="text"
                value={luecke.korrekteAntworten.join(', ')}
                onChange={(e) => {
                  const neu = luecken.map((l) =>
                    l.id === luecke.id
                      ? { ...l, korrekteAntworten: e.target.value.split(',').map((a) => a.trim()).filter(Boolean) }
                      : l
                  )
                  setLuecken(neu)
                }}
                placeholder="Korrekte Antworten (Komma-getrennt, z.B. Antwort1, Antwort2)"
                className="input-field flex-1"
              />
            </div>
          ))}
        </div>
      )}
    </Abschnitt>
  )
}

function ZuordnungEditor({ paare, setPaare }: {
  paare: { links: string; rechts: string }[]
  setPaare: (p: { links: string; rechts: string }[]) => void
}) {
  function updatePaar(index: number, seite: 'links' | 'rechts', wert: string): void {
    const neu = [...paare]
    neu[index] = { ...neu[index], [seite]: wert }
    setPaare(neu)
  }

  return (
    <Abschnitt titel="Zuordnungspaare">
      <div className="space-y-2">
        <div className="flex gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span className="flex-1">Begriff (links)</span>
          <span className="flex-1">Zuordnung (rechts)</span>
          <span className="w-6" />
        </div>
        {paare.map((paar, i) => (
          <div key={i} className="flex gap-2 items-start">
            <input
              type="text"
              value={paar.links}
              onChange={(e) => updatePaar(i, 'links', e.target.value)}
              placeholder={`Begriff ${i + 1}`}
              className="input-field flex-1"
            />
            <span className="mt-2 text-slate-400">→</span>
            <input
              type="text"
              value={paar.rechts}
              onChange={(e) => updatePaar(i, 'rechts', e.target.value)}
              placeholder={`Zuordnung ${i + 1}`}
              className="input-field flex-1"
            />
            {paare.length > 2 && (
              <button
                onClick={() => setPaare(paare.filter((_, j) => j !== i))}
                className="mt-1.5 w-6 h-6 text-red-400 hover:text-red-600 dark:hover:text-red-300 cursor-pointer text-sm shrink-0"
              >×</button>
            )}
          </div>
        ))}
      </div>

      {paare.length < 10 && (
        <button
          onClick={() => setPaare([...paare, { links: '', rechts: '' }])}
          className="mt-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
        >
          + Paar hinzufügen
        </button>
      )}
    </Abschnitt>
  )
}

function RichtigFalschEditor({ aussagen, setAussagen }: {
  aussagen: RichtigFalschFrage['aussagen']
  setAussagen: (a: RichtigFalschFrage['aussagen']) => void
}) {
  function updateAussage(index: number, partial: Partial<RichtigFalschFrage['aussagen'][0]>): void {
    const neu = [...aussagen]
    neu[index] = { ...neu[index], ...partial }
    setAussagen(neu)
  }

  function addAussage(): void {
    const nextId = String(aussagen.length + 1)
    setAussagen([...aussagen, { id: nextId, text: '', korrekt: true }])
  }

  function removeAussage(index: number): void {
    if (aussagen.length <= 2) return
    setAussagen(aussagen.filter((_, i) => i !== index))
  }

  return (
    <Abschnitt titel="Aussagen (Richtig/Falsch)">
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-3">
        Geben Sie die Aussagen ein und markieren Sie, ob sie richtig oder falsch sind.
      </p>
      <div className="space-y-2">
        {aussagen.map((a, i) => (
          <div key={a.id} className="flex items-start gap-2">
            {/* Richtig/Falsch Toggle */}
            <button
              onClick={() => updateAussage(i, { korrekt: !a.korrekt })}
              className={`mt-1.5 px-2 py-0.5 text-xs rounded-full border-2 font-medium shrink-0 cursor-pointer transition-colors
                ${a.korrekt
                  ? 'bg-green-50 border-green-500 text-green-700 dark:bg-green-900/30 dark:border-green-500 dark:text-green-300'
                  : 'bg-red-50 border-red-500 text-red-700 dark:bg-red-900/30 dark:border-red-500 dark:text-red-300'
                }`}
              title={a.korrekt ? 'Richtig (klicken für Falsch)' : 'Falsch (klicken für Richtig)'}
            >
              {a.korrekt ? 'R' : 'F'}
            </button>

            {/* Aussagentext */}
            <input
              type="text"
              value={a.text}
              onChange={(e) => updateAussage(i, { text: e.target.value })}
              placeholder={`Aussage ${i + 1}...`}
              className="input-field flex-1"
            />

            {/* Erklärung (optional) */}
            <input
              type="text"
              value={a.erklaerung ?? ''}
              onChange={(e) => updateAussage(i, { erklaerung: e.target.value || undefined })}
              placeholder="Erklärung (optional)"
              className="input-field w-40"
            />

            {/* Entfernen */}
            {aussagen.length > 2 && (
              <button
                onClick={() => removeAussage(i)}
                className="mt-1.5 w-6 h-6 text-red-400 hover:text-red-600 dark:hover:text-red-300 cursor-pointer text-sm shrink-0"
              >×</button>
            )}
          </div>
        ))}
      </div>

      {aussagen.length < 12 && (
        <button
          onClick={addAussage}
          className="mt-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
        >
          + Aussage hinzufügen
        </button>
      )}
    </Abschnitt>
  )
}

function BerechnungEditor({ ergebnisse, setErgebnisse, rechenwegErforderlich, setRechenwegErforderlich, hilfsmittel, setHilfsmittel }: {
  ergebnisse: BerechnungFrage['ergebnisse']
  setErgebnisse: (e: BerechnungFrage['ergebnisse']) => void
  rechenwegErforderlich: boolean
  setRechenwegErforderlich: (v: boolean) => void
  hilfsmittel: string
  setHilfsmittel: (v: string) => void
}) {
  function updateErgebnis(index: number, partial: Partial<BerechnungFrage['ergebnisse'][0]>): void {
    const neu = [...ergebnisse]
    neu[index] = { ...neu[index], ...partial }
    setErgebnisse(neu)
  }

  function addErgebnis(): void {
    const nextId = String(ergebnisse.length + 1)
    setErgebnisse([...ergebnisse, { id: nextId, label: '', korrekt: 0, toleranz: 0, einheit: '' }])
  }

  function removeErgebnis(index: number): void {
    if (ergebnisse.length <= 1) return
    setErgebnisse(ergebnisse.filter((_, i) => i !== index))
  }

  return (
    <Abschnitt titel="Berechnungs-Parameter">
      <div className="flex items-center gap-4 mb-4">
        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 cursor-pointer">
          <input
            type="checkbox"
            checked={rechenwegErforderlich}
            onChange={(e) => setRechenwegErforderlich(e.target.checked)}
            className="rounded"
          />
          Rechenweg erforderlich
        </label>
        <div className="flex-1">
          <input
            type="text"
            value={hilfsmittel}
            onChange={(e) => setHilfsmittel(e.target.value)}
            placeholder="Erlaubte Hilfsmittel (z.B. Taschenrechner)"
            className="input-field"
          />
        </div>
      </div>

      <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">
        Erwartete Ergebnisse
      </label>
      <div className="space-y-2">
        {ergebnisse.map((erg, i) => (
          <div key={erg.id} className="flex items-start gap-2">
            <input
              type="text"
              value={erg.label}
              onChange={(e) => updateErgebnis(i, { label: e.target.value })}
              placeholder="Bezeichnung (z.B. Gewinn)"
              className="input-field flex-1"
            />
            <input
              type="number"
              value={erg.korrekt}
              onChange={(e) => updateErgebnis(i, { korrekt: parseFloat(e.target.value) || 0 })}
              placeholder="Korrekt"
              className="input-field w-24 text-center font-mono"
              title="Korrekte Antwort"
            />
            <input
              type="number"
              value={erg.toleranz}
              onChange={(e) => updateErgebnis(i, { toleranz: parseFloat(e.target.value) || 0 })}
              placeholder="±Tol."
              className="input-field w-16 text-center"
              title="Toleranz"
              min={0}
            />
            <input
              type="text"
              value={erg.einheit ?? ''}
              onChange={(e) => updateErgebnis(i, { einheit: e.target.value || undefined })}
              placeholder="Einh."
              className="input-field w-16"
              title="Einheit"
            />
            {ergebnisse.length > 1 && (
              <button
                onClick={() => removeErgebnis(i)}
                className="mt-1.5 w-6 h-6 text-red-400 hover:text-red-600 dark:hover:text-red-300 cursor-pointer text-sm shrink-0"
              >×</button>
            )}
          </div>
        ))}
      </div>

      {ergebnisse.length < 8 && (
        <button
          onClick={addErgebnis}
          className="mt-2 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
        >
          + Ergebnis hinzufügen
        </button>
      )}
    </Abschnitt>
  )
}

// === UI-BAUSTEINE ===

function Abschnitt({ titel, children }: { titel: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
      <h3 className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide mb-3">
        {titel}
      </h3>
      {children}
    </div>
  )
}

function Feld({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
      {children}
    </div>
  )
}

// === HILFSFUNKTIONEN ===

function generiereFrageId(fachbereich: string, typ: string): string {
  const fb = fachbereich.toLowerCase()
  const typKuerzel: Record<string, string> = {
    mc: 'mc', freitext: 'ft', lueckentext: 'lt', zuordnung: 'zu',
    richtigfalsch: 'rf', berechnung: 'be',
  }
  const typKurz = typKuerzel[typ] ?? typ.slice(0, 2)
  const rand = Math.random().toString(36).slice(2, 6)
  return `${fb}-${typKurz}-${rand}`
}

function typLabel(typ: string): string {
  switch (typ) {
    case 'mc': return 'Multiple Choice'
    case 'freitext': return 'Freitext'
    case 'lueckentext': return 'Lückentext'
    case 'zuordnung': return 'Zuordnung'
    case 'richtigfalsch': return 'Richtig/Falsch'
    case 'berechnung': return 'Berechnung'
    default: return typ
  }
}

function bloomLabel(stufe: string): string {
  switch (stufe) {
    case 'K1': return 'Wissen'
    case 'K2': return 'Verstehen'
    case 'K3': return 'Anwenden'
    case 'K4': return 'Analysieren'
    case 'K5': return 'Beurteilen'
    case 'K6': return 'Erschaffen'
    default: return ''
  }
}

function parseLuecken(text: string): LueckentextFrage['luecken'] {
  const matches = text.match(/\{\{(\d+)\}\}/g)
  if (!matches) return []
  const ids = [...new Set(matches.map((m) => m.replace(/[{}]/g, '')))]
  return ids.map((id) => ({ id, korrekteAntworten: [''], caseSensitive: false }))
}
