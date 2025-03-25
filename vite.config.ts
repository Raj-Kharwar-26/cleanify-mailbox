
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Define a complete EventEmitter class that mimics Node's EventEmitter
class EventEmitter {
  private events: Record<string, Array<(...args: any[]) => void>> = {};

  on(event: string, listener: (...args: any[]) => void): this {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
    return this;
  }

  emit(event: string, ...args: any[]): boolean {
    if (!this.events[event]) return false;
    this.events[event].forEach(listener => listener(...args));
    return true;
  }

  removeListener(event: string, listener: (...args: any[]) => void): this {
    if (!this.events[event]) return this;
    this.events[event] = this.events[event].filter(l => l !== listener);
    return this;
  }

  removeAllListeners(event?: string): this {
    if (event) {
      this.events[event] = [];
    } else {
      this.events = {};
    }
    return this;
  }

  once(event: string, listener: (...args: any[]) => void): this {
    const onceWrapper = (...args: any[]) => {
      listener(...args);
      this.removeListener(event, onceWrapper);
    };
    return this.on(event, onceWrapper);
  }

  listenerCount(event: string): number {
    return this.events[event]?.length || 0;
  }

  prependListener(event: string, listener: (...args: any[]) => void): this {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].unshift(listener);
    return this;
  }
}

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
    // Add missing process properties
    'process.stdout': { isTTY: true },
    'process.stderr': { isTTY: true },
    'process.version': '"v16.0.0"',
    'process.platform': '"browser"',
    // Add full process object
    'process': {
      env: {},
      stdout: { isTTY: true },
      stderr: { isTTY: true },
      version: '"v16.0.0"',
      platform: '"browser"',
      nextTick: (callback: Function, ...args: any[]) => setTimeout(() => callback(...args), 0)
    },
    'global': 'window',
    // Mock the node:events module correctly
    'node:events': { EventEmitter },
    'events': { EventEmitter }
  },
}));
