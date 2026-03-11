import { buildDisplayRows } from '../engine'

export default function DivisionLayout({
  dividend,
  divisor,
  steps,
  revealedSteps,
}) {
  const rows = buildDisplayRows(dividend, divisor, steps, revealedSteps)

  // Build quotient string: revealed digits + dots for pending
  const revealedQ = steps
    .slice(0, revealedSteps)
    .map((s) => s.quotientDigit)
    .join('')
  const pendingDots = steps.length - revealedSteps
  const quotientDisplay = revealedQ + '·'.repeat(pendingDots)

  return (
    <div className="flex justify-center my-4">
      {/* Left: work area */}
      <div className="font-mono text-2xl leading-loose tracking-widest">
        {rows.map((row, i) => (
          <div
            key={i}
            className={`whitespace-pre ${
              row.type === 'subtraction'
                ? 'text-red-400'
                : row.type === 'line'
                  ? 'text-slate-600'
                  : row.type === 'remainder' && revealedSteps === steps.length
                    ? 'text-success font-bold'
                    : row.type === 'partial'
                      ? 'text-slate-300'
                      : 'text-white'
            }`}
          >
            {row.text}
          </div>
        ))}
      </div>

      {/* Right: divisor + quotient */}
      <div className="font-mono text-2xl leading-loose tracking-widest border-l-2 border-slate-500 ml-1">
        <div className="px-3 text-accent font-bold">{divisor}</div>
        <div className="px-3 border-t-2 border-slate-500 text-success font-bold min-w-[3ch]">
          {quotientDisplay || '·'}
        </div>
      </div>
    </div>
  )
}
