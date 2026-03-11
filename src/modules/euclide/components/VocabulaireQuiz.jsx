const TERM_COLORS = {
  dividende: 'bg-indigo-900/40 text-indigo-300 border-indigo-500',
  diviseur: 'bg-amber-900/40 text-amber-300 border-amber-500',
  quotient: 'bg-emerald-900/40 text-emerald-300 border-emerald-500',
  reste: 'bg-pink-900/40 text-pink-300 border-pink-500',
}

function TermBadge({ label, value, highlight }) {
  const colors = TERM_COLORS[label] || ''
  return (
    <div className={`flex flex-col items-center gap-1 ${highlight ? 'scale-110' : ''}`}>
      <span className="text-2xl font-bold font-mono">{value}</span>
      <span
        className={`text-xs px-2 py-0.5 rounded-full border ${colors} transition-transform`}
      >
        {label}
      </span>
    </div>
  )
}

export default function VocabulaireQuiz({
  data,
  onAnswer,
  feedback,
  disabled,
}) {
  if (!data) return null

  const { dividend, divisor, quotient, remainder, question, termKey, choices } =
    data

  return (
    <div className="space-y-6">
      {/* Equation display with labels */}
      <div className="bg-surface rounded-2xl p-5">
        <p className="text-xs text-slate-500 text-center mb-4">
          Division euclidienne
        </p>

        {/* a = b × q + r */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <TermBadge
            label="dividende"
            value={dividend}
            highlight={termKey === 'dividende'}
          />
          <span className="text-xl text-slate-500">=</span>
          <TermBadge
            label="diviseur"
            value={divisor}
            highlight={termKey === 'diviseur'}
          />
          <span className="text-xl text-slate-500">×</span>
          <TermBadge
            label="quotient"
            value={quotient}
            highlight={termKey === 'quotient'}
          />
          <span className="text-xl text-slate-500">+</span>
          <TermBadge
            label="reste"
            value={remainder}
            highlight={termKey === 'reste'}
          />
        </div>

        <p className="text-xs text-slate-500 text-center mt-3">
          {dividend} ÷ {divisor} = {quotient} reste {remainder}
        </p>
      </div>

      {/* Question */}
      <p className="text-center text-lg font-bold">{question}</p>

      {/* 4 choices */}
      <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
        {choices.map((c, i) => {
          let btnClass =
            'py-3 px-4 rounded-xl text-lg font-bold transition-colors text-center '
          if (feedback) {
            if (c === data.answer) {
              btnClass += 'bg-emerald-600 text-white'
            } else if (feedback.selected === c) {
              btnClass += 'bg-red-600 text-white'
            } else {
              btnClass += 'bg-surface-light text-slate-500'
            }
          } else {
            btnClass +=
              'bg-surface-light hover:bg-primary/30 active:scale-95 text-white'
          }

          return (
            <button
              key={i}
              onClick={() => !disabled && onAnswer(c)}
              disabled={disabled}
              className={btnClass}
            >
              {c}
            </button>
          )
        })}
      </div>
    </div>
  )
}
