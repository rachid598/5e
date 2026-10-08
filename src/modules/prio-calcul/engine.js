/**
 * Prio-Calcul engine
 * Generates arithmetic expressions (no parentheses for now) and manages
 * priority-based simplification: × and : before + and −, then left to right.
 */

let opCounter = 0
function nextOpId() {
  return 'op' + (++opCounter)
}

function tok(type, value, id) {
  const t = { type, value }
  if (id) t.id = id
  return t
}
function num(v) { return tok('number', v) }
function op(v) { return tok('operator', v, nextOpId()) }

// --- Levels ---
const LEVELS = [
  {
    id: 1,
    name: 'Facile',
    description: 'De gauche à droite (+ − ou × :)',
  },
  {
    id: 2,
    name: 'Moyen',
    description: 'Une multiplication ou une division',
  },
  {
    id: 3,
    name: 'Difficile',
    description: 'Plusieurs priorités dans le même calcul',
  },
]

export function getLevels() {
  return LEVELS
}

// --- Helpers ---
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function compute(a, operator, b) {
  switch (operator) {
    case '+': return a + b
    case '-': return a - b
    case '×': return a * b
    case ':': return b === 0 ? null : a / b
    default: return 0
  }
}

function getOpPriority(v) {
  return v === '×' || v === ':' ? 2 : 1
}

// --- Priority detection ---

/**
 * Operators the student may pick right now: deepest parentheses first, then
 * × and : before + and −, and among equal priorities the leftmost one only.
 */
export function findSelectableOps(tokens) {
  let depth = 0
  const ops = []
  tokens.forEach((t, index) => {
    if (t.type === 'paren') {
      depth += t.value === '(' ? 1 : -1
    } else if (t.type === 'operator') {
      ops.push({ index, depth, priority: getOpPriority(t.value), id: t.id })
    }
  })
  if (ops.length === 0) return []

  const maxDepth = Math.max(...ops.map((o) => o.depth))
  const atDepth = ops.filter((o) => o.depth === maxDepth)
  const best = Math.max(...atDepth.map((o) => o.priority))

  return atDepth
    .filter((o) => o.priority === best)
    .filter((o) => {
      for (let j = o.index - 1; j >= 0; j--) {
        if (tokens[j].type === 'paren') return true
        if (tokens[j].type === 'operator') {
          return getOpPriority(tokens[j].value) !== o.priority
        }
      }
      return true
    })
    .map((o) => o.id)
}

/** Message shown when the student taps an operator that is not the right one. */
export function getWrongOpMessage(tokens, opId) {
  const chosen = tokens.find((t) => t.id === opId)
  const expected = tokens.find((t) => t.id === findSelectableOps(tokens)[0])
  if (
    chosen &&
    expected &&
    getOpPriority(chosen.value) === getOpPriority(expected.value)
  ) {
    return 'On calcule de gauche à droite !'
  }
  return "Ce n'est pas la priorité !"
}

// --- Compute a step ---

export function computeStep(tokens, opId) {
  const idx = tokens.findIndex((t) => t.id === opId)
  if (idx < 0) return null

  let leftIdx = idx - 1
  while (leftIdx >= 0 && tokens[leftIdx].type !== 'number') leftIdx--
  let rightIdx = idx + 1
  while (rightIdx < tokens.length && tokens[rightIdx].type !== 'number') rightIdx++

  if (leftIdx < 0 || rightIdx >= tokens.length) return null

  return compute(tokens[leftIdx].value, tokens[idx].value, tokens[rightIdx].value)
}

// --- Rebuild tokens after a step ---

export function rebuildTokens(tokens, opId, result) {
  const idx = tokens.findIndex((t) => t.id === opId)
  if (idx < 0) return tokens

  let leftIdx = idx - 1
  while (leftIdx >= 0 && tokens[leftIdx].type !== 'number') leftIdx--
  let rightIdx = idx + 1
  while (rightIdx < tokens.length && tokens[rightIdx].type !== 'number') rightIdx++

  if (leftIdx < 0 || rightIdx >= tokens.length) return tokens

  const newTokens = [
    ...tokens.slice(0, leftIdx),
    num(result),
    ...tokens.slice(rightIdx + 1),
  ]

  return stripEmptyParens(newTokens)
}

