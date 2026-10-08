/**
 * Renders an expression with tappable operators.
 * Numbers and parentheses are static, operators are buttons.
 */
export default function ExpressionDisplay({
  tokens,
  selectedOpId,
  onSelectOp,
  disabled,
}) {
  return (
    <div className="flex items-center justify-start sm:justify-center gap-0.5 sm:gap-1 flex-nowrap overflow-x-auto px-3 font-mono text-xl min-[400px]:text-2xl">
      {tokens.map((token, i) => {
        if (token.type === 'number') {
          return (
            <span key={i} className="px-0.5 sm:px-1 tabular-nums shrink-0">
              {token.value}
            </span>
          )
        }
        if (token.type === 'paren') {
          return (
            <span key={i} className="text-accent font-bold shrink-0">
              {token.value}
            </span>
          )
        }
        if (token.type === 'operator') {
          const isSelected = selectedOpId === token.id
          return (
            <button
              key={token.id}
              type="button"
              onClick={() => !disabled && onSelectOp(token.id)}
              disabled={disabled}
              className={`min-w-[40px] min-h-[44px] shrink-0 flex items-center justify-center rounded-lg transition-all ${
                isSelected
                  ? 'bg-primary text-white scale-110'
                  : 'text-slate-300 hover:bg-surface-light active:bg-primary/30'
              } disabled:opacity-50`}
            >
              {token.value}
            </button>
          )
        }
        return null
      })}
    </div>
  )
}
