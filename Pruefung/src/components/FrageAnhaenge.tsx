import { useState } from 'react'
import type { FrageAnhang } from '../types/fragen.ts'

interface Props {
  anhaenge: FrageAnhang[]
}

/** Zeigt Anhänge einer Frage an (Bilder inline, PDFs als Preview/Link) */
export default function FrageAnhaenge({ anhaenge }: Props) {
  const [lightboxId, setLightboxId] = useState<string | null>(null)

  if (!anhaenge || anhaenge.length === 0) return null

  const lightboxAnhang = lightboxId ? anhaenge.find((a) => a.id === lightboxId) : null

  return (
    <>
      <div className="space-y-3 mt-3">
        {anhaenge.map((a) => {
          const istBild = a.mimeType.startsWith('image/')
          const thumbnailUrl = `https://drive.google.com/thumbnail?id=${a.driveFileId}&sz=w800`
          const previewUrl = `https://drive.google.com/file/d/${a.driveFileId}/preview`

          if (istBild) {
            return (
              <div key={a.id} className="group">
                <button
                  type="button"
                  onClick={() => setLightboxId(a.id)}
                  className="block w-full cursor-pointer"
                  title={a.beschreibung || a.dateiname}
                >
                  <img
                    src={thumbnailUrl}
                    alt={a.beschreibung || a.dateiname}
                    className="max-w-full rounded-lg border border-slate-200 dark:border-slate-600 shadow-sm group-hover:shadow-md transition-shadow"
                    loading="lazy"
                  />
                </button>
                {a.beschreibung && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 italic">{a.beschreibung}</p>
                )}
              </div>
            )
          }

          // PDF
          return (
            <div key={a.id} className="rounded-lg border border-slate-200 dark:border-slate-600 overflow-hidden">
              <iframe
                src={previewUrl}
                title={a.dateiname}
                className="w-full h-64 border-0"
                allow="autoplay"
              />
              <div className="px-3 py-2 bg-slate-50 dark:bg-slate-700/30 flex items-center justify-between">
                <span className="text-xs text-slate-600 dark:text-slate-300 truncate">📄 {a.dateiname}</span>
                <a
                  href={`https://drive.google.com/file/d/${a.driveFileId}/view`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 underline shrink-0 ml-2"
                >
                  Öffnen
                </a>
              </div>
            </div>
          )
        })}
      </div>

      {/* Lightbox */}
      {lightboxAnhang && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
          onClick={() => setLightboxId(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxId(null)}
            className="absolute top-4 right-4 w-10 h-10 text-white text-2xl bg-black/40 rounded-full hover:bg-black/60 transition-colors cursor-pointer flex items-center justify-center"
            title="Schliessen"
          >
            ×
          </button>
          <img
            src={`https://drive.google.com/thumbnail?id=${lightboxAnhang.driveFileId}&sz=w1600`}
            alt={lightboxAnhang.beschreibung || lightboxAnhang.dateiname}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