function stripEmptyParens(tokens) {
  let changed = true
  let result = tokens
  while (changed) {
    changed = false
    for (let i = 0; i < result.length - 2; i++) {
      if (
        result[i].type === 'paren' && result[i].value === '(' &&
        result[i + 1].type === 'number' &&
        result[i + 2].type === 'paren' && result[i + 2].value === ')'
      ) {
        result = [...result.slice(0, i), result[i + 1], ...result.slice(i + 3)]
        changed = true
        break
      }
    }
  }
  return result
}

// --- Completion check ---

export function isComplete(tokens) {
  const numbers = tokens.filter((t) => t.type === 'number')
  const ops = tokens.filter((t) => t.type === 'operator')
  return numbers.length === 1 && ops.length === 0
}

// --- Expression generation ---

/**
 * Solve the expression with the same rules as the student.
 * Returns the final value, or null if a step is not a positive integer
 * (inexact division, negative or zero result, or a number that is too big).
 */
function simulate(tokens) {
  let cur = tokens
  while (!isComplete(cur)) {
    const ids = findSelectableOps(cur)
    if (ids.length === 0) return null
    const value = computeStep(cur, ids[0])
    if (value === null || !Number.isInteger(value) || value <= 0 || value > 200) {
      return null
    }
    cur = rebuildTokens(cur, ids[0], value)
  }
  return cur[0].value
}

// Chain of terms joined by + or −. A term is a number "N" or a product/quotient "P".
function buildFromTerms(shape, maxAdditive, divisionChance) {
  const tokens = []
  shape.forEach((kind, i) => {
    if (i > 0) tokens.push(op(pick(['+', '-'])))
    if (kind === 'N') {
      tokens.push(num(randInt(2, maxAdditive)))
    } else if (Math.random() < divisionChance) {
      const divisor = randInt(2, 9)
      tokens.push(num(divisor * randInt(2, 9)), op(':'), num(divisor))
    } else {
      tokens.push(num(randInt(2, 9)), op('×'), num(randInt(2, 9)))
    }
  })
  return tokens
}

// Level 1: 4 numbers, only + − or only × : (left to right)
function buildLeftToRight() {
  if (Math.random() < 0.5) {
    const tokens = [num(randInt(2, 30))]
    const operators = Array.from({ length: 3 }, () => pick(['+', '-']))
    if (!operators.includes('-')) operators[randInt(0, 2)] = '-'
    operators.forEach((o) => tokens.push(op(o), num(randInt(2, 30))))
    return tokens
  }
  const operators = Array.from({ length: 3 }, () => pick(['×', ':']))
  if (!operators.includes(':')) operators[randInt(0, 2)] = ':'
  const tokens = [num(randInt(2, 60))]
  operators.forEach((o) => tokens.push(op(o), num(randInt(2, 9))))
  return tokens
}

const SHAPES = {
  2: [['N', 'P'], ['P', 'N']],
  3: [['N', 'P', 'N'], ['P', 'P'], ['P', 'N', 'P'], ['N', 'P', 'P'], ['P', 'N', 'N'], ['N', 'N', 'P']],
}

function buildExpression(levelId) {
  if (levelId === 1) return buildLeftToRight()
  if (levelId === 2) return buildFromTerms(pick(SHAPES[2]), 20, 0.4)
  return buildFromTerms(pick(SHAPES[3]), 30, 0.4)
}

const FALLBACKS = {
  1: () => [num(8), op('-'), num(3), op('+'), num(16), op('+'), num(4)],
  2: () => [num(5), op('+'), num(3), op('×'), num(5)],
  3: () => [num(9), op('+'), num(7), op('×'), num(4), op('+'), num(6)],
}

const recent = []

export function generateExpression(levelId) {
  const level = LEVELS.some((l) => l.id === levelId) ? levelId : 1

  for (let attempt = 0; attempt < 500; attempt++) {
    const tokens = buildExpression(level)
    const answer = simulate(tokens)
    if (answer === null || (level === 1 && answer > 100)) continue

    const key = tokensToString(tokens)
    if (recent.includes(key)) continue
    recent.push(key)
    if (recent.length > 15) recent.shift()

    return { tokens, answer }
  }

  const tokens = FALLBACKS[level]()
  return { tokens, answer: simulate(tokens) }
}

// --- Render tokens to string (for display) ---

export function tokensToString(tokens) {
  return tokens.map((t) => t.value).join(' ')
}
