import { useRef, useState, useCallback } from 'react'
import type { FrageAnhang } from '../../../types/fragen.ts'
import { Abschnitt } from './EditorBausteine.tsx'

const MAX_ANHAENGE = 5
const MAX_DATEI_GROESSE = 5 * 1024 * 1024 // 5 MB

interface Props {
  anhaenge: FrageAnhang[]
  neueAnhaenge: File[]
  onAnhangHinzu: (file: File) => void
  onAnhangEntfernen: (id: string) => void
  onNeuenAnhangEntfernen: (index: number) => void
}

/** Formatiert Dateigrösse menschenlesbar */
function formatGroesse(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Prüft ob MIME-Type ein Bild ist */
function istBild(mimeType: string): boolean {
  return mimeType.startsWith('image/')
}

export default function AnhangEditor({
  anhaenge,
  neueAnhaenge,
  onAnhangHinzu,
  onAnhangEntfernen,
  onNeuenAnhangEntfernen,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [fehler, setFehler] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const gesamtAnzahl = anhaenge.length + neueAnhaenge.length

  function handleDateiWaehlen(dateien: FileList | null): void {
    if (!dateien || dateien.length === 0) return
    setFehler(null)

    for (const datei of Array.from(dateien)) {
      if (gesamtAnzahl >= MAX_ANHAENGE) {
        setFehler(`Maximal ${MAX_ANHAENGE} Anhänge erlaubt.`)
        break
      }
      if (datei.size > MAX_DATEI_GROESSE) {
        setFehler(`"${datei.name}" ist zu gross (max. 5 MB).`)
        continue
      }
      if (!datei.type.startsWith('image/') && datei.type !== 'application/pdf') {
        setFehler(`"${datei.name}": Nur Bilder und PDFs erlaubt.`)
        continue
      }
      onAnhangHinzu(datei)
    }

    // Input zurücksetzen, damit gleiche Datei erneut gewählt werden kann
    if (inputRef.current) inputRef.current.value = ''
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleDateiWaehlen(e.dataTransfer.files)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gesamtAnzahl])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  return (
    <Abschnitt titel="Anhänge">
      {/* Drag & Drop Zone + Button */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors
          ${dragOver
            ? 'border-slate-500 bg-slate-100 dark:bg-slate-700/50'
            : 'border-slate-300 dark:border-slate-600'
          }
          ${gesamtAnzahl >= MAX_ANHAENGE ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf"
          multiple
          onChange={(e) => handleDateiWaehlen(e.target.files)}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={gesamtAnzahl >= MAX_ANHAENGE}
          className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Bild oder PDF hinzufügen
        </button>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
          Dateien hierher ziehen oder klicken — max. {MAX_ANHAENGE} Dateien, je max. 5 MB
        </p>
      </div>

      {/* Fehlermeldung */}
      {fehler && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-2">{fehler}</p>
      )}

      {/* Bestehende Anhänge */}
      {anhaenge.length > 0 && (
        <div className="mt-3 space-y-2">
          {anhaenge.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-600"
            >
              {/* Thumbnail oder Icon */}
              <div className="w-10 h-10 shrink-0 rounded bg-slate-200 dark:bg-slate-600 flex items-center justify-center overflow-hidden">
                {istBild(a.mimeType) ? (
                  <img
                    src={`https://drive.google.com/thumbnail?id=${a.driveFileId}&sz=w80`}
                    alt={a.dateiname}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-lg" title="PDF-Datei">📄</span>
                )}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 dark:text-slate-200 truncate">{a.dateiname}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{formatGroesse(a.groesseBytes)}</p>
              </div>
              {/* Löschen */}
              <button
                type="button"
                onClick={() => onAnhangEntfernen(a.id)}
                className="w-7 h-7 text-red-400 hover:text-red-600 dark:hover:text-red-300 cursor-pointer text-sm shrink-0"
                title="Anhang entfernen"
              >×</button>
            </div>
          ))}
        </div>
      )}

      {/* Neue (noch nicht hochgeladene) Dateien */}
      {neueAnhaenge.length > 0 && (
        <div className="mt-3 space-y-2">
          {neueAnhaenge.map((datei, idx) => (
            <div
              key={`neu-${idx}`}
              className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-200 dark:border-slate-600"
            >
              {/* Icon */}
              <div className="w-10 h-10 shrink-0 rounded bg-slate-200 dark:bg-slate-600 flex items-center justify-center">
                {istBild(datei.type) ? (
                  <span className="text-lg">🖼️</span>
                ) : (
                  <span className="text-lg">📄</span>
                )}
              </div>
              {/* Info + Badge */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm text-slate-700 dark:text-slate-200 truncate">{datei.name}</p>
                  <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded font-medium shrink-0">
                    Neu
                  </span>
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500">{formatGroesse(datei.size)}</p>
              </div>
              {/* Entfernen */}
              <button
                type="button"
                onClick={() => onNeuenAnhangEntfernen(idx)}
                className="w-7 h-7 text-red-400 hover:text-red-600 dark:hover:text-red-300 cursor-pointer text-sm shrink-0"
                title="Entfernen"
              >×</button>
            </div>
          ))}
        </div>
      )}

      {/* Zähler */}
      {gesamtAnzahl > 0 && (
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
          {gesamtAnzahl} / {MAX_ANHAENGE} Anhänge
        </p>
      )}
    </Abschnitt>
  )
}
