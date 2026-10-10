import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

const CHECK_EVERY_MS = 5 * 60 * 1000

/**
 * Compare la version chargée avec /version.json (publié à chaque build).
 * Quand une nouvelle version est en ligne, propose un bouton pour recharger.
 */
export default function UpdateBanner() {
  const [updateAvailable, setUpdateAvailable] = useState(false)

  useEffect(() => {
    if (!import.meta.env.PROD) return

    let cancelled = false

    async function check() {
      try {
        const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' })
        if (!res.ok) return
        const data = await res.json()
        if (!cancelled && data.version && data.version !== __BUILD_ID__) {
          setUpdateAvailable(true)
        }
      } catch {
        // hors ligne ou réponse invalide : on réessaiera plus tard
      }
    }

    function onVisible() {
      if (document.visibilityState === 'visible') check()
    }

    check()
    const timer = setInterval(check, CHECK_EVERY_MS)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelled = true
      clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [])

  async function update() {
    try {
      if ('caches' in window) {
        const keys = await caches.keys()
        await Promise.all(keys.map((k) => caches.delete(k)))
      }
    } catch {
      // pas de cache à vider
    }
    window.location.reload()
  }

  if (!updateAvailable) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto max-w-sm flex items-center gap-3 rounded-2xl bg-primary px-4 py-3 shadow-xl">
        <p className="flex-1 text-sm font-semibold text-white">
          Une nouvelle version est disponible
        </p>
        <button
          type="button"
          onClick={update}
          className="shrink-0 min-h-11 flex items-center gap-2 rounded-xl bg-white px-4 text-sm font-bold text-primary-dark active:scale-95 transition-transform"
        >
          <RefreshCw className="w-4 h-4" />
          Mettre à jour
        </button>
      </div>
    </div>
  )
}
