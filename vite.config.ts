import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { codeInspectorPlugin } from 'code-inspector-plugin'
// import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    codeInspectorPlugin({
      bundler: 'vite',
    }),
    // visualizer({
    //   open: true,
    //   filename: "stats.html",
    // }),
  ],
})
