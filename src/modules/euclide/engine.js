/**
 * Euclide – Division euclidienne engine
 * Generates long-division problems and vocabulary quizzes for 6e level.
 */

// ---------- helpers ----------

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ---------- levels ----------

const LEVELS = [
  { id: 1, name: 'Facile', description: 'Dividende à 2 chiffres' },
  { id: 2, name: 'Moyen', description: 'Dividende à 3 chiffres' },
  { id: 3, name: 'Difficile', description: 'Dividende à 4 chiffres' },
]

export function getLevels() {
  return LEVELS
}

// ---------- compute steps for the "posée" layout ----------

export function computeSteps(dividend, divisor) {
  const digits = String(dividend).split('').map(Number)
  const steps = []
  let partial = 0
  let started = false

  for (let i = 0; i < digits.length; i++) {
    partial = partial * 10 + digits[i]

    if (!started && partial < divisor && i < digits.length - 1) {
      continue
    }

    started = true
    const q = Math.floor(partial / divisor)
    const product = q * divisor
    const remainder = partial - product

    steps.push({
      partial,
      quotientDigit: q,
      product,
      remainder,
      digitIndex: i,
    })

    partial = remainder
  }

  return steps
}

// ---------- generate a division problem ----------

export function generateDivision(levelId) {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const divisor = randInt(2, 9)
    let minDiv, maxDiv

    if (levelId === 1) {
      minDiv = 10
      maxDiv = 99
    } else if (levelId === 2) {
      minDiv = 100
      maxDiv = 999
    } else {
      minDiv = 1000
      maxDiv = 9999
    }

    const dividend = randInt(minDiv, maxDiv)
    const quotient = Math.floor(dividend / divisor)
    const remainder = dividend % divisor

    if (quotient === 0) continue

    const steps = computeSteps(dividend, divisor)
    if (steps.length === 0) continue

    return { dividend, divisor, quotient, remainder, steps }
  }
}

// ---------- display rows for the posée layout ----------

export function buildDisplayRows(dividend, divisor, steps, revealedCount) {
  const divStr = String(dividend)
  const W = divStr.length + 1 // +1 for minus-sign column
  const rows = []

  // Row 0: dividend
  rows.push({ text: ' ' + divStr, type: 'dividend' })

  for (let s = 0; s < revealedCount && s < steps.length; s++) {
    const step = steps[s]
    const endDC = step.digitIndex + 1 // display column (0 = minus col)
    const productStr = String(step.product)
    const minusProd = '−' + productStr

    // product row
    rows.push({
      text: minusProd.padStart(endDC + 1).padEnd(W),
      type: 'subtraction',
    })

    // line row
    const lineLen = Math.max(minusProd.length, String(step.partial).length + 1)
    rows.push({
      text: '─'.repeat(lineLen).padStart(endDC + 1).padEnd(W),
      type: 'line',
    })

    // next partial or final remainder
    if (s < steps.length - 1) {
      // build display partial: previous remainder + brought-down digit
      const displayPartial = String(step.remainder) + divStr[steps[s + 1].digitIndex]
      const nextEndDC = steps[s + 1].digitIndex + 1
      rows.push({
        text: displayPartial.padStart(nextEndDC + 1).padEnd(W),
        type: 'partial',
      })
    } else {
      // final remainder
      rows.push({
        text: String(step.remainder).padStart(endDC + 1).padEnd(W),
        type: 'remainder',
      })
    }
  }

  return rows
}

// ---------- vocabulary quiz ----------

const VOCAB_TERMS = [
  { key: 'dividende', label: 'le dividende', getter: (d) => d.dividend },
  { key: 'diviseur', label: 'le diviseur', getter: (d) => d.divisor },
  { key: 'quotient', label: 'le quotient', getter: (d) => d.quotient },
  { key: 'reste', label: 'le reste', getter: (d) => d.remainder },
]

export function generateVocabQuestion(levelId) {
  const div = generateDivision(levelId)
  const termIdx = randInt(0, VOCAB_TERMS.length - 1)
  const term = VOCAB_TERMS[termIdx]
  const answer = term.getter(div)

  // collect distinct distractors
  const pool = new Set()
  for (const t of VOCAB_TERMS) {
    const v = t.getter(div)
    if (v !== answer) pool.add(v)
  }
  // pad with random numbers if needed
  while (pool.size < 3) {
    const r = Math.abs(answer + randInt(1, 10) * (Math.random() < 0.5 ? 1 : -1))
    if (r !== answer) pool.add(r)
  }

  const distractors = [...pool].slice(0, 3)
  const choices = shuffle([answer, ...distractors])

  return {
    ...div,
    question: `Quel est ${term.label} ?`,
    termKey: term.key,
    answer,
    choices,
  }
}
