import { useState, useEffect, useRef, useCallback } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Trophy,
  RotateCcw,
  Star,
  Zap,
  Delete,
} from 'lucide-react'
import confetti from 'canvas-confetti'
import {
  getLevels,
  generateDivision,
  generateVocabQuestion,
} from './engine'
import DivisionLayout from './components/DivisionLayout'
import VocabulaireQuiz from './components/VocabulaireQuiz'

const PROBLEMS_PER_LEVEL = 5

// ─── Level selector ────────────────────────────────

function LevelSelector({ onSelect }) {
  const levels = getLevels()
  const icons = [Star, Zap, Trophy]
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-bold text-center mb-4">
        Choisis ton niveau
      </h3>
      {levels.map((level, idx) => {
        const Icon = icons[idx] || Star
        return (
          <button
            key={level.id}
            onClick={() => onSelect(level.id)}
            className="w-full p-4 rounded-2xl bg-surface hover:bg-surface-light transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold">{level.name}</p>
                <p className="text-sm text-slate-400">{level.description}</p>
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

// ─── Mode tabs ─────────────────────────────────────

function ModeTabs({ mode, onChange }) {
  return (
    <div className="flex gap-2 mb-4">
      {[
        { id: 'posee', label: 'Division posée' },
        { id: 'vocab', label: 'Vocabulaire' },
      ].map((m) => (
        <button
          key={m.id}
          onClick={() => onChange(m.id)}
          className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
            mode === m.id
              ? 'bg-primary text-white'
              : 'bg-surface-light text-slate-400 hover:text-white'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}

// ─── Digit selector (0-9) for the "posée" mode ────

function DigitSelector({ onSelect, disabled }) {
  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="grid grid-cols-5 gap-2">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => !disabled && onSelect(n)}
            disabled={disabled}
            className="py-3 rounded-xl bg-surface-light text-lg font-semibold active:bg-primary/30 transition-colors disabled:opacity-40"
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Main component ────────────────────────────────

export default function Euclide({ onBack }) {
  const [mode, setMode] = useState('posee') // 'posee' | 'vocab'
  const [levelId, setLevelId] = useState(null)
  const [problemIndex, setProblemIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)

  // posée state
  const [division, setDivision] = useState(null)
  const [revealedSteps, setRevealedSteps] = useState(0)
  const [solved, setSolved] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const feedbackTimeout = useRef(null)

  // vocab state
  const [vocabData, setVocabData] = useState(null)
  const [vocabFeedback, setVocabFeedback] = useState(null)
  const vocabTimeout = useRef(null)

  // cleanup
  useEffect(() => {
    return () => {
      clearTimeout(feedbackTimeout.current)
      clearTimeout(vocabTimeout.current)
    }
  }, [])

  // ── start problem ──

  const startProblem = useCallback(
    (lvl) => {
      const id = lvl || levelId
      if (mode === 'posee') {
        const div = generateDivision(id)
        setDivision(div)
        setRevealedSteps(0)
        setSolved(false)
        setFeedback(null)
      } else {
        setVocabData(generateVocabQuestion(id))
        setVocabFeedback(null)
      }
    },
    [levelId, mode],
  )

  function selectLevel(id) {
    setLevelId(id)
    setScore(0)
    setProblemIndex(0)
    setShowResult(false)
    // need to start with current mode
    if (mode === 'posee') {
      const div = generateDivision(id)
      setDivision(div)
      setRevealedSteps(0)
      setSolved(false)
      setFeedback(null)
    } else {
      setVocabData(generateVocabQuestion(id))
      setVocabFeedback(null)
    }
  }

  // ── handle mode switch (restart with same level) ──

  function handleModeChange(newMode) {
    setMode(newMode)
    if (levelId) {
      setScore(0)
      setProblemIndex(0)
      setShowResult(false)
      setSolved(false)
      setFeedback(null)
      setVocabFeedback(null)
      if (newMode === 'posee') {
        const div = generateDivision(levelId)
        setDivision(div)
        setRevealedSteps(0)
      } else {
        setVocabData(generateVocabQuestion(levelId))
      }
    }
  }

  // ── posée: student selects a digit ──

  function handleDigitSelect(digit) {
    if (solved || !division) return
    clearTimeout(feedbackTimeout.current)

    const step = division.steps[revealedSteps]
    if (digit === step.quotientDigit) {
      // correct!
      const nextRevealed = revealedSteps + 1
      setRevealedSteps(nextRevealed)

      if (nextRevealed === division.steps.length) {
        // division complete
        setSolved(true)
        setScore((s) => s + 1)
        setFeedback({ type: 'success', message: 'Bravo ! Division terminée !' })
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#8b5cf6', '#d946ef', '#10b981', '#f59e0b'],
        })
      } else {
        setFeedback({ type: 'info', message: 'Correct ! Étape suivante.' })
        feedbackTimeout.current = setTimeout(() => setFeedback(null), 1500)
      }
    } else {
      setFeedback({
        type: 'error',
        message: `${digit} n'est pas correct. Essaie encore !`,
      })
      feedbackTimeout.current = setTimeout(() => setFeedback(null), 2000)
    }
  }

  // ── vocab: student picks an answer ──

  function handleVocabAnswer(selected) {
    if (vocabFeedback) return
    clearTimeout(vocabTimeout.current)

    const correct = selected === vocabData.answer
    setVocabFeedback({ selected, correct })

    if (correct) {
      setScore((s) => s + 1)
    }

    vocabTimeout.current = setTimeout(() => {
      const nextIndex = problemIndex + 1
      if (nextIndex >= PROBLEMS_PER_LEVEL) {
        setShowResult(true)
      } else {
        setProblemIndex(nextIndex)
        setVocabData(generateVocabQuestion(levelId))
        setVocabFeedback(null)
      }
    }, 1500)
  }

  // ── next problem (posée) ──

  function handleNext() {
    const nextIndex = problemIndex + 1
    if (nextIndex >= PROBLEMS_PER_LEVEL) {
      setShowResult(true)
    } else {
      setProblemIndex(nextIndex)
      startProblem(levelId)
    }
  }

  // ── confetti on perfect ──

  const perfect = showResult && score === PROBLEMS_PER_LEVEL
  useEffect(() => {
    if (perfect) {
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#8b5cf6', '#d946ef', '#10b981', '#f59e0b', '#ec4899'],
      })
    }
  }, [perfect])

  // ═══════════════════ RENDER ═══════════════════

  // Result screen
  if (showResult) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-surface rounded-2xl p-8 max-w-sm w-full text-center">
          <Trophy
            className={`w-16 h-16 mx-auto mb-4 ${perfect ? 'text-accent' : 'text-primary-light'}`}
          />
          <h2 className="text-2xl font-bold mb-2">
            {perfect ? 'Parfait !' : 'Bien joué !'}
          </h2>
          <p className="text-4xl font-bold mb-1">
            {score}/{PROBLEMS_PER_LEVEL}
          </p>
          <p className="text-slate-400 mb-6">
            {mode === 'posee' ? 'divisions résolues' : 'bonnes réponses'}
          </p>

          <div className="space-y-3">
            <button
              onClick={() => selectLevel(levelId)}
              className="w-full py-3 rounded-xl font-bold bg-primary hover:bg-primary-dark transition-colors"
            >
              <RotateCcw className="w-4 h-4 inline mr-2" />
              Rejouer ce niveau
            </button>
            <button
              onClick={() => setLevelId(null)}
              className="w-full py-3 rounded-xl font-bold bg-surface-light hover:bg-surface-light/80 transition-colors"
            >
              Changer de niveau
            </button>
            <button
              onClick={onBack}
              className="w-full py-3 rounded-xl font-bold text-slate-400 hover:text-white transition-colors"
            >
              Retour au menu
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Level selection
  if (!levelId) {
    return (
      <div className="min-h-screen p-4">
        <header className="flex items-center gap-3 mb-6 pt-2">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-surface hover:bg-surface-light transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold">Euclide</h2>
        </header>
        <ModeTabs mode={mode} onChange={setMode} />
        <LevelSelector onSelect={selectLevel} />
      </div>
    )
  }

  // ─── Main game UI ──────────────────────────

  const currentStep =
    mode === 'posee' && division && revealedSteps < division.steps.length
      ? division.steps[revealedSteps]
      : null

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-2 pt-2">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-surface hover:bg-surface-light transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-bold">Euclide</h2>
            <p className="text-xs text-slate-400">
              {getLevels().find((l) => l.id === levelId)?.description}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">
            {problemIndex + 1}/{PROBLEMS_PER_LEVEL}
          </p>
          <p className="text-lg font-bold text-accent">
            {score} <Star className="w-4 h-4 inline text-accent" />
          </p>
        </div>
      </header>

      {/* Mode tabs */}
      <ModeTabs mode={mode} onChange={handleModeChange} />

      {/* Progress bar */}
      <div className="h-1.5 bg-surface rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-600 rounded-full transition-all duration-500"
          style={{
            width: `${((problemIndex + (solved || vocabFeedback?.correct ? 1 : 0)) / PROBLEMS_PER_LEVEL) * 100}%`,
          }}
        />
      </div>

      {/* ─── POSÉE MODE ─── */}
      {mode === 'posee' && division && (
        <>
          <DivisionLayout
            dividend={division.dividend}
            divisor={division.divisor}
            steps={division.steps}
            revealedSteps={revealedSteps}
          />

          {/* Question prompt */}
          {currentStep && (
            <p className="text-center text-sm text-slate-400 mb-3">
              Combien de fois{' '}
              <span className="text-accent font-bold">{division.divisor}</span>{' '}
              dans{' '}
              <span className="text-white font-bold">
                {currentStep.partial}
              </span>{' '}
              ?
            </p>
          )}

          {/* Feedback */}
          <div className="h-10 flex items-center justify-center mb-2">
            {feedback && (
              <p
                className={`text-sm font-semibold px-4 py-1.5 rounded-full ${
                  feedback.type === 'error'
                    ? 'bg-red-900/30 text-danger'
                    : feedback.type === 'success'
                      ? 'bg-emerald-900/30 text-success'
                      : 'bg-violet-900/30 text-violet-300'
                }`}
              >
                {feedback.message}
              </p>
            )}
          </div>

          <div className="flex-1" />

          {/* "Suivant" when solved */}
          {solved && (
            <button
              onClick={handleNext}
              className="mx-auto mb-4 px-8 py-3 rounded-xl font-bold text-lg bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-600 hover:to-fuchsia-700 active:scale-[0.97] transition-all text-white flex items-center gap-2"
            >
              Suivant
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {/* Digit selector */}
          {!solved && (
            <DigitSelector onSelect={handleDigitSelect} disabled={false} />
          )}
        </>
      )}

      {/* ─── VOCAB MODE ─── */}
      {mode === 'vocab' && vocabData && (
        <>
          <VocabulaireQuiz
            data={vocabData}
            onAnswer={handleVocabAnswer}
            feedback={vocabFeedback}
            disabled={!!vocabFeedback}
          />
          <div className="flex-1" />
        </>
      )}

      <div className="h-4" />
    </div>
  )
}
