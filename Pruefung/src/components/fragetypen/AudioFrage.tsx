import { useState, useRef, useCallback, useEffect } from 'react'
import { usePruefungStore } from '../../store/pruefungStore.ts'
import type { AudioFrage as AudioFrageType } from '../../types/fragen.ts'
import { renderMarkdown } from '../../utils/markdown.ts'
import { fachbereichFarbe } from '../../utils/fachUtils.ts'

interface Props {
  frage: AudioFrageType
}

export default function AudioFrage({ frage }: Props) {
  const antworten = usePruefungStore((s) => s.antworten)
  const setAntwort = usePruefungStore((s) => s.setAntwort)
  const abgegeben = usePruefungStore((s) => s.abgegeben)

  const aktuelleAntwort = antworten[frage.id]
  const bestehendeAufnahme = aktuelleAntwort?.typ === 'audio' ? aktuelleAntwort : null

  const [status, setStatus] = useState<'idle' | 'recording' | 'preview'>('idle')
  const [dauer, setDauer] = useState(0)
  const [audioUrl, setAudioUrl] = useState<string | null>(bestehendeAufnahme?.aufnahmeUrl ?? null)
  const [fehler, setFehler] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startZeitRef = useRef<number>(0)
  const streamRef = useRef<MediaStream | null>(null)

  // Cleanup bei Unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  const startRecording = useCallback(async () => {
    try {
      setFehler(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' })
      mediaRecorderRef.current = recorder
      chunksRef.current = []

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        // Blob als Base64 Data URL speichern
        const reader = new FileReader()
        reader.onload = () => {
          const dataUrl = reader.result as string
          setAudioUrl(dataUrl)
          setStatus('preview')
          // Antwort speichern
          setAntwort(frage.id, {
            typ: 'audio',
            aufnahmeUrl: dataUrl,
            dauer: Math.round((Date.now() - startZeitRef.current) / 1000),
          })
        }
        reader.readAsDataURL(blob)
        stream.getTracks().forEach(t => t.stop())
      }

      recorder.start(1000) // Chunks alle 1s
      startZeitRef.current = Date.now()
      setDauer(0)
      setStatus('recording')

      // Timer fuer Anzeige
      timerRef.current = setInterval(() => {
        const sek = Math.floor((Date.now() - startZeitRef.current) / 1000)
        setDauer(sek)

        // Auto-Stopp bei maxDauer
        if (frage.maxDauerSekunden && sek >= frage.maxDauerSekunden) {
          recorder.stop()
          if (timerRef.current) clearInterval(timerRef.current)
        }
      }, 250)
    } catch (err) {
      console.error('[AudioFrage] getUserMedia fehlgeschlagen:', err)
      setFehler('Mikrofon-Zugriff verweigert oder nicht verfuegbar.')
      setStatus('idle')
    }
  }, [frage.id, frage.maxDauerSekunden, setAntwort])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const handleNeuaufnahme = useCallback(() => {
    setAudioUrl(null)
    setStatus('idle')
    setDauer(0)
  }, [])

  const formatZeit = (sek: number): string => {
    const m = Math.floor(sek / 60)
    const s = sek % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header: Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${fachbereichFarbe(frage.fachbereich)}`}>
          {frage.fachbereich}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
          {frage.bloom}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {frage.punkte} {frage.punkte === 1 ? 'Punkt' : 'Punkte'}
        </span>
        {frage.maxDauerSekunden && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            Max. {formatZeit(frage.maxDauerSekunden)}
          </span>
        )}
      </div>

      {/* Fragetext */}
      <div
        className="text-base leading-relaxed text-slate-800 dark:text-slate-100 bg-slate-50 dark:bg-slate-800/80 p-4 rounded-lg border border-slate-200 dark:border-slate-700"
        dangerouslySetInnerHTML={{ __html: renderMarkdown(frage.fragetext) }}
      />

      {/* Audio-Aufnahme */}
      <div className={`p-4 rounded-xl border ${
        !abgegeben && !bestehendeAufnahme
          ? 'border-2 border-violet-400 dark:border-violet-500'
          : 'border-slate-200 dark:border-slate-700'
      } bg-white dark:bg-slate-800`}>

        {/* Fehler */}
        {fehler && (
          <div className="text-sm text-red-600 dark:text-red-400 mb-3">{fehler}</div>
        )}

        {/* Idle: Aufnahme-Button */}
        {status === 'idle' && !audioUrl && !abgegeben && (
          <button
            type="button"
            onClick={startRecording}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors cursor-pointer"
          >
            <span className="w-3 h-3 rounded-full bg-white" />
            Aufnahme starten
          </button>
        )}

        {/* Recording: Pulsierender Indikator + Stopp */}
        {status === 'recording' && (
          <div className="flex items-center gap-4">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-lg font-mono text-red-600 dark:text-red-400 tabular-nums">
              {formatZeit(dauer)}
              {frage.maxDauerSekunden && (
                <span className="text-sm text-slate-400 dark:text-slate-500 ml-2">
                  / {formatZeit(frage.maxDauerSekunden)}
                </span>
              )}
            </span>
            <button
              type="button"
              onClick={stopRecording}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors cursor-pointer dark:bg-slate-600 dark:hover:bg-slate-500"
            >
              Stopp
            </button>
          </div>
        )}

        {/* Preview / bestehende Aufnahme */}
        {(status === 'preview' || (status === 'idle' && audioUrl)) && audioUrl && (
          <div className="flex flex-col gap-3">
            <audio controls src={audioUrl} className="w-full" preload="metadata" />
            {!abgegeben && (
              <button
                type="button"
                onClick={handleNeuaufnahme}
                className="self-start text-sm text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 underline cursor-pointer"
              >
                Neu aufnehmen
              </button>
            )}
          </div>
        )}

        {/* Abgegeben ohne Aufnahme */}
        {abgegeben && !audioUrl && (
          <p className="text-sm text-slate-500 dark:text-slate-400 italic">
            Keine Aufnahme vorhanden.
          </p>
        )}
      </div>
    </div>
  )
}
