
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Define process.env for libraries that expect it
    'process.env': {},
    // Add missing process properties that googleapis might use
    'process.stdout': {},
    'process.stderr': {},
    'process.version': '"v16.0.0"',
    'process.platform': '"browser"',
    'process': {
      env: {},
      stdout: {},
      stderr: {},
      version: '"v16.0.0"',
      platform: '"browser"'
    },
    'global': {},
  },
}));
