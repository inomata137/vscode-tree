import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const vscodeCodiconCssPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html: string) {
      return html.replace(
        '<link rel="stylesheet"',
        '<link rel="stylesheet" id="vscode-codicon-stylesheet"'
      )
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), vscodeCodiconCssPlugin()],

  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
})
