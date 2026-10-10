import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Identifiant unique de chaque build, utilisé pour détecter une nouvelle version en ligne
const BUILD_ID = String(Date.now())

function versionFile() {
  return {
    name: 'version-file',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'version.json',
        source: JSON.stringify({ version: BUILD_ID }),
      })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    versionFile(),
  ],
  define: {
    __BUILD_ID__: JSON.stringify(BUILD_ID),
  },
})
