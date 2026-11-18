import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// BASE_PATH is set by the GitHub Pages workflow (e.g. /camdex/); locally the app is served from /
export default defineConfig({ base: process.env.BASE_PATH || '/', plugins: [react()], server: { port: 5173 } });
