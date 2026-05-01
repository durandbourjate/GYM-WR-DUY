import { FRAGETYP_KOMPONENTEN } from './shared/fragetypenRegistry.ts'
import MedienPlayer from './shared/MedienPlayer.tsx'
import type { Frage, VisualisierungFrage } from '../types/fragen-storage'
import type { Antwort } from '../types/antworten.ts'

interface FrageRendererProps {
  frage: Frage
  /**
   * 'aufgabe' (default): interaktiv — Fragetyp-Komponente liest Antwort aus dem
   * `useFrageAdapter`-Store-Hook. Wird überall dort verwendet, wo der Benutzer
   * gerade antwortet (Prüfung, Übung vor „Antwort prüfen").
   *
   * 'loesung': readonly — Fragetyp-Komponente rendert Phase-2-Lösungs-Layout
   * (pro Zeile Marker/Rahmen, `option.erklaerung`/`aussage.erklaerung`/... pro
   * Sub-Element). Die angezeigte SuS-Antwort kommt aus dem `antwort`-Prop.
   * Wird im Üben-Modus nach „Antwort prüfen" verwendet (via UebungsScreen).
   */
  modus?: 'aufgabe' | 'loesung'
  /** Nur im modus='loesung': die korrigiert dargestellte SuS-Antwort. */
  antwort?: Antwort | null
}

/** Rendert die passende Fragetyp-Komponente basierend auf frage.typ */
export default function FrageRenderer({ frage, modus = 'aufgabe', antwort }: FrageRendererProps) {
  const medienEinbettung = frage.medienEinbettung

  const fragInhalt = (() => {
    // Sonderfall: visualisierung/zeichnen — nur Untertyp 'zeichnen' ist implementiert
    if (frage.typ === 'visualisierung') {
      const vizFrage = frage as VisualisierungFrage
      if (vizFrage.untertyp !== 'zeichnen') {
        return (
          <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 text-center">
            Visualisierungs-Untertyp «{vizFrage.untertyp}» wird in einer späteren Phase implementiert.
          </div>
        )
      }
    }

    const Komponente = FRAGETYP_KOMPONENTEN[frage.typ]
    if (!Komponente) {
      return (
        <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-500 dark:text-slate-400 text-center">
          Fragetyp «{(frage as { typ: string }).typ}» wird in einer späteren Phase implementiert.
        </div>
      )
    }
    return <Komponente frage={frage} modus={modus} antwort={antwort ?? null} />
  })()

  // Medien-Einbettung vor dem Frageinhalt rendern
  if (medienEinbettung) {
    return (
      <div className="flex flex-col gap-4">
        <MedienPlayer
          url={medienEinbettung.url}
          typ={medienEinbettung.typ}
          maxAbspielungen={medienEinbettung.maxAbspielungen}
          autoplay={medienEinbettung.autoplay}
        />
        {fragInhalt}
      </div>
    )
  }

  return fragInhalt
}
