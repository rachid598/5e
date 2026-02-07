import { useState } from 'react'
import usePlayer from './hooks/usePlayer'
import PlayerForm from './components/PlayerForm'
import Hub from './pages/Hub'
import FracStrike from './modules/frac-strike/FracStrike'
import PrioCalcul from './modules/prio-calcul/PrioCalcul'

export default function App() {
  const { player, savePlayer, clearPlayer } = usePlayer()
  const [currentModule, setCurrentModule] = useState(null)

  // Not logged in — show player form
  if (!player) {
    return <PlayerForm onSave={savePlayer} />
  }

  // Inside a module
  if (currentModule === 'frac-strike') {
    return <FracStrike onBack={() => setCurrentModule(null)} />
  }

  if (currentModule === 'prio-calcul') {
    return <PrioCalcul onBack={() => setCurrentModule(null)} />
  }

  // Hub
  return (
    <Hub
      player={player}
      onNavigate={setCurrentModule}
      onLogout={clearPlayer}
    />
  )
}
