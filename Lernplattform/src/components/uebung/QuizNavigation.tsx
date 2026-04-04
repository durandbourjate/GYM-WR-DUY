interface Props {
  kannZurueck: boolean
  istBeantwortet: boolean
  feedbackSichtbar: boolean
  istLetzteFrage: boolean
  istSessionFertig: boolean
  onZurueck: () => void
  onUeberspringen: () => void
  onWeiter: () => void
  onErgebnis: () => void
}

export default function QuizNavigation({
  kannZurueck, istBeantwortet, feedbackSichtbar, istLetzteFrage: _istLetzteFrage, istSessionFertig,
  onZurueck, onUeberspringen, onWeiter, onErgebnis,
}: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Zurück */}
      {kannZurueck && (
        <button
          onClick={onZurueck}
          className="px-4 py-2.5 rounded-xl text-sm font-medium min-h-[44px] bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          &#8592; Zurück
        </button>
      )}

      {/* Überspringen (nur wenn noch nicht beantwortet) */}
      {!istBeantwortet && !feedbackSichtbar && (
        <button
          onClick={onUeberspringen}
          className="px-4 py-2.5 rounded-xl text-sm font-medium min-h-[44px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          Überspringen &#8594;
        </button>
      )}

      {/* Weiter / Ergebnis (nach Feedback) */}
      {feedbackSichtbar && (
        <button
          onClick={istSessionFertig ? onErgebnis : onWeiter}
          className="ml-auto px-6 py-2.5 rounded-xl text-sm font-medium min-h-[44px] bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 hover:bg-gray-700 dark:hover:bg-gray-300"
        >
          {istSessionFertig ? 'Ergebnis anzeigen' : 'Weiter \u2192'}
        </button>
      )}
    </div>
  )
}
