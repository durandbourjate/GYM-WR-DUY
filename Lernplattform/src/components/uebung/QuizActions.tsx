interface Props {
  istUnsicher: boolean
  feedbackSichtbar: boolean
  onToggleUnsicher: () => void
  onBeenden: () => void
}

export default function QuizActions({ istUnsicher, onToggleUnsicher, onBeenden }: Props) {
  return (
    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
      <button
        onClick={onBeenden}
        className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 min-h-[44px] px-2"
      >
        Uebung beenden
      </button>

      <button
        onClick={onToggleUnsicher}
        className={`text-sm min-h-[44px] px-3 py-1.5 rounded-lg transition-colors ${
          istUnsicher
            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
            : 'text-gray-400 hover:text-amber-600 dark:hover:text-amber-400'
        }`}
      >
        {istUnsicher ? '\uD83D\uDD16 Markiert' : '\uD83D\uDD16 Nochmal ueben'}
      </button>
    </div>
  )
}
