/**
 * Frac-Strike game engine
 * Generates fraction simplification challenges at 3 difficulty levels (REP pedagogy).
 */

// GCD via Euclidean algorithm
export function gcd(a, b) {
  a = Math.abs(a)
  b = Math.abs(b)
  while (b) {
    ;[a, b] = [b, a % b]
  }
  return a
}

// Level definitions (REP pedagogy: progressive difficulty)
const LEVELS = [
  {
    id: 1,
    name: 'Niveau 1',
    description: 'Tables de 2, 5 et 10',
    factors: [2, 5, 10],
    maxMultiplier: 6,
  },
  {
    id: 2,
    name: 'Niveau 2',
    description: 'Tables de 3 à 9',
    factors: [3, 4, 6, 7, 8, 9],
    maxMultiplier: 8,
  },
  {
    id: 3,
    name: 'Niveau 3',
    description: 'Multiples complexes',
    factors: [12, 15, 25, 50],
    maxMultiplier: 6,
  },
]

export function getLevels() {
  return LEVELS
}

/**
 * Generate a fraction that can be simplified.
 * Returns { numerator, denominator, simplifiedNum, simplifiedDen, commonFactor }
 */
export function generateFraction(levelId) {
  const level = LEVELS.find((l) => l.id === levelId) || LEVELS[0]
  const { factors, maxMultiplier } = level

  // Pick a random common factor from the level's factor pool
  const factor = factors[Math.floor(Math.random() * factors.length)]

  // Generate a simplified fraction where num < den (proper fraction) and gcd=1
  let simplifiedNum, simplifiedDen
  let attempts = 0
  do {
    simplifiedNum = Math.floor(Math.random() * (maxMultiplier - 1)) + 1
    simplifiedDen = Math.floor(Math.random() * (maxMultiplier - 1)) + 2
    attempts++
  } while (
    (simplifiedNum >= simplifiedDen ||
      gcd(simplifiedNum, simplifiedDen) !== 1) &&
    attempts < 100
  )

  // Fallback to a safe pair
  if (attempts >= 100) {
    simplifiedNum = 1
    simplifiedDen = 3
  }

  return {
    numerator: simplifiedNum * factor,
    denominator: simplifiedDen * factor,
    simplifiedNum,
    simplifiedDen,
    commonFactor: factor,
  }
}

/**
 * Factorize a number into display factors for the chain.
 * E.g., 12 with commonFactor 6 => { base: 2, factor: 6 }
 */
export function factorize(value, divisor) {
  if (value % divisor !== 0) return null
  return { base: value / divisor, factor: divisor }
}

/**
 * Check if a divisor is valid for both numerator and denominator.
 */
export function isValidDivisor(numerator, denominator, divisor) {
  return (
    divisor > 1 &&
    Number.isInteger(divisor) &&
    numerator % divisor === 0 &&
    denominator % divisor === 0
  )
}

/**
 * Apply a simplification step.
 * Returns the new numerator and denominator.
 */
export function simplify(numerator, denominator, divisor) {
  return {
    numerator: numerator / divisor,
    denominator: denominator / divisor,
  }
}

/**
 * Check if a fraction is fully simplified.
 */
export function isFullySimplified(numerator, denominator) {
  return gcd(numerator, denominator) === 1
}
