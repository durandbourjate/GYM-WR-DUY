import { useState } from 'react'
import type { PruefungsConfig } from '../../../types/pruefung.ts'
import { Section, Field, Toggle } from './ComposerUI.tsx'

interface Props {
  pruefung: PruefungsConfig
  updatePruefung: (partial: Partial<PruefungsConfig>) => void
  toggleFachbereich: (fb: string) => void
}

export default function ConfigTab({ pruefung, updatePruefung, toggleFachbereich }: Props) {
  const [neueEmail, setNeueEmail] = useState('')
  const [neueMinuten, setNeueMinuten] = useState(15)

  const zeitverlaengerungen = pruefung.zeitverlaengerungen ?? {}
  const eintraege = Object.entries(zeitverlaengerungen)

  function addZeitverlaengerung(): void {
    const email = neueEmail.trim().toLowerCase()
    if (!email || !email.includes('@')) return
    updatePruefung({
      zeitverlaengerungen: { ...zeitverlaengerungen, [email]: neueMinuten },
    })
    setNeueEmail('')
    setNeueMinuten(15)
  }

  function removeZeitverlaengerung(email: string): void {
    const kopie = { ...zeitverlaengerungen }
    delete kopie[email]
    updatePruefung({ zeitverlaengerungen: kopie })
  }

  return (
    <div className="space-y-6">
      {/* Grunddaten */}
      <Section titel="Grunddaten">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Titel" span={2}>
            <input
              type="text"
              value={pruefung.titel}
              onChange={(e) => updatePruefung({ titel: e.target.value })}
              placeholder="z.B. Prüfung VWL/Recht — Markt & Verträge"
              className="input-field"
            />
          </Field>

          <Field label="Klasse">
            <input
              type="text"
              value={pruefung.klasse}
              onChange={(e) => updatePruefung({ klasse: e.target.value, erlaubteKlasse: e.target.value })}
              placeholder="z.B. 29c WR (SF)"
              className="input-field"
            />
          </Field>

          <Field label="Datum">
            <input
              type="date"
              value={pruefung.datum}
              onChange={(e) => updatePruefung({ datum: e.target.value })}
              className="input-field"
            />
          </Field>

          <Field label="Gefäss">
            <select
              value={pruefung.gefaess}
              onChange={(e) => updatePruefung({ gefaess: e.target.value as 'SF' | 'EF' | 'EWR' })}
              className="input-field"
            >
              <option value="SF">SF (Schwerpunktfach)</option>
              <option value="EF">EF (Ergänzungsfach)</option>
              <option value="EWR">EWR (Einführung W&R)</option>
            </select>
          </Field>

          <Field label="Semester">
            <select
              value={pruefung.semester}
              onChange={(e) => updatePruefung({ semester: e.target.value })}
              className="input-field"
            >
              {['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>
        </div>

        {/* Fachbereiche */}
        <div className="mt-4">
          <label className="block text-xs font-medium text-slate-600 dark:text-slate-300 mb-2">
            Fachbereiche
          </label>
          <div className="flex gap-2">
            {['VWL', 'BWL', 'Recht'].map((fb) => {
              const aktiv = pruefung.fachbereiche.includes(fb)
              return (
                <button
                  key={fb}
                  onClick={() => toggleFachbereich(fb)}
                  className={`px-3 py-1.5 text-sm rounded-lg border transition-colors cursor-pointer
                    ${aktiv
                      ? fb === 'VWL' ? 'bg-orange-100 border-orange-300 text-orange-800 dark:bg-orange-900/30 dark:border-orange-700 dark:text-orange-300'
                      : fb === 'BWL' ? 'bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300'
                      : 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:border-green-700 dark:text-green-300'
                      : 'bg-slate-50 border-slate-300 text-slate-500 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-400'
                    }
                  `}
                >
                  {fb}
                </button>
              )
            })}
          </div>
        </div>
      </Section>

      {/* Prüfungsparameter */}
      <Section titel="Prüfungsparameter">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Field label="Dauer (Minuten)">
            <input
              type="number"
              value={pruefung.dauerMinuten}
              onChange={(e) => updatePruefung({ dauerMinuten: parseInt(e.target.value) || 0 })}
              min={5}
              max={300}
              className="input-field"
            />
          </Field>

          <Field label="Typ">
            <select
              value={pruefung.typ}
              onChange={(e) => updatePruefung({ typ: e.target.value as 'summativ' | 'formativ' })}
              className="input-field"
            >
              <option value="summativ">Summativ (benotet)</option>
              <option value="formativ">Formativ (unbenotet)</option>
            </select>
          </Field>

          <Field label="Gesamtpunkte">
            <input
              type="number"
              value={pruefung.gesamtpunkte}
              onChange={(e) => updatePruefung({ gesamtpunkte: parseInt(e.target.value) || 0 })}
              min={0}
              className="input-field"
            />
          </Field>
        </div>
      </Section>

      {/* Optionen */}
      <Section titel="Optionen">
        <div className="space-y-3">
          <Toggle
            label="Rücknavigation erlaubt"
            beschreibung="SuS können zwischen Fragen vor- und zurücknavigieren"
            aktiv={pruefung.ruecknavigation}
            onChange={(v) => updatePruefung({ ruecknavigation: v })}
          />
          <Toggle
            label="SEB erforderlich"
            beschreibung="Prüfung nur im Safe Exam Browser erlaubt"
            aktiv={pruefung.sebErforderlich}
            onChange={(v) => updatePruefung({ sebErforderlich: v })}
          />
          <Toggle
            label="Zufällige Fragenreihenfolge"
            beschreibung="Fragen innerhalb eines Abschnitts werden gemischt"
            aktiv={pruefung.zufallsreihenfolgeFragen}
            onChange={(v) => updatePruefung({ zufallsreihenfolgeFragen: v })}
          />
        </div>

        <div className="mt-4">
          <Field label="Zeitanzeige">
            <select
              value={pruefung.zeitanzeigeTyp}
              onChange={(e) => updatePruefung({ zeitanzeigeTyp: e.target.value as 'countdown' | 'verstricheneZeit' | 'keine' })}
              className="input-field"
            >
              <option value="countdown">Countdown (verbleibende Zeit)</option>
              <option value="verstricheneZeit">Verstrichene Zeit</option>
              <option value="keine">Keine Zeitanzeige</option>
            </select>
          </Field>
        </div>
      </Section>

      {/* Zeitzuschläge (Nachteilsausgleich) */}
      <Section titel="Zeitzuschläge (Nachteilsausgleich)">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Individuelle Zeitverlängerungen für SuS mit Nachteilsausgleich. Die zusätzlichen Minuten werden zur regulären Prüfungsdauer addiert.
        </p>

        {/* Bestehende Einträge */}
        {eintraege.length > 0 && (
          <div className="space-y-2 mb-4">
            {eintraege.map(([email, minuten]) => (
              <div
                key={email}
                className="flex items-center gap-3 px-3 py-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg text-sm"
              >
                <span className="flex-1 text-slate-700 dark:text-slate-200 truncate">{email}</span>
                <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded font-medium">
                  +{minuten} Min.
                </span>
                <button
                  onClick={() => removeZeitverlaengerung(email)}
                  className="w-6 h-6 text-xs text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded cursor-pointer transition-colors"
                  title="Entfernen"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Neuen Eintrag hinzufügen */}
        <div className="flex items-end gap-2">
          <Field label="E-Mail">
            <input
              type="email"
              value={neueEmail}
              onChange={(e) => setNeueEmail(e.target.value)}
              placeholder="vorname.nachname@stud.gymhofwil.ch"
              className="input-field"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addZeitverlaengerung()
                }
              }}
            />
          </Field>
          <Field label="Minuten">
            <input
              type="number"
              value={neueMinuten}
              onChange={(e) => setNeueMinuten(parseInt(e.target.value) || 0)}
              min={1}
              max={120}
              className="input-field w-20"
            />
          </Field>
          <button
            onClick={addZeitverlaengerung}
            disabled={!neueEmail.trim() || !neueEmail.includes('@')}
            className="px-3 py-2 text-sm font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-800 rounded-lg hover:bg-slate-900 dark:hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer mb-px"
          >
            +
          </button>
        </div>
      </Section>
    </div>
  )
}
