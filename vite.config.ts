import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Base path for GitHub Pages deployment
  // For GitHub Pages: repository name is part of the URL
  // Example: if your repo is 'my-app', the URL will be https://username.github.io/my-app/
  // Prefer BASE_PATH if set; otherwise use GITHUB_REPOSITORY when building in CI.
  const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1]
  const basePath =
    process.env.BASE_PATH ||
    (mode === 'production' && repoName ? `/${repoName}/` : '/')
  
  // OpenRouter key for the /llm proxy — read server-side, never shipped to the browser.
  const orKeyFile = process.env.OPENROUTER_KEY_FILE || 'C:/Users/Sina/Desktop/AIARTFACTORY-SECRETS/openrouter_key.txt'
  let orKey = process.env.OPENROUTER_KEY || ''
  if (!orKey) {
    try { orKey = fs.readFileSync(orKeyFile, 'utf8').trim() } catch { /* key optional — LLM falls back to heuristic */ }
  }

  return {
    plugins: [react()],
    base: basePath,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    // Allow accessing files outside src for migration
    server: {
      fs: {
        allow: ['..'],
      },
      // Proxy local ComfyUI (KREA2) so the browser avoids CORS.
      // App calls /comfy/* → http://127.0.0.1:8188/*
      proxy: {
        '/comfy': {
          target: process.env.COMFY_URL || 'http://127.0.0.1:8188',
          changeOrigin: true,
          ws: true, // proxy the /comfy/ws progress socket too
          rewrite: (p) => p.replace(/^\/comfy/, ''),
          // Recent ComfyUI returns 403 for requests carrying a cross-origin
          // Origin/Referer header (DNS-rebinding guard). Strip them on both
          // the HTTP calls and the WebSocket upgrade so they read as same-origin.
          configure: (proxy) => {
            const strip = (req: { removeHeader: (h: string) => void }) => {
              req.removeHeader('origin');
              req.removeHeader('referer');
            };
            proxy.on('proxyReq', strip);
            proxy.on('proxyReqWs', strip);
          },
        },
        // Proxy LLM calls to OpenRouter, injecting the key server-side so it
        // never reaches the browser bundle. App calls /llm/chat/completions.
        '/llm': {
          target: 'https://openrouter.ai/api/v1',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/llm/, ''),
          headers: orKey
            ? { Authorization: `Bearer ${orKey}`, 'HTTP-Referer': 'http://localhost', 'X-Title': 'MorpBase' }
            : undefined,
        },
      },
    },
  }
})
