
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
    'process.stdout': { isTTY: true },
    'process.stderr': { isTTY: true },
    'process.version': '"v16.0.0"',
    'process.platform': '"browser"',
    'process': {
      env: {},
      stdout: { isTTY: true },
      stderr: { isTTY: true },
      version: '"v16.0.0"',
      platform: '"browser"'
    },
    'global': {},
    // Mock the EventEmitter from Node.js
    'node:events': {
      EventEmitter: class EventEmitter {
        constructor() {
          this.events = {};
        }
        on(event, listener) {
          if (!this.events[event]) {
            this.events[event] = [];
          }
          this.events[event].push(listener);
          return this;
        }
        emit(event, ...args) {
          if (!this.events[event]) return false;
          this.events[event].forEach(listener => listener(...args));
          return true;
        }
        removeListener(event, listener) {
          if (!this.events[event]) return this;
          this.events[event] = this.events[event].filter(l => l !== listener);
          return this;
        }
      }
    }
  },
}));
