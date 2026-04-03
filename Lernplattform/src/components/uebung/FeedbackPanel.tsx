interface Props {
  korrekt: boolean
  erklaerung?: string
}

export default function FeedbackPanel({ korrekt, erklaerung }: Props) {
  return (
    <div className={`rounded-xl p-4 border-l-4 ${
      korrekt
        ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
        : 'bg-red-50 dark:bg-red-900/20 border-red-500'
    }`}>
      <div className="font-medium mb-1">
        {korrekt ? (
          <span className="text-green-700 dark:text-green-300">&#10003; Richtig!</span>
        ) : (
          <span className="text-red-700 dark:text-red-300">&#10007; Leider falsch</span>
        )}
      </div>
      {erklaerung && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {erklaerung}
        </p>
      )}
    </div>
  )
}
