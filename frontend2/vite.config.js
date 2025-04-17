// Importing defineConfig helper from Vite to get better type hints and autocompletion
import { defineConfig } from 'vite'
// Importing the React plugin to enable support for React features like JSX
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Exporting the Vite configuration
export default defineConfig({
  // Registering plugins used by Vite
  plugins: [
    react()// Enables React fast refresh, JSX transformation, etc.
  ],
})
