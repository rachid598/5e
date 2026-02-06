import { useState } from 'react'
import usePlayer from './hooks/usePlayer'
import PlayerForm from './components/PlayerForm'
import Hub from './pages/Hub'
import FracStrike from './modules/frac-strike/FracStrike'
import FractionsIdeas from './pages/FractionsIdeas'

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

  if (currentModule === 'fractions-ideas') {
    return <FractionsIdeas onBack={() => setCurrentModule(null)} />
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
